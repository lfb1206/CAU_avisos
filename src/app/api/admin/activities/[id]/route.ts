import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  equipment_recommendations: z.record(z.unknown()).nullable().optional(),
});

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin' ? user : null;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { equipment_recommendations, ...rest } = parsed.data;
  const activity = await prisma.activity.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      ...(equipment_recommendations !== undefined
        ? { equipment_recommendations: equipment_recommendations === null ? Prisma.JsonNull : (equipment_recommendations as Prisma.InputJsonValue) }
        : {}),
    },
  });
  return NextResponse.json(activity);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  await prisma.activity.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}

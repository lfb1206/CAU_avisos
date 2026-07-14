import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const activitySchema = z.object({
  name: z.string().min(1),
  equipment_recommendations: z.record(z.unknown()).optional(),
});

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin' ? user : null;
}

export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const activities = await prisma.activity.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { equipment_recommendations, ...rest } = parsed.data;
  const activity = await prisma.activity.create({
    data: {
      ...rest,
      ...(equipment_recommendations !== undefined
        ? { equipment_recommendations: equipment_recommendations as Prisma.InputJsonValue }
        : {}),
    },
  });
  return NextResponse.json(activity, { status: 201 });
}

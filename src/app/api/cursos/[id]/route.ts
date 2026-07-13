import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateTallerSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order_index: z.number().int().optional(),
  prerequisite_taller_ids: z.array(z.number().int()).optional(),
  content_outline: z.unknown().optional(),
});

// GET /api/cursos/[id] — taller detail with ediciones
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const taller = await prisma.taller.findUnique({
    where: { id: Number(id) },
    include: {
      ediciones: {
        where: { status: { not: 'cancelada' } },
        orderBy: { start_date: 'asc' },
        include: user
          ? {
              inscripciones: { where: { user_id: user.id }, select: { status: true } },
              _count: {
                select: {
                  inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
                },
              },
            }
          : {
              inscripciones: { where: { id: -1 }, select: { status: true } },
              _count: {
                select: {
                  inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
                },
              },
            },
      },
    },
  });

  if (!taller) return NextResponse.json({ error: 'Taller no encontrado' }, { status: 404 });

  const prereqTalleres =
    taller.prerequisite_taller_ids.length > 0
      ? await prisma.taller.findMany({
          where: { id: { in: taller.prerequisite_taller_ids } },
          select: { id: true, name: true },
        })
      : [];

  return NextResponse.json({ ...taller, prerequisiteTalleres: prereqTalleres });
}

// PATCH /api/cursos/[id] — admin only: update taller catalog entry
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin')
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = updateTallerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const taller = await prisma.taller.update({
    where: { id: Number(id) },
    data: parsed.data,
  });

  return NextResponse.json(taller);
}

// DELETE /api/cursos/[id] — admin only
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin')
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  await prisma.taller.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}

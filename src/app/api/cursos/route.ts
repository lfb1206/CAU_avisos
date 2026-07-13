import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createTallerSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  branch: z.enum(['base', 'nieve_hielo', 'roca']),
  level: z.enum(['introductorio', 'intermedio', 'intermedio_avanzado', 'avanzado']),
  order_index: z.number().int(),
  prerequisite_taller_ids: z.array(z.number().int()).default([]),
  content_outline: z.unknown().optional(),
});

// GET /api/cursos — list all talleres with edicion counts
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const talleres = await prisma.taller.findMany({
    orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
    include: {
      ediciones: user
        ? {
            where: { status: { not: 'cancelada' } },
            include: {
              inscripciones: { where: { user_id: user.id }, select: { status: true } },
              _count: {
                select: {
                  inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
                },
              },
            },
          }
        : {
            where: { status: { not: 'cancelada' } },
            select: {
              id: true,
              name: true,
              status: true,
              enrollment_open: true,
              capacity: true,
            },
          },
    },
  });

  return NextResponse.json(talleres);
}

// POST /api/cursos — admin: create a new Taller catalog entry
export async function POST(request: NextRequest) {
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
  const parsed = createTallerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const taller = await prisma.taller.create({ data: parsed.data });

  return NextResponse.json(taller, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

// GET /api/cursos — full data for the cursos page (talleres + user context + active points)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();

  const [talleres, userActivePoints] = await Promise.all([
    prisma.taller.findMany({
      orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
      include: {
        ediciones: {
          where: { status: { not: 'cancelada' } },
          orderBy: { start_date: 'asc' },
          include: user
            ? {
                inscripciones: {
                  where: { user_id: user.id },
                  select: { status: true },
                },
                ayudantias: {
                  where: { user_id: user.id },
                  select: { asistio: true },
                },
                _count: {
                  select: {
                    inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
                  },
                },
              }
            : {
                inscripciones: { where: { id: -1 }, select: { status: true } },
                ayudantias: { where: { id: -1 }, select: { asistio: true } },
                _count: {
                  select: {
                    inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
                  },
                },
              },
        },
      },
    }),
    user
      ? prisma.coursePoints
          .aggregate({
            where: { user_id: user.id, expires_at: { gt: now } },
            _sum: { points: true },
          })
          .then((r) => r._sum.points ?? 0)
      : Promise.resolve(0),
  ]);

  return NextResponse.json({ talleres, userActivePoints });
}

// POST /api/cursos — admin: create a new Taller catalog entry
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  const { content_outline, ...rest } = parsed.data;
  const taller = await prisma.taller.create({
    data: {
      ...rest,
      ...(content_outline !== undefined
        ? { content_outline: content_outline as Prisma.InputJsonValue }
        : {}),
    },
  });
  return NextResponse.json(taller, { status: 201 });
}

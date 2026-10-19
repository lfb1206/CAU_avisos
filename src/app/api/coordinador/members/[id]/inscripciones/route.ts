import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const backfillSchema = z.object({
  taller_id: z.number().int(),
  completed_at: z.string().optional().nullable(),
});

const HISTORICO_SUFFIX = ' — Histórico';

/**
 * POST /api/coordinador/members/[id]/inscripciones — backfill a historical course
 * completion for a member who took the course before this platform existed, with
 * no self-postulation to update. There's deliberately no schema change for this
 * (Inscripcion.edicion_id stays required): instead we find-or-create one generic
 * "<taller> — Histórico" EdicionTaller per taller and link the record there. This
 * keeps every existing prerequisite/ayudante/profile query — all of which traverse
 * inscripcion.edicion.taller_id — working unmodified.
 *
 * Upsert (not create) on the Inscripcion itself: re-running this for the same
 * member+taller corrects the record (e.g. a wrong completion date) instead of
 * throwing a unique-constraint error.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id: userId } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = backfillSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { taller_id, completed_at } = parsed.data;

  try {
    const [member, taller] = await Promise.all([
      prisma.profile.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.taller.findUnique({ where: { id: taller_id }, select: { id: true, name: true } }),
    ]);
    if (!member) return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
    if (!taller) return NextResponse.json({ error: 'Taller no encontrado' }, { status: 404 });

    const historicoName = `${taller.name}${HISTORICO_SUFFIX}`;

    const edicion = await prisma.edicionTaller.upsert({
      where: { taller_id_name: { taller_id, name: historicoName } },
      update: {},
      create: { taller_id, name: historicoName, enrollment_open: false },
    });

    const aprobadoAt = completed_at ? new Date(completed_at) : new Date();

    const inscripcion = await prisma.inscripcion.upsert({
      where: { edicion_id_user_id: { edicion_id: edicion.id, user_id: userId } },
      update: { status: 'completado', aprobado: true, aprobado_at: aprobadoAt },
      create: { edicion_id: edicion.id, user_id: userId, status: 'completado', aprobado: true, aprobado_at: aprobadoAt },
    });

    return NextResponse.json({ inscripcion, taller_name: taller.name }, { status: 201 });
  } catch (error) {
    console.error('[coordinador members inscripciones POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

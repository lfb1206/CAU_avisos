import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/ediciones/[id]/postular — member applies to an edicion
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const edicionId = Number(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const edicion = await prisma.edicionTaller.findUnique({
    where: { id: edicionId },
    include: { taller: true },
  });
  if (!edicion) return NextResponse.json({ error: 'Edición no encontrada' }, { status: 404 });
  if (edicion.status === 'cancelada')
    return NextResponse.json({ error: 'La edición está cancelada' }, { status: 409 });
  if (edicion.status === 'finalizada')
    return NextResponse.json({ error: 'La edición ya finalizó' }, { status: 409 });
  if (!edicion.enrollment_open)
    return NextResponse.json({ error: 'Las inscripciones no están abiertas' }, { status: 409 });

  // Check already inscribed
  const existing = await prisma.inscripcion.findUnique({
    where: { edicion_id_user_id: { edicion_id: edicionId, user_id: user.id } },
  });
  if (existing && existing.status !== 'rechazado' && existing.status !== 'retirado') {
    return NextResponse.json(
      { error: 'Ya tienes una postulación activa para esta edición' },
      { status: 409 }
    );
  }

  // Check prerequisites
  const taller = edicion.taller;
  if (taller.prerequisite_taller_ids.length > 0 && taller.branch !== 'base') {
    const completedInscripciones = await prisma.inscripcion.findMany({
      where: {
        user_id: user.id,
        status: 'completado',
        edicion: { taller_id: { in: taller.prerequisite_taller_ids } },
      },
      select: { edicion: { select: { taller_id: true } } },
    });
    const completedTallerIds = new Set(completedInscripciones.map((i) => i.edicion.taller_id));

    // Base branch talleres count as completed for everyone
    const baseTallers = await prisma.taller.findMany({
      where: { branch: 'base' },
      select: { id: true },
    });
    baseTallers.forEach((t) => completedTallerIds.add(t.id));

    const missing = taller.prerequisite_taller_ids.filter(
      (pid) => !completedTallerIds.has(pid)
    );
    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: 'No cumples los prerequisitos para postular a este taller',
          missing_prerequisites: missing,
        },
        { status: 422 }
      );
    }
  }

  // Check points requirement
  if (edicion.required_points > 0) {
    const now = new Date();
    const pointsResult = await prisma.coursePoints.aggregate({
      where: { user_id: user.id, expires_at: { gt: now } },
      _sum: { points: true },
    });
    const activePoints = pointsResult._sum.points ?? 0;
    if (activePoints < edicion.required_points) {
      return NextResponse.json(
        {
          error: `Necesitas ${edicion.required_points} puntos activos (tienes ${activePoints})`,
        },
        { status: 422 }
      );
    }
  }

  const body = (await request.json().catch(() => ({}))) as {
    grupo_sanguineo?: string | null;
    alergias?: string | null;
    medicamentos?: string | null;
    condiciones_especiales?: string | null;
    tiene_primeros_auxilios?: boolean;
  };

  const inscripcion = await prisma.inscripcion.upsert({
    where: { edicion_id_user_id: { edicion_id: edicionId, user_id: user.id } },
    update: {
      status: 'postulando',
      grupo_sanguineo: body.grupo_sanguineo ?? null,
      alergias: body.alergias ?? null,
      medicamentos: body.medicamentos ?? null,
      condiciones_especiales: body.condiciones_especiales ?? null,
      tiene_primeros_auxilios: body.tiene_primeros_auxilios ?? false,
      inscrito_at: new Date(),
    },
    create: {
      edicion_id: edicionId,
      user_id: user.id,
      status: 'postulando',
      grupo_sanguineo: body.grupo_sanguineo ?? null,
      alergias: body.alergias ?? null,
      medicamentos: body.medicamentos ?? null,
      condiciones_especiales: body.condiciones_especiales ?? null,
      tiene_primeros_auxilios: body.tiene_primeros_auxilios ?? false,
    },
  });

  return NextResponse.json({ inscripcion, taller_name: taller.name }, { status: 201 });
}

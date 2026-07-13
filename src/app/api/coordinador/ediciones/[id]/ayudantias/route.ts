import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

async function guardCoordinador() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { id: true, role: true },
  });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) return null;
  return { id: profile.id, role: profile.role };
}

// GET /api/coordinador/ediciones/[id]/ayudantias — list ayudantias
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const coord = await guardCoordinador();
  if (!coord) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;

  const ayudantias = await prisma.ayudantia.findMany({
    where: { edicion_id: Number(id) },
    include: {
      profile: { select: { name: true, email: true } },
    },
    orderBy: { signed_up_at: 'asc' },
  });

  return NextResponse.json(
    ayudantias.map((a) => ({
      id: a.id,
      user_id: a.user_id,
      asistio: a.asistio,
      puntos_otorgados: a.puntos_otorgados,
      signed_up_at: a.signed_up_at.toISOString(),
      profile: { name: a.profile.name, email: a.profile.email },
    }))
  );
}

// PATCH /api/coordinador/ediciones/[id]/ayudantias — mark asistio, award points
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const coord = await guardCoordinador();
  if (!coord) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const edicionId = Number(id);

  const body = (await request.json()) as {
    user_id: string;
    asistio?: boolean | null;
    puntos_otorgados?: boolean;
  };

  if (!body.user_id) {
    return NextResponse.json({ error: 'user_id es requerido' }, { status: 400 });
  }

  const updateData: { asistio?: boolean | null; puntos_otorgados?: boolean } = {};
  if (body.asistio !== undefined) updateData.asistio = body.asistio;
  if (body.puntos_otorgados !== undefined) updateData.puntos_otorgados = body.puntos_otorgados;

  const updated = await prisma.ayudantia.update({
    where: { edicion_id_user_id: { edicion_id: edicionId, user_id: body.user_id } },
    data: updateData,
    select: { id: true, user_id: true, asistio: true, puntos_otorgados: true },
  });

  // If awarding points, create a CoursePoints entry
  if (body.puntos_otorgados && !updated.puntos_otorgados) {
    // already set to true above — create the point entry
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const edicion = await prisma.edicionTaller.findUnique({
      where: { id: edicionId },
      include: { taller: { select: { name: true } } },
    });

    await prisma.coursePoints.create({
      data: {
        user_id: body.user_id,
        edicion_id: edicionId,
        points: 1,
        awarded_by: coord.id,
        description: `Ayudante en ${edicion?.taller.name ?? 'taller'} — ${edicion?.name ?? ''}`,
        expires_at: expiresAt,
      },
    });
  }

  return NextResponse.json(updated);
}

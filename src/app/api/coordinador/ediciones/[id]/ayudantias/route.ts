import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/coordinador/ediciones/[id]/ayudantias — list ayudantias
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
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
  } catch (error) {
    console.error('[coordinador ayudantias GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH /api/coordinador/ediciones/[id]/ayudantias — mark asistio, award points
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

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

  try {
    const updated = await prisma.ayudantia.update({
      where: { edicion_id_user_id: { edicion_id: edicionId, user_id: body.user_id } },
      data: updateData,
      select: { id: true, user_id: true, asistio: true, puntos_otorgados: true },
    });

    // If awarding points, create a CoursePoints entry
    if (body.puntos_otorgados && !updated.puntos_otorgados) {
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
          awarded_by: auth.user.id,
          description: `Ayudante en ${edicion?.taller.name ?? 'taller'} — ${edicion?.name ?? ''}`,
          expires_at: expiresAt,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[coordinador ayudantias PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

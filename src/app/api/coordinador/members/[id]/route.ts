import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/coordinador/members/[id] — full member profile for coordinador view
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        rut: true,
        role: true,
        created_at: true,
      },
    });

    if (!profile) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const now = new Date();

    const [inscripciones, ayudantias, avisos, activePoints] = await Promise.all([
      prisma.inscripcion.findMany({
        where: { user_id: id },
        select: {
          status: true,
          inscrito_at: true,
          aprobado_at: true,
          edicion: { select: { name: true, taller: { select: { name: true, branch: true } } } },
        },
        orderBy: { inscrito_at: 'desc' },
      }),
      prisma.ayudantia.findMany({
        where: { user_id: id },
        select: {
          asistio: true,
          signed_up_at: true,
          edicion: { select: { name: true, taller: { select: { name: true } } } },
        },
        orderBy: { signed_up_at: 'desc' },
      }),
      prisma.aviso.findMany({
        where: { created_by: id },
        select: { id: true, title: true, status: true, activity_date: true, created_at: true },
        orderBy: { created_at: 'desc' },
        take: 10,
      }),
      prisma.coursePoints.aggregate({
        where: { user_id: id, expires_at: { gt: now } },
        _sum: { points: true },
      }),
    ]);

    return NextResponse.json({
      profile,
      activePoints: activePoints._sum.points ?? 0,
      inscripciones,
      ayudantias,
      avisos,
    });
  } catch (error) {
    console.error('[coordinador members GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

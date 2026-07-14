import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

async function guardCoordinador() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) return null;
  return user;
}

// GET /api/coordinador/members/[id] — full member profile for coordinador view
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;

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
}

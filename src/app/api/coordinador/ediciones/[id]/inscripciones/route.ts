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

// GET /api/coordinador/ediciones/[id]/inscripciones
// Returns inscripciones for the edicion, sorted by active points descending.
// Each entry includes the member's completed courses for course history.
export async function GET(request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const edicionId = Number(id);

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  const now = new Date();

  const inscripciones = await prisma.inscripcion.findMany({
    where: {
      edicion_id: edicionId,
      ...(statusFilter ? { status: statusFilter as 'aceptado' } : {}),
    },
    include: {
      profile: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          received_points: {
            where: { expires_at: { gt: now } },
            select: { points: true },
          },
        },
      },
    },
    orderBy: { inscrito_at: 'asc' },
  });

  // Fetch completed courses for all applicants in one query
  const userIds = inscripciones.map((i) => i.user_id);
  const completedMap = new Map<string, { tallerName: string; branch: string; completedAt: string | null }[]>();

  if (userIds.length > 0) {
    const completed = await prisma.inscripcion.findMany({
      where: { user_id: { in: userIds }, status: 'completado' },
      select: {
        user_id: true,
        aprobado_at: true,
        edicion: { select: { taller: { select: { name: true, branch: true } } } },
      },
      orderBy: { aprobado_at: 'desc' },
    });

    for (const c of completed) {
      const list = completedMap.get(c.user_id) ?? [];
      list.push({
        tallerName: c.edicion.taller.name,
        branch: c.edicion.taller.branch,
        completedAt: c.aprobado_at?.toISOString() ?? null,
      });
      completedMap.set(c.user_id, list);
    }
  }

  const result = inscripciones
    .map((insc) => ({
      id: insc.id,
      user_id: insc.user_id,
      status: insc.status,
      aprobado: insc.aprobado,
      grupo_sanguineo: insc.grupo_sanguineo,
      alergias: insc.alergias,
      medicamentos: insc.medicamentos,
      condiciones_especiales: insc.condiciones_especiales,
      tiene_primeros_auxilios: insc.tiene_primeros_auxilios,
      notas_coordinador: insc.notas_coordinador,
      inscrito_at: insc.inscrito_at.toISOString(),
      profile: {
        name: insc.profile.name,
        email: insc.profile.email,
        phone: insc.profile.phone,
      },
      activePoints: insc.profile.received_points.reduce((sum, p) => sum + p.points, 0),
      completedCourses: completedMap.get(insc.user_id) ?? [],
    }))
    .sort((a, b) => b.activePoints - a.activePoints);

  return NextResponse.json(result);
}

// PATCH /api/coordinador/ediciones/[id]/inscripciones — update an inscripcion status
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const edicionId = Number(id);

  const body = (await request.json()) as {
    user_id: string;
    status: string;
    notas_coordinador?: string | null;
    aprobado?: boolean | null;
  };

  if (!body.user_id || !body.status) {
    return NextResponse.json({ error: 'user_id y status son requeridos' }, { status: 400 });
  }

  const updated = await prisma.inscripcion.update({
    where: { edicion_id_user_id: { edicion_id: edicionId, user_id: body.user_id } },
    data: {
      status: body.status as 'aceptado',
      ...(body.notas_coordinador !== undefined ? { notas_coordinador: body.notas_coordinador } : {}),
      ...(body.aprobado !== undefined ? { aprobado: body.aprobado } : {}),
      ...(body.status === 'aceptado' ? { aprobado_at: new Date(), aprobado: true } : {}),
    },
    select: { id: true, user_id: true, status: true, aprobado: true, notas_coordinador: true },
  });

  return NextResponse.json(updated);
}

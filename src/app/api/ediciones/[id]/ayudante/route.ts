import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/ediciones/[id]/ayudante — sign up as ayudante for an edicion
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const edicionId = Number(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const edicion = await prisma.edicionTaller.findUnique({
      where: { id: edicionId },
      include: { taller: true },
    });
    if (!edicion) return NextResponse.json({ error: 'Edición no encontrada' }, { status: 404 });
    if (!edicion.enrollment_open)
      return NextResponse.json({ error: 'Las inscripciones no están abiertas' }, { status: 409 });
    if (edicion.status === 'cancelada' || edicion.status === 'finalizada')
      return NextResponse.json({ error: 'La edición no está disponible' }, { status: 409 });

    // Must have completed this taller (or base branch = auto-completed)
    const taller = edicion.taller;
    const autoCompleted = taller.branch === 'base';
    if (!autoCompleted) {
      const completedInscripcion = await prisma.inscripcion.findFirst({
        where: {
          user_id: user.id,
          status: 'completado',
          edicion: { taller_id: taller.id },
        },
      });
      if (!completedInscripcion) {
        return NextResponse.json(
          { error: 'Debes haber completado este taller para ser ayudante' },
          { status: 422 }
        );
      }
    }

    // Check not already ayudante
    const existing = await prisma.ayudantia.findUnique({
      where: { edicion_id_user_id: { edicion_id: edicionId, user_id: user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Ya estás registrado como ayudante' }, { status: 409 });
    }

    const ayudantia = await prisma.ayudantia.create({
      data: { edicion_id: edicionId, user_id: user.id },
    });

    return NextResponse.json({ ayudantia, taller_name: taller.name }, { status: 201 });
  } catch (error) {
    console.error('[ediciones ayudante POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/ediciones/[id]/ayudante — cancel ayudantia
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const edicionId = Number(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    await prisma.ayudantia.deleteMany({
      where: { edicion_id: edicionId, user_id: user.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[ediciones ayudante DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

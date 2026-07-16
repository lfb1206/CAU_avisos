import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/ediciones/[id] — public info about an edicion (used by the postular page)
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const edicion = await prisma.edicionTaller.findUnique({
      where: { id: Number(id) },
      include: {
        taller: { select: { name: true, branch: true } },
        _count: {
          select: {
            inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } },
          },
        },
      },
    });

    if (!edicion) return NextResponse.json({ error: 'Edición no encontrada' }, { status: 404 });
    return NextResponse.json(edicion);
  } catch (error) {
    console.error('[ediciones GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

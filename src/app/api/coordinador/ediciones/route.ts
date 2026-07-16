import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createEdicionSchema = z.object({
  taller_id: z.number().int(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  capacity: z.number().int().default(20),
  max_ayudantes: z.number().int().default(0),
  required_points: z.number().int().default(0),
});

// GET /api/coordinador/ediciones — list all ediciones with counts
export async function GET(request: NextRequest) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const ediciones = await prisma.edicionTaller.findMany({
      orderBy: [{ start_date: 'asc' }],
      include: {
        taller: { select: { name: true, branch: true } },
        _count: { select: { inscripciones: true, ayudantias: true } },
      },
    });
    return NextResponse.json(ediciones);
  } catch (error) {
    console.error('[coordinador ediciones GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/coordinador/ediciones — create a new EdicionTaller
export async function POST(request: NextRequest) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = createEdicionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { taller_id, start_date, end_date, ...rest } = parsed.data;

  try {
    const taller = await prisma.taller.findUnique({ where: { id: taller_id }, select: { name: true } });
    if (!taller) return NextResponse.json({ error: 'Taller no encontrado' }, { status: 404 });

    const year = start_date ? new Date(start_date).getFullYear() : new Date().getFullYear();
    const name = `${taller.name} ${year}`;

    const edicion = await prisma.edicionTaller.create({
      data: {
        taller_id,
        name,
        ...rest,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
      include: { taller: { select: { name: true, branch: true } } },
    });
    return NextResponse.json(edicion, { status: 201 });
  } catch (error) {
    console.error('[coordinador ediciones POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

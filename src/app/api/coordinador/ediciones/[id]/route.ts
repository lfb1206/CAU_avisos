import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const patchEdicionSchema = z.object({
  name: z.string().min(1).optional(),
  status: z
    .enum(['planificada', 'inscripciones_abiertas', 'en_curso', 'finalizada', 'cancelada'])
    .optional(),
  enrollment_open: z.boolean().optional(),
  capacity: z.number().int().optional(),
  max_ayudantes: z.number().int().optional(),
  price: z.number().nullable().optional(),
  price_student: z.number().nullable().optional(),
  required_points: z.number().int().optional(),
  profesor: z.string().nullable().optional(),
  fecha_clases: z.string().nullable().optional(),
  fecha_salida: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});

// PATCH /api/coordinador/ediciones/[id] — update edicion settings
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchEdicionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { start_date, end_date, enrollment_open, ...rest } = parsed.data;

  try {
    const edicion = await prisma.edicionTaller.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(start_date !== undefined
          ? { start_date: start_date ? new Date(start_date) : null }
          : {}),
        ...(end_date !== undefined ? { end_date: end_date ? new Date(end_date) : null } : {}),
        ...(enrollment_open !== undefined
          ? {
              enrollment_open,
              enrollment_opens_at: enrollment_open ? new Date() : null,
              // Auto-update status when opening/closing
              status: enrollment_open ? 'inscripciones_abiertas' : (rest.status ?? undefined),
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        status: true,
        enrollment_open: true,
        enrollment_opens_at: true,
        capacity: true,
        required_points: true,
      },
    });
    return NextResponse.json(edicion);
  } catch (error) {
    console.error('[coordinador ediciones PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/coordinador/ediciones/[id] — cancel (soft delete) an edicion
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await prisma.edicionTaller.update({
      where: { id: Number(id) },
      data: { status: 'cancelada', enrollment_open: false },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[coordinador ediciones DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

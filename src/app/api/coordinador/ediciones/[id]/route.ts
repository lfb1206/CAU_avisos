import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

async function guardCoordinador() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) return null;
  return user;
}

const patchEdicionSchema = z.object({
  name: z.string().min(1).optional(),
  status: z
    .enum(['planificada', 'inscripciones_abiertas', 'en_curso', 'finalizada', 'cancelada'])
    .optional(),
  enrollment_open: z.boolean().optional(),
  capacity: z.number().int().optional(),
  price: z.number().nullable().optional(),
  required_points: z.number().int().optional(),
  location: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  coordinador_id: z.string().uuid().nullable().optional(),
});

// PATCH /api/coordinador/ediciones/[id] — update edicion settings
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchEdicionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { start_date, end_date, enrollment_open, ...rest } = parsed.data;

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
            status:
              enrollment_open
                ? 'inscripciones_abiertas'
                : (rest.status ?? undefined),
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
}

// DELETE /api/coordinador/ediciones/[id] — cancel (soft delete) an edicion
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;

  await prisma.edicionTaller.update({
    where: { id: Number(id) },
    data: { status: 'cancelada', enrollment_open: false },
  });

  return new NextResponse(null, { status: 204 });
}

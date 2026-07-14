import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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

const createEdicionSchema = z.object({
  taller_id: z.number().int(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  capacity: z.number().int().default(20),
  max_ayudantes: z.number().int().default(0),
  required_points: z.number().int().default(0),
});

// GET /api/coordinador/ediciones — list all ediciones with counts
export async function GET() {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const ediciones = await prisma.edicionTaller.findMany({
    orderBy: [{ start_date: 'asc' }],
    include: {
      taller: { select: { name: true, branch: true } },
      _count: { select: { inscripciones: true, ayudantias: true } },
    },
  });

  return NextResponse.json(ediciones);
}

// POST /api/coordinador/ediciones — create a new EdicionTaller
export async function POST(request: NextRequest) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = createEdicionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { taller_id, start_date, end_date, ...rest } = parsed.data;

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
}

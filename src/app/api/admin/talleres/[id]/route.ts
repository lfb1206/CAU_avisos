import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

async function guardAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  return profile?.role === 'admin' ? user : null;
}

const patchSchema = z.object({
  description:          z.string().optional(),
  objetivo:             z.string().nullable().optional(),
  contenidos:           z.string().nullable().optional(),
  habilidades:          z.string().nullable().optional(),
  equipo_personal:      z.string().nullable().optional(),
  equipo_recomendado:   z.string().nullable().optional(),
  equipo_cau:           z.string().nullable().optional(),
  evaluacion_metodo:    z.string().nullable().optional(),
  lugar_tipico:         z.string().nullable().optional(),
  condiciones_lugar:    z.string().nullable().optional(),
  requisitos_personales:z.string().nullable().optional(),
  observaciones:        z.string().nullable().optional(),
  rutas_posibles:       z.string().nullable().optional(),
  bibliografia:         z.string().nullable().optional(),
  prueba_convalidacion: z.string().nullable().optional(),
  horas_clases:         z.number().nullable().optional(),
  horas_practica:       z.number().nullable().optional(),
  horas_evaluacion:     z.number().nullable().optional(),
  dias_terreno:         z.number().nullable().optional(),
  dias_traslado:        z.number().nullable().optional(),
});

// PATCH /api/admin/talleres/[id] — update taller curriculum fields
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await guardAdmin();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const taller = await prisma.taller.update({
    where: { id: Number(id) },
    data: parsed.data,
  });

  return NextResponse.json(taller);
}

// GET /api/admin/talleres/[id] — fetch single taller with all curriculum fields
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const taller = await prisma.taller.findUnique({ where: { id: Number(id) } });
  if (!taller) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(taller);
}

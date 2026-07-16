import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin, apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  description:           z.string().optional(),
  objetivo:              z.string().nullable().optional(),
  contenidos:            z.string().nullable().optional(),
  habilidades:           z.string().nullable().optional(),
  equipo_personal:       z.string().nullable().optional(),
  equipo_recomendado:    z.string().nullable().optional(),
  equipo_cau:            z.string().nullable().optional(),
  evaluacion_metodo:     z.string().nullable().optional(),
  lugar_tipico:          z.string().nullable().optional(),
  condiciones_lugar:     z.string().nullable().optional(),
  requisitos_personales: z.string().nullable().optional(),
  observaciones:         z.string().nullable().optional(),
  rutas_posibles:        z.string().nullable().optional(),
  bibliografia:          z.string().nullable().optional(),
  prueba_convalidacion:  z.string().nullable().optional(),
  horas_clases:          z.number().nullable().optional(),
  horas_practica:        z.number().nullable().optional(),
  horas_evaluacion:      z.number().nullable().optional(),
  dias_terreno:          z.number().nullable().optional(),
  dias_traslado:         z.number().nullable().optional(),
});

// PATCH /api/admin/talleres/[id] — update taller curriculum fields
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const taller = await prisma.taller.update({ where: { id: Number(id) }, data: parsed.data });
    return NextResponse.json(taller);
  } catch (error) {
    console.error('[admin talleres PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET /api/admin/talleres/[id] — fetch single taller with all curriculum fields
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const taller = await prisma.taller.findUnique({ where: { id: Number(id) } });
    if (!taller) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(taller);
  } catch (error) {
    console.error('[admin talleres GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

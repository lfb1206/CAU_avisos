import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { EQUIPO_CLUB_POOL_KEY, ensureEquipoClubPool, getAvailability } from '@/lib/inventory';

const itemSchema = z.object({
  uso: z.string().min(1),
  descripcion: z.string().min(1),
  cantidad: z.number().int().min(0),
  estado: z.enum(['nuevo', 'bueno', 'con_uso', 'gastado', 'roto']).default('bueno'),
  en_inspeccion: z.number().int().min(0).default(0),
  fecha_compra: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

// GET /api/custodio/items — full Equipo Club catalog (incl. inactive) with live availability
export async function GET(request: NextRequest) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const pool = await prisma.inventoryPool.findUnique({ where: { key: EQUIPO_CLUB_POOL_KEY } });
    if (!pool) return NextResponse.json([]);

    const items = await prisma.inventoryItem.findMany({
      where: { pool_id: pool.id },
      orderBy: [{ uso: 'asc' }, { descripcion: 'asc' }],
    });
    const availability = await getAvailability(items);

    return NextResponse.json(items.map((item) => ({ ...item, disponible: availability.get(item.id) ?? 0 })));
  } catch (error) {
    console.error('[custodio items GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST /api/custodio/items — add a new gear type to the Equipo Club catalog
export async function POST(request: NextRequest) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { fecha_compra, ...rest } = parsed.data;

  try {
    const pool = await ensureEquipoClubPool();
    const item = await prisma.inventoryItem.create({
      data: {
        ...rest,
        pool_id: pool.id,
        fecha_compra: fecha_compra ? new Date(fecha_compra) : null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[custodio items POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

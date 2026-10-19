import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EQUIPO_CLUB_POOL_KEY, getAvailability } from '@/lib/inventory';

// GET /api/prestamos/items — active Equipo Club catalog with live availability
export async function GET(request: NextRequest) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const pool = await prisma.inventoryPool.findUnique({ where: { key: EQUIPO_CLUB_POOL_KEY } });
    if (!pool) return NextResponse.json([]);

    const items = await prisma.inventoryItem.findMany({
      where: { pool_id: pool.id, active: true },
      orderBy: [{ uso: 'asc' }, { descripcion: 'asc' }],
    });

    const availability = await getAvailability(items);

    // Strip the actual photo payload — fetched separately, on demand, via
    // GET /api/prestamos/items/[id]/foto — so the catalog list stays light.
    return NextResponse.json(
      items.map(({ foto_base64, ...item }) => ({
        ...item,
        disponible: availability.get(item.id) ?? 0,
        tiene_foto: !!foto_base64,
      }))
    );
  } catch (error) {
    console.error('[prestamos items GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

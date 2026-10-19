import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EQUIPO_CLUB_POOL_KEY, getAvailability, getLatestReturnPhotoIds } from '@/lib/inventory';

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

    const [availability, photoIds] = await Promise.all([
      getAvailability(items),
      getLatestReturnPhotoIds(items.map((item) => item.id)),
    ]);

    return NextResponse.json(
      items.map((item) => ({
        ...item,
        disponible: availability.get(item.id) ?? 0,
        tiene_foto_reciente: photoIds.has(item.id),
      }))
    );
  } catch (error) {
    console.error('[prestamos items GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

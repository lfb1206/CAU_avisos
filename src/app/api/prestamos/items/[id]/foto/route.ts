import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/prestamos/items/[id]/foto — on-demand fetch of an item's custodio-set
 * photo. Deliberately separate from the catalog-list routes (which only expose a
 * cheap `tiene_foto` boolean) so browsing the catalog never pulls every item's
 * base64 image payload at once — this is only called when someone actually wants
 * to see the photo (e.g. clicking a thumbnail).
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: Number(id) },
      select: { foto_base64: true },
    });

    return NextResponse.json({ foto: item?.foto_base64 ?? null });
  } catch (error) {
    console.error('[prestamos item foto GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/prestamos/items/[id]/foto — on-demand fetch of an item's most recent
 * return photo. Deliberately separate from the catalog-list routes (which only
 * expose a cheap `tiene_foto_reciente` boolean) so browsing the catalog never
 * pulls every item's base64 image payload at once — this is only called when
 * someone actually wants to see the photo (e.g. clicking a thumbnail).
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const latest = await prisma.loanItem.findFirst({
      where: {
        inventory_item_id: Number(id),
        loan_request: { status: 'devuelto', return_photo_base64: { not: null } },
      },
      select: { loan_request: { select: { return_photo_base64: true, returned_at: true } } },
      orderBy: { loan_request: { returned_at: 'desc' } },
    });

    return NextResponse.json({ foto: latest?.loan_request.return_photo_base64 ?? null });
  } catch (error) {
    console.error('[prestamos item foto GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

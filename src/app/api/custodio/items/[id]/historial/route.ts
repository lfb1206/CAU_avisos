import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/custodio/items/[id]/historial — every loan that ever included this item,
// newest first. Answers "who last had this" if an item comes back damaged or lost.
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const history = await prisma.loanItem.findMany({
      where: { inventory_item_id: Number(id) },
      include: {
        loan_request: {
          select: {
            id: true,
            status: true,
            requested_at: true,
            delivered_at: true,
            returned_at: true,
            return_due_date: true,
            pickup_photo_base64: true,
            return_photo_base64: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { loan_request: { requested_at: 'desc' } },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('[custodio item historial GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

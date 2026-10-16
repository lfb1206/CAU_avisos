import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/custodio/solicitudes/[id]/return — custodio confirms the item was received back.
// Requires the borrower to have already uploaded the return photo themselves via
// foto-devolucion — the custodio does not supply a photo here.
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.status !== 'entregado') {
      return NextResponse.json({ error: 'Solo se puede marcar como devuelto un préstamo entregado.' }, { status: 409 });
    }
    if (!loan.return_photo_base64) {
      return NextResponse.json(
        { error: 'El solicitante todavía no sube la foto de devolución. Pídele que la suba antes de confirmar.' },
        { status: 409 }
      );
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { status: 'devuelto', returned_at: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[custodio solicitud return POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

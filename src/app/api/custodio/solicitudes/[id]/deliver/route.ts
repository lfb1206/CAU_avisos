import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/custodio/solicitudes/[id]/deliver — custodio hands gear over at pickup.
// No photo required here: only the return photo documents the gear's condition
// (its last state), so pickup is just a plain status confirmation.
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.status !== 'aprobado') {
      return NextResponse.json({ error: 'Solo se puede marcar como entregado un préstamo aprobado.' }, { status: 409 });
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { status: 'entregado', delivered_at: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[custodio solicitud deliver POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

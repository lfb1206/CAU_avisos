import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail, PRESTAMOS_FROM } from '@/lib/email';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/custodio/solicitudes/[id]/approve
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) }, include: { user: true } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.status !== 'pendiente') {
      return NextResponse.json({ error: 'Solo se pueden aprobar solicitudes pendientes.' }, { status: 409 });
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { status: 'aprobado', decided_at: new Date() },
    });

    sendEmail({
      from: PRESTAMOS_FROM,
      to: loan.user.email,
      subject: 'Tu solicitud de equipo fue aprobada',
      html: `<p>Hola ${loan.user.name || ''}, tu solicitud de préstamo de equipo CAU fue aprobada. Coordina el retiro con el Custodio.</p>`,
    }).catch(console.error);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[custodio solicitud approve POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

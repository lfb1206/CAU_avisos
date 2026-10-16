import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail, PRESTAMOS_FROM } from '@/lib/email';

type RouteContext = { params: Promise<{ id: string }> };

const rejectSchema = z.object({ cancel_reason: z.string().min(1, 'Debes indicar un motivo') });

// POST /api/custodio/solicitudes/[id]/reject
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) }, include: { user: true } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.status !== 'pendiente') {
      return NextResponse.json({ error: 'Solo se pueden rechazar solicitudes pendientes.' }, { status: 409 });
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { status: 'rechazado', decided_at: new Date(), cancel_reason: parsed.data.cancel_reason },
    });

    sendEmail({
      from: PRESTAMOS_FROM,
      to: loan.user.email,
      subject: 'Tu solicitud de equipo fue rechazada',
      html: `<p>Hola ${loan.user.name || ''}, tu solicitud de préstamo de equipo CAU fue rechazada.</p><p><strong>Motivo:</strong> ${parsed.data.cancel_reason}</p>`,
    }).catch(console.error);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[custodio solicitud reject POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const deliverSchema = z.object({ pickup_photo_base64: z.string().min(1, 'Se requiere una foto de retiro') });

// POST /api/custodio/solicitudes/[id]/deliver — custodio hands gear over at pickup
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = deliverSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.status !== 'aprobado') {
      return NextResponse.json({ error: 'Solo se puede marcar como entregado un préstamo aprobado.' }, { status: 409 });
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { status: 'entregado', delivered_at: new Date(), pickup_photo_base64: parsed.data.pickup_photo_base64 },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[custodio solicitud deliver POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const cancelSchema = z.object({ cancel_reason: z.string().min(1).optional() });

// POST /api/prestamos/solicitudes/[id]/cancel — borrower cancels their own pending/aprobado request
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.user_id !== auth.user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    if (loan.status !== 'pendiente' && loan.status !== 'aprobado') {
      return NextResponse.json({ error: 'Esta solicitud ya no se puede cancelar.' }, { status: 409 });
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: {
        status: 'cancelado',
        cancel_reason: parsed.data.cancel_reason ?? 'Cancelado por el solicitante',
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[prestamos solicitud cancel POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

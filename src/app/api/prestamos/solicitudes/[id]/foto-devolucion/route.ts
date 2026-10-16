import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const fotoSchema = z.object({ return_photo_base64: z.string().min(1, 'Se requiere una foto') });

// POST /api/prestamos/solicitudes/[id]/foto-devolucion — borrower uploads the return
// photo themselves, before physically handing the gear back. The custodio's `return`
// action requires this to already be set rather than supplying it on the borrower's behalf.
export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = fotoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const loan = await prisma.loanRequest.findUnique({ where: { id: Number(id) } });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    if (loan.user_id !== auth.user.id) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    if (loan.status !== 'entregado') {
      return NextResponse.json(
        { error: 'Solo puedes subir la foto de devolución mientras el préstamo está entregado.' },
        { status: 409 }
      );
    }

    const updated = await prisma.loanRequest.update({
      where: { id: loan.id },
      data: { return_photo_base64: parsed.data.return_photo_base64, return_photo_uploaded_at: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[prestamos foto-devolucion POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

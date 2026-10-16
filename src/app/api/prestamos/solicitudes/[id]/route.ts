import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/prestamos/solicitudes/[id] — owner or custodio/admin
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const loan = await prisma.loanRequest.findUnique({
      where: { id: Number(id) },
      include: {
        items: { include: { inventory_item: { select: { id: true, descripcion: true, uso: true } } } },
        pool: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true, phone: true, rut: true } },
        // Privacy boundary: only the aviso's denormalized, searchable fields — never
        // form_data. Safe here even for the owner's own aviso, and staff never see
        // another member's full aviso through this route.
        aviso: {
          select: { id: true, location: true, activity_date: true, activity_type: true, participant_names_text: true },
        },
      },
    });
    if (!loan) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    const isOwner = loan.user_id === auth.user.id;
    const isStaff = auth.profile.role === 'admin' || auth.profile.role === 'custodio';
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    return NextResponse.json(loan);
  } catch (error) {
    console.error('[prestamos solicitud GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

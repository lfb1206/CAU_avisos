import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EQUIPO_CLUB_POOL_KEY } from '@/lib/inventory';
import type { LoanStatus } from '@prisma/client';

const VALID_STATUSES: LoanStatus[] = ['pendiente', 'aprobado', 'entregado', 'devuelto', 'rechazado', 'cancelado'];

// GET /api/custodio/solicitudes — all loan requests for the Equipo Club pool, optionally filtered by status
export async function GET(request: NextRequest) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const statusParam = request.nextUrl.searchParams.get('status');
  const statusFilter = VALID_STATUSES.includes(statusParam as LoanStatus) ? (statusParam as LoanStatus) : null;

  try {
    const pool = await prisma.inventoryPool.findUnique({ where: { key: EQUIPO_CLUB_POOL_KEY } });
    if (!pool) return NextResponse.json([]);

    const loans = await prisma.loanRequest.findMany({
      where: { pool_id: pool.id, ...(statusFilter ? { status: statusFilter } : {}) },
      include: {
        items: { include: { inventory_item: { select: { id: true, descripcion: true, uso: true } } } },
        user: { select: { id: true, name: true, email: true, phone: true, rut: true } },
        // Privacy boundary: only the aviso's denormalized, searchable fields — never
        // form_data, which belongs to the borrower and may hold other participants'
        // medical/contact details.
        aviso: {
          select: { id: true, location: true, activity_date: true, activity_type: true, participant_names_text: true },
        },
      },
      orderBy: { requested_at: 'desc' },
    });
    return NextResponse.json(loans);
  } catch (error) {
    console.error('[custodio solicitudes GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

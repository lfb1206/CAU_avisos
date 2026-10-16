import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureEquipoClubPool } from '@/lib/inventory';

// GET /api/admin/pools — list inventory pools and their assigned custodian
export async function GET(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await ensureEquipoClubPool();
    const pools = await prisma.inventoryPool.findMany({
      include: { custodian: { select: { id: true, name: true, email: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(pools);
  } catch (error) {
    console.error('[admin pools GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

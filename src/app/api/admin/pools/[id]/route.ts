import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updatePoolSchema = z.object({ custodian_id: z.string().uuid().nullable() });

// PATCH /api/admin/pools/[id] — assign (or clear) who custodies a pool
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updatePoolSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const pool = await prisma.inventoryPool.update({
      where: { id: Number(id) },
      data: { custodian_id: parsed.data.custodian_id },
      include: { custodian: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(pool);
  } catch (error) {
    console.error('[admin pool PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

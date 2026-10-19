import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCustodio } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  uso: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  cantidad: z.number().int().min(0).optional(),
  estado: z.enum(['nuevo', 'bueno', 'con_uso', 'gastado', 'roto']).optional(),
  en_inspeccion: z.number().int().min(0).optional(),
  fecha_compra: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
  instrucciones_uso: z.string().optional().nullable(),
  foto_base64: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

// PATCH /api/custodio/items/[id] — edit a gear type's catalog fields
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { fecha_compra, ...rest } = parsed.data;

  try {
    const item = await prisma.inventoryItem.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(fecha_compra !== undefined ? { fecha_compra: fecha_compra ? new Date(fecha_compra) : null } : {}),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('[custodio item PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/custodio/items/[id] — always a soft delete (active: false), so loan
// history referencing this item is never at risk of dangling or being lost.
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireCustodio(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const item = await prisma.inventoryItem.update({
      where: { id: Number(id) },
      data: { active: false },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('[custodio item DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

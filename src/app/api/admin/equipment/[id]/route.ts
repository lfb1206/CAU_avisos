import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  category: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const item = await prisma.equipmentItem.update({
      where: { id: Number(id) },
      data: parsed.data,
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error('[admin equipment PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await prisma.equipmentItem.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[admin equipment DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

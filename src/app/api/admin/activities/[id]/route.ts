import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  equipment_recommendations: z.record(z.unknown()).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { equipment_recommendations, ...rest } = parsed.data;

  try {
    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(equipment_recommendations !== undefined
          ? {
              equipment_recommendations:
                equipment_recommendations === null
                  ? Prisma.JsonNull
                  : (equipment_recommendations as Prisma.InputJsonValue),
            }
          : {}),
      },
    });
    return NextResponse.json(activity);
  } catch (error) {
    console.error('[admin activities PATCH]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    await prisma.activity.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[admin activities DELETE]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

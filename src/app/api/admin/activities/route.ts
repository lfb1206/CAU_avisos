import { NextRequest, NextResponse } from 'next/server';
import { apiRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const activitySchema = z.object({
  name: z.string().min(1),
  equipment_recommendations: z.record(z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const activities = await prisma.activity.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('[admin activities GET]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await apiRequireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { equipment_recommendations, ...rest } = parsed.data;

  try {
    const activity = await prisma.activity.create({
      data: {
        ...rest,
        ...(equipment_recommendations !== undefined
          ? { equipment_recommendations: equipment_recommendations as Prisma.InputJsonValue }
          : {}),
      },
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('[admin activities POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

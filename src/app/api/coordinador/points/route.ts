import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPointsSchema = z.object({
  user_id: z.string().min(1),
  edicion_id: z.number().int().positive().nullable().optional(),
  points: z.number().int().min(1),
  description: z.string().nullable().optional(),
});

// POST /api/coordinador/points — award points to a member
export async function POST(request: NextRequest) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const parsed = createPointsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { user_id, edicion_id, points, description } = parsed.data;

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  try {
    const entry = await prisma.coursePoints.create({
      data: {
        user_id,
        edicion_id: edicion_id ?? null,
        points,
        awarded_by: auth.user.id,
        description: description ?? null,
        expires_at: expiresAt,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[coordinador points POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

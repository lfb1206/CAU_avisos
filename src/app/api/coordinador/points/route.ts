import { NextRequest, NextResponse } from 'next/server';
import { apiRequireCoordinador } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/coordinador/points — award points to a member
export async function POST(request: NextRequest) {
  const auth = await apiRequireCoordinador(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json()) as {
    user_id: string;
    edicion_id?: number | null;
    points: number;
    description?: string | null;
  };

  if (!body.user_id || !body.points || body.points < 1) {
    return NextResponse.json({ error: 'user_id y points son requeridos' }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  try {
    const entry = await prisma.coursePoints.create({
      data: {
        user_id: body.user_id,
        edicion_id: body.edicion_id ?? null,
        points: body.points,
        awarded_by: auth.user.id,
        description: body.description ?? null,
        expires_at: expiresAt,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('[coordinador points POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

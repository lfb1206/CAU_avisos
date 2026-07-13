import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

async function guardCoordinador() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) return null;
  return user;
}

// POST /api/coordinador/points — award points to a member
export async function POST(request: NextRequest) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await request.json() as {
    user_id: string;
    course_id?: number | null;
    points: number;
    description?: string | null;
    awarded_by: string;
  };

  if (!body.user_id || !body.points || body.points < 1) {
    return NextResponse.json({ error: 'user_id y points son requeridos' }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const entry = await prisma.coursePoints.create({
    data: {
      user_id:     body.user_id,
      course_id:   body.course_id ?? null,
      points:      body.points,
      awarded_by:  user.id,
      description: body.description ?? null,
      expires_at:  expiresAt,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

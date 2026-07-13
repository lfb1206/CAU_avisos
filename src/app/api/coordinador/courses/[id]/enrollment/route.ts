import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

async function guardCoordinador() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  if (!profile || (profile.role !== 'coordinador' && profile.role !== 'admin')) return null;
  return user;
}

// PATCH /api/coordinador/courses/[id]/enrollment — open or close enrollment
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await guardCoordinador();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const body = await request.json() as { enrollment_open: boolean };

  const course = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      enrollment_open: body.enrollment_open,
      enrollment_opens_at: body.enrollment_open ? new Date() : null,
    },
    select: { id: true, name: true, enrollment_open: true, enrollment_opens_at: true },
  });

  return NextResponse.json(course);
}

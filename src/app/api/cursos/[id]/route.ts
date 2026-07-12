import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const updateCourseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['upcoming', 'active', 'completed', 'cancelled']).optional(),
  capacity: z.number().int().optional(),
  location: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  price: z.number().optional(),
});

// GET /api/cursos/[id]
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
    include: {
      enrollments: user
        ? { where: { user_id: user.id }, select: { status: true } }
        : { where: { id: -1 }, select: { status: true } },
      _count: { select: { enrollments: { where: { status: { in: ['enrolled', 'waitlisted'] } } } } },
    },
  });

  if (!course) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });

  // Resolve prerequisite names
  const prereqCourses = course.prerequisite_course_ids.length > 0
    ? await prisma.course.findMany({
        where: { id: { in: course.prerequisite_course_ids } },
        select: { id: true, name: true },
      })
    : [];

  return NextResponse.json({ ...course, prerequisiteCourses: prereqCourses });
}

// PATCH /api/cursos/[id] — admin only
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = updateCourseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const course = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      ...parsed.data,
      start_date: parsed.data.start_date ? new Date(parsed.data.start_date) : undefined,
      end_date: parsed.data.end_date ? new Date(parsed.data.end_date) : undefined,
    },
  });

  return NextResponse.json(course);
}

// DELETE /api/cursos/[id] — admin only
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  await prisma.course.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}

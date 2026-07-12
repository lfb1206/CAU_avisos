import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createCourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  branch: z.enum(['base', 'nieve_hielo', 'roca']),
  level: z.enum(['introductorio', 'intermedio', 'intermedio_avanzado', 'avanzado']),
  order_index: z.number().int(),
  prerequisite_course_ids: z.array(z.number().int()).default([]),
  capacity: z.number().int().default(20),
  location: z.string().optional(),
  price: z.number().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

// GET /api/cursos — list all courses with optional user enrollment status
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const courses = await prisma.course.findMany({
    orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
    include: {
      enrollments: user
        ? { where: { user_id: user.id }, select: { status: true } }
        : false,
      _count: { select: { enrollments: { where: { status: { in: ['enrolled', 'waitlisted'] } } } } },
    },
  });

  return NextResponse.json(courses);
}

// POST /api/cursos — admin: create course
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const parsed = createCourseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const course = await prisma.course.create({
    data: {
      ...parsed.data,
      start_date: parsed.data.start_date ? new Date(parsed.data.start_date) : null,
      end_date: parsed.data.end_date ? new Date(parsed.data.end_date) : null,
    },
  });

  return NextResponse.json(course, { status: 201 });
}

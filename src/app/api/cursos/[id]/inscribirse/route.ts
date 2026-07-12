import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/cursos/[id]/inscribirse — member enrolls in a course
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const courseId = Number(id);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
  if (course.status === 'cancelled') return NextResponse.json({ error: 'El curso está cancelado' }, { status: 409 });

  // Verify prerequisites
  if (course.prerequisite_course_ids.length > 0) {
    const completed = await prisma.courseEnrollment.findMany({
      where: {
        user_id: user.id,
        course_id: { in: course.prerequisite_course_ids },
        status: 'completed',
      },
      select: { course_id: true },
    });
    const completedIds = new Set(completed.map((e) => e.course_id));
    const missing = course.prerequisite_course_ids.filter((pid) => !completedIds.has(pid));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: 'No cumples los prerequisitos para inscribirte en este curso', missing_prerequisites: missing },
        { status: 422 }
      );
    }
  }

  // Check existing enrollment
  const existing = await prisma.courseEnrollment.findUnique({
    where: { course_id_user_id: { course_id: courseId, user_id: user.id } },
  });
  if (existing && existing.status !== 'cancelled') {
    return NextResponse.json({ error: 'Ya estás inscrito en este curso' }, { status: 409 });
  }

  // Determine status: enrolled if capacity available, waitlisted otherwise
  const enrolledCount = await prisma.courseEnrollment.count({
    where: { course_id: courseId, status: { in: ['enrolled', 'waitlisted'] } },
  });
  const enrollmentStatus = enrolledCount < course.capacity ? 'enrolled' : 'waitlisted';

  const enrollment = await prisma.courseEnrollment.upsert({
    where: { course_id_user_id: { course_id: courseId, user_id: user.id } },
    update: { status: enrollmentStatus, enrolled_at: new Date() },
    create: { course_id: courseId, user_id: user.id, status: enrollmentStatus },
  });

  return NextResponse.json({ enrollment, course_name: course.name }, { status: 201 });
}

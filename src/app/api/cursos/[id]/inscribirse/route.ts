import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const courseId = Number(id);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { tipo?: string };
  const isAyudante = body.tipo === 'ayudante';

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
  if (course.status === 'cancelled') return NextResponse.json({ error: 'El curso está cancelado' }, { status: 409 });
  if (!course.enrollment_open) return NextResponse.json({ error: 'Las inscripciones no están abiertas' }, { status: 409 });

  const existing = await prisma.courseEnrollment.findUnique({
    where: { course_id_user_id: { course_id: courseId, user_id: user.id } },
  });

  if (isAyudante) {
    // Must have completed the course to be an ayudante
    const hasCompleted = existing?.status === 'completed' ||
      course.branch === 'base'; // base courses auto-completed for all members
    if (!hasCompleted) {
      return NextResponse.json({ error: 'Debes haber completado el curso para ser ayudante' }, { status: 422 });
    }
    if (existing?.status === 'ayudante') {
      return NextResponse.json({ error: 'Ya estás registrado como ayudante' }, { status: 409 });
    }

    const enrollment = await prisma.courseEnrollment.upsert({
      where: { course_id_user_id: { course_id: courseId, user_id: user.id } },
      update: { status: 'ayudante', enrolled_at: new Date() },
      create: { course_id: courseId, user_id: user.id, status: 'ayudante' },
    });
    return NextResponse.json({ enrollment, course_name: course.name }, { status: 201 });
  }

  // Regular enrollment — verify prerequisites
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
    // base courses are always completed for members
    const baseIds = await prisma.course.findMany({ where: { branch: 'base' }, select: { id: true } });
    baseIds.forEach((c) => completedIds.add(c.id));

    const missing = course.prerequisite_course_ids.filter((pid) => !completedIds.has(pid));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: 'No cumples los prerequisitos para inscribirte en este curso', missing_prerequisites: missing },
        { status: 422 }
      );
    }
  }

  // Verify points requirement
  if (course.required_points > 0) {
    const now = new Date();
    const pointsResult = await prisma.coursePoints.aggregate({
      where: { user_id: user.id, expires_at: { gt: now } },
      _sum: { points: true },
    });
    const activePoints = pointsResult._sum.points ?? 0;
    if (activePoints < course.required_points) {
      return NextResponse.json(
        { error: `Necesitas ${course.required_points} puntos activos (tienes ${activePoints})` },
        { status: 422 }
      );
    }
  }

  if (existing && existing.status !== 'cancelled') {
    return NextResponse.json({ error: 'Ya estás inscrito en este curso' }, { status: 409 });
  }

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

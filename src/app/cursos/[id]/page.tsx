import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { MemberCourseStatus } from '@/types';

type PageProps = { params: Promise<{ id: string }> };

const branchLabels: Record<string, string> = {
  base:       'Base',
  nieve_hielo:'Nieve / Hielo',
  roca:       'Roca',
};

const levelLabels: Record<string, string> = {
  introductorio:       'Introductorio',
  intermedio:          'Intermedio',
  intermedio_avanzado: 'Intermedio-Avanzado',
  avanzado:            'Avanzado',
};

function StatusChip({ status }: { status: MemberCourseStatus }) {
  if (status === 'completado') return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Completado
    </span>
  );
  if (status === 'bloqueado') return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      Bloqueado
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
      Disponible
    </span>
  );
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
    include: {
      enrollments: user
        ? { where: { user_id: user.id } }
        : { where: { id: -1 } },
      _count: { select: { enrollments: { where: { status: { in: ['enrolled', 'waitlisted'] } } } } },
    },
  });

  if (!course) notFound();

  const prereqCourses = course.prerequisite_course_ids.length > 0
    ? await prisma.course.findMany({
        where: { id: { in: course.prerequisite_course_ids } },
        select: { id: true, name: true },
      })
    : [];

  // Resolve member status
  let memberStatus: MemberCourseStatus = 'disponible';
  if (!user) {
    memberStatus = 'bloqueado';
  } else {
    const userEnrollment = course.enrollments[0];
    if (userEnrollment?.status === 'completed') {
      memberStatus = 'completado';
    } else if (course.prerequisite_course_ids.length > 0) {
      const completedPrereqs = await prisma.courseEnrollment.findMany({
        where: { user_id: user.id, course_id: { in: course.prerequisite_course_ids }, status: 'completed' },
        select: { course_id: true },
      });
      const completedIds = new Set(completedPrereqs.map((e) => e.course_id));
      const prereqsMet = course.prerequisite_course_ids.every((pid) => completedIds.has(pid));
      if (!prereqsMet) memberStatus = 'bloqueado';
    }
  }

  const userEnrollment = user ? course.enrollments[0] : null;
  const isEnrolled = userEnrollment && userEnrollment.status !== 'cancelled';
  const spotsLeft = course.capacity - course._count.enrollments;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/cursos" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Todos los cursos
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{branchLabels[course.branch] ?? course.branch}</span>
            <span>·</span>
            <span>{levelLabels[course.level] ?? course.level}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
            <StatusChip status={memberStatus} />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{course.description}</p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Cupos</p>
            <p className="font-semibold">{spotsLeft > 0 ? `${spotsLeft} disponibles` : 'Lista de espera'} / {course.capacity}</p>
          </div>
          {course.location && (
            <div>
              <p className="text-gray-500 font-medium mb-1">Lugar</p>
              <p className="font-semibold">{course.location}</p>
            </div>
          )}
          {course.start_date && (
            <div>
              <p className="text-gray-500 font-medium mb-1">Fecha inicio</p>
              <p className="font-semibold">{new Date(course.start_date).toLocaleDateString('es-CL')}</p>
            </div>
          )}
          {course.price !== null && course.price !== undefined && (
            <div>
              <p className="text-gray-500 font-medium mb-1">Arancel</p>
              <p className="font-semibold">${Number(course.price).toLocaleString('es-CL')} CLP</p>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {prereqCourses.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Prerequisitos</h2>
            <ul className="space-y-1">
              {prereqCourses.map((p) => (
                <li key={p.id}>
                  <Link href={`/cursos/${p.id}`} className="text-sm text-blue-600 hover:underline">
                    → {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="pt-4">
          {!user && (
            <Link
              href={`/auth/login?redirectTo=/cursos/${course.id}`}
              className="block w-full text-center py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Inicia sesión para inscribirte
            </Link>
          )}

          {user && memberStatus === 'bloqueado' && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
              Completa los prerequisitos para poder inscribirte en este curso.
            </div>
          )}

          {user && memberStatus === 'completado' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium">
              Ya completaste este curso. ¡Bien hecho!
            </div>
          )}

          {user && memberStatus === 'disponible' && !isEnrolled && (
            <Link
              href={`/cursos/${course.id}/inscribirse`}
              className="block w-full text-center py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              {spotsLeft > 0 ? 'Inscribirse' : 'Unirse a la lista de espera'}
            </Link>
          )}

          {user && isEnrolled && memberStatus !== 'completado' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 font-medium">
              {userEnrollment?.status === 'waitlisted'
                ? 'Estás en la lista de espera para este curso.'
                : 'Ya estás inscrito en este curso.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

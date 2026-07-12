import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/resources/courses/CourseCard';
import type { MemberCourseStatus } from '@/types';

type CourseRow = {
  id: number;
  name: string;
  description: string;
  branch: string;
  level: string;
  order_index: number;
  capacity: number;
  prerequisite_course_ids: number[];
  enrollments: { status: string }[];
  _count: { enrollments: number };
};

function resolveMemberStatus(
  course: CourseRow,
  completedIds: Set<number>,
  enrolledIds: Set<number>,
  isLoggedIn: boolean
): MemberCourseStatus {
  if (!isLoggedIn) return 'bloqueado';
  if (completedIds.has(course.id)) return 'completado';
  const prereqsMet = course.prerequisite_course_ids.every((pid) => completedIds.has(pid));
  if (!prereqsMet) return 'bloqueado';
  return 'disponible';
}

function BranchColumn({
  title,
  courses,
  completedIds,
  enrolledIds,
  allCourses,
  isLoggedIn,
}: {
  title: string;
  courses: CourseRow[];
  completedIds: Set<number>;
  enrolledIds: Set<number>;
  allCourses: CourseRow[];
  isLoggedIn: boolean;
}) {
  const courseMap = new Map(allCourses.map((c) => [c.id, c.name]));

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-center font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
        {title}
      </h2>
      <div className="space-y-3">
        {courses.map((course, idx) => {
          const status = resolveMemberStatus(course, completedIds, enrolledIds, isLoggedIn);
          const missingPrerequisiteNames = status === 'bloqueado'
            ? course.prerequisite_course_ids
                .filter((pid) => !completedIds.has(pid))
                .map((pid) => courseMap.get(pid) ?? `Curso #${pid}`)
            : [];

          return (
            <div key={course.id} className="relative">
              <CourseCard
                id={course.id}
                name={course.name}
                description={course.description}
                level={course.level}
                status={status}
                enrolledCount={course._count.enrollments}
                capacity={course.capacity}
                missingPrerequisiteNames={missingPrerequisiteNames}
              />
              {/* Connector arrow between cards */}
              {idx < courses.length - 1 && (
                <div className="flex justify-center my-1">
                  <svg className="w-4 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function CursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const courses = await prisma.course.findMany({
    orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
    include: {
      enrollments: user
        ? { where: { user_id: user.id }, select: { status: true } }
        : { where: { id: -1 }, select: { status: true } }, // empty result
      _count: { select: { enrollments: { where: { status: { in: ['enrolled', 'waitlisted'] } } } } },
    },
  }) as CourseRow[];

  const completedIds = new Set<number>(
    courses
      .filter((c) => c.enrollments.some((e) => e.status === 'completed'))
      .map((c) => c.id)
  );
  const enrolledIds = new Set<number>(
    courses
      .filter((c) => c.enrollments.some((e) => e.status === 'enrolled' || e.status === 'waitlisted'))
      .map((c) => c.id)
  );

  const baseCourses    = courses.filter((c) => c.branch === 'base');
  const nieveCourses   = courses.filter((c) => c.branch === 'nieve_hielo');
  const rocaCourses    = courses.filter((c) => c.branch === 'roca');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cursos del Club</h1>
        <p className="mt-2 text-gray-600">
          Ruta de formación CAU — completa los cursos en orden para avanzar en tu camino alpinista.
        </p>
        {!user && (
          <p className="mt-3 text-sm text-blue-700 bg-blue-50 inline-block px-4 py-2 rounded-full">
            <a href="/auth/login" className="font-medium hover:underline">Inicia sesión</a>{' '}
            para ver tu progreso personal.
          </p>
        )}
      </div>

      {/* Foundation course — spans both columns */}
      {baseCourses.map((course) => {
        const status = resolveMemberStatus(course, completedIds, enrolledIds, Boolean(user));
        return (
          <div key={course.id} className="mb-6">
            <div className="max-w-sm mx-auto">
              <CourseCard
                id={course.id}
                name={course.name}
                description={course.description}
                level={course.level}
                status={status}
                enrolledCount={course._count.enrollments}
                capacity={course.capacity}
              />
            </div>
            <div className="flex justify-center mt-2 mb-4">
              <div className="flex gap-12">
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="w-24 h-px bg-gray-300" />
                  <div className="w-px h-4 bg-gray-300" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="w-24 h-px bg-gray-300" />
                  <div className="w-px h-4 bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Two-column branch view */}
      <div className="flex gap-6 items-start">
        <BranchColumn
          title="Nieve / Hielo"
          courses={nieveCourses}
          completedIds={completedIds}
          enrolledIds={enrolledIds}
          allCourses={courses}
          isLoggedIn={Boolean(user)}
        />
        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />
        <BranchColumn
          title="Roca"
          courses={rocaCourses}
          completedIds={completedIds}
          enrolledIds={enrolledIds}
          allCourses={courses}
          isLoggedIn={Boolean(user)}
        />
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center text-xs text-gray-600">
        {[
          { color: 'bg-green-400', label: 'Completado' },
          { color: 'bg-blue-400',  label: 'Disponible para inscripción' },
          { color: 'bg-gray-300',  label: 'Bloqueado (prerequisitos pendientes)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

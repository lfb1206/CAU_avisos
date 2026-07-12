import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

const branchLabels: Record<string, string> = {
  base:        'Base',
  nieve_hielo: 'Nieve / Hielo',
  roca:        'Roca',
};

const statusColors: Record<string, string> = {
  upcoming:  'bg-blue-100 text-blue-800',
  active:    'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  upcoming:  'Próximamente',
  active:    'Activo',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};

export default async function AdminCursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const courses = await prisma.course.findMany({
    orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-500 mt-1">{courses.length} cursos en total</p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Panel Admin
        </Link>
      </div>

      {/* Group by branch */}
      {(['base', 'nieve_hielo', 'roca'] as const).map((branch) => {
        const branchCourses = courses.filter((c) => c.branch === branch);
        if (branchCourses.length === 0) return null;
        return (
          <section key={branch} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              {branchLabels[branch]}
            </h2>
            <div className="space-y-2">
              {branchCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs text-gray-400 w-5 text-right">{course.order_index}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{course.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {course._count.enrollments} inscripciones · Cupo {course.capacity}
                        {course.prerequisite_course_ids.length > 0
                          ? ` · ${course.prerequisite_course_ids.length} prerequisito${course.prerequisite_course_ids.length > 1 ? 's' : ''}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[course.status]}`}>
                      {statusLabels[course.status]}
                    </span>
                    <Link
                      href={`/cursos/${course.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        Para editar los detalles de un curso (fechas, cupos, estado), usa la API PATCH{' '}
        <code className="font-mono text-xs bg-amber-100 px-1 rounded">/api/cursos/[id]</code>.
        La edición inline estará disponible en la próxima versión.
      </div>
    </div>
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

const branchLabels: Record<string, string> = {
  base: 'Base',
  nieve_hielo: 'Nieve / Hielo',
  roca: 'Roca',
};

const levelLabels: Record<string, string> = {
  introductorio: 'Introductorio',
  intermedio: 'Intermedio',
  intermedio_avanzado: 'Intermedio-Avanzado',
  avanzado: 'Avanzado',
};

const edicionStatusColors: Record<string, string> = {
  planificada: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  en_curso: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  finalizada: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  cancelada: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const edicionStatusLabels: Record<string, string> = {
  planificada: 'Planificada',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

export default async function AdminCursosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/');

  const talleres = await prisma.taller.findMany({
    orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
    include: {
      _count: { select: { ediciones: true } },
      ediciones: {
        orderBy: { start_date: 'desc' },
        take: 3,
        select: {
          id: true,
          name: true,
          status: true,
          enrollment_open: true,
          capacity: true,
          _count: {
            select: { inscripciones: { where: { status: { in: ['aceptado', 'completado'] } } } },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Talleres</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{talleres.length} talleres en el catálogo</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          ← Panel Admin
        </Link>
      </div>

      {(['base', 'nieve_hielo', 'roca'] as const).map((branch) => {
        const branchTalleres = talleres.filter((t) => t.branch === branch);
        if (branchTalleres.length === 0) return null;
        return (
          <section key={branch} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b dark:border-gray-700 pb-2">
              {branchLabels[branch]}
            </h2>
            <div className="space-y-3">
              {branchTalleres.map((taller) => (
                <div
                  key={taller.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden"
                >
                  {/* Taller header */}
                  <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-5 text-right shrink-0">
                        {taller.order_index}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{taller.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {levelLabels[taller.level]} · {taller._count.ediciones} edición
                          {taller._count.ediciones !== 1 ? 'es' : ''}
                          {taller.prerequisite_taller_ids.length > 0
                            ? ` · ${taller.prerequisite_taller_ids.length} prerequisito${taller.prerequisite_taller_ids.length > 1 ? 's' : ''}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        href={`/cursos/${taller.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Ver
                      </Link>
                      <Link
                        href="/coordinador"
                        className="text-xs text-green-600 hover:underline"
                      >
                        Ediciones
                      </Link>
                    </div>
                  </div>

                  {/* Recent ediciones */}
                  {taller.ediciones.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-2 space-y-1.5">
                      {taller.ediciones.map((edicion) => (
                        <div key={edicion.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{edicion.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 dark:text-gray-400">
                              {edicion._count.inscripciones}/{edicion.capacity} inscritos
                            </span>
                            {edicion.enrollment_open && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium">
                                Inscripciones abiertas
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded-full font-medium ${edicionStatusColors[edicion.status]}`}
                            >
                              {edicionStatusLabels[edicion.status]}
                            </span>
                          </div>
                        </div>
                      ))}
                      {taller._count.ediciones > 3 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 pt-0.5">
                          + {taller._count.ediciones - 3} edición{taller._count.ediciones - 3 !== 1 ? 'es' : ''} más
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
        Para gestionar ediciones (fechas, cupos, inscripciones), usa el{' '}
        <Link href="/coordinador" className="font-medium underline">
          Panel del Coordinador
        </Link>
        . Para editar el catálogo de talleres usa la API PATCH{' '}
        <code className="font-mono text-xs bg-amber-100 px-1 rounded">/api/cursos/[id]</code>.
      </div>
    </div>
  );
}

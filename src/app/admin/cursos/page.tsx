import React from 'react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
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
  planificada: 'bg-blue-100 text-blue-800',
  en_curso: 'bg-green-100 text-green-800',
  finalizada: 'bg-gray-100 text-gray-700',
  cancelada: 'bg-red-100 text-red-700',
};

const edicionStatusLabels: Record<string, string> = {
  planificada: 'Planificada',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

export default async function AdminCursosPage() {
  await requireAdmin();

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Talleres</h1>
          <p className="text-gray-500 mt-1">{talleres.length} talleres en el catálogo</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-800">
          ← Panel Admin
        </Link>
      </div>

      {(['base', 'nieve_hielo', 'roca'] as const).map((branch) => {
        const branchTalleres = talleres.filter((t) => t.branch === branch);
        if (branchTalleres.length === 0) return null;
        return (
          <section key={branch} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              {branchLabels[branch]}
            </h2>
            <div className="space-y-3">
              {branchTalleres.map((taller) => (
                <div
                  key={taller.id}
                  className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                >
                  {/* Taller header */}
                  <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs text-gray-400 w-5 text-right shrink-0">
                        {taller.order_index}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{taller.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
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
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 space-y-1.5">
                      {taller.ediciones.map((edicion) => (
                        <div key={edicion.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 font-medium">{edicion.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              {edicion._count.inscripciones}/{edicion.capacity} inscritos
                            </span>
                            {edicion.enrollment_open && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
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
                        <p className="text-xs text-gray-400 pt-0.5">
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

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
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

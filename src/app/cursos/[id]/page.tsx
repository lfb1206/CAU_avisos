import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

type PageProps = { params: Promise<{ id: string }> };

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

const edicionStatusLabels: Record<string, string> = {
  planificada: 'Planificada',
  inscripciones_abiertas: 'Inscripciones abiertas',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

const edicionStatusColors: Record<string, string> = {
  planificada: 'bg-gray-100 text-gray-700',
  inscripciones_abiertas: 'bg-green-100 text-green-800',
  en_curso: 'bg-blue-100 text-blue-800',
  finalizada: 'bg-gray-100 text-gray-500',
  cancelada: 'bg-red-100 text-red-700',
};

export default async function TallerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const taller = await prisma.taller.findUnique({
    where: { id: Number(id) },
    include: {
      ediciones: {
        where: { status: { not: 'cancelada' } },
        orderBy: { start_date: 'asc' },
        include: user
          ? {
              inscripciones: {
                where: { user_id: user.id },
                select: { status: true },
              },
              _count: {
                select: {
                  inscripciones: {
                    where: { status: { in: ['aceptado', 'completado'] } },
                  },
                },
              },
            }
          : {
              inscripciones: { where: { id: -1 }, select: { status: true } },
              _count: {
                select: {
                  inscripciones: {
                    where: { status: { in: ['aceptado', 'completado'] } },
                  },
                },
              },
            },
      },
    },
  });

  if (!taller) notFound();

  const prereqTalleres =
    taller.prerequisite_taller_ids.length > 0
      ? await prisma.taller.findMany({
          where: { id: { in: taller.prerequisite_taller_ids } },
          select: { id: true, name: true },
        })
      : [];

  // Determine member status for this taller
  let memberStatus: 'completado' | 'disponible' | 'bloqueado' = 'bloqueado';
  if (user) {
    const hasCompleted = taller.ediciones.some((e) =>
      e.inscripciones.some((i) => i.status === 'completado')
    );
    if (hasCompleted || taller.branch === 'base') {
      memberStatus = 'completado';
    } else {
      // Check prereqs
      const completedInscripciones = await prisma.inscripcion.findMany({
        where: {
          user_id: user.id,
          status: 'completado',
          edicion: { taller_id: { in: taller.prerequisite_taller_ids } },
        },
        select: { edicion: { select: { taller_id: true } } },
      });
      const completedTallerIds = new Set(
        completedInscripciones.map((i) => i.edicion.taller_id)
      );
      // base talleres count as completed
      const baseTallers = await prisma.taller.findMany({
        where: { branch: 'base' },
        select: { id: true },
      });
      baseTallers.forEach((t) => completedTallerIds.add(t.id));

      const prereqsMet = taller.prerequisite_taller_ids.every((pid) =>
        completedTallerIds.has(pid)
      );
      memberStatus = prereqsMet ? 'disponible' : 'bloqueado';
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/cursos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Todos los talleres
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{branchLabels[taller.branch] ?? taller.branch}</span>
            <span>·</span>
            <span>{levelLabels[taller.level] ?? taller.level}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{taller.name}</h1>
            {memberStatus === 'completado' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Completado
              </span>
            )}
            {memberStatus === 'bloqueado' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                Bloqueado
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{taller.description}</p>

        {/* Prerequisites */}
        {prereqTalleres.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Prerequisitos</h2>
            <ul className="space-y-1">
              {prereqTalleres.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/cursos/${p.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    → {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blocked message */}
        {user && memberStatus === 'bloqueado' && prereqTalleres.length > 0 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
            Completa los prerequisitos para poder postular a ediciones de este taller.
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <Link href={`/auth/login?redirectTo=/cursos/${taller.id}`} className="font-medium hover:underline">
              Inicia sesión
            </Link>{' '}
            para ver tu progreso y postular a ediciones.
          </div>
        )}

        {/* Ediciones */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Ediciones disponibles</h2>
          {taller.ediciones.length === 0 ? (
            <p className="text-sm text-gray-500">No hay ediciones programadas actualmente.</p>
          ) : (
            <div className="space-y-3">
              {taller.ediciones.map((edicion) => {
                const userStatus = edicion.inscripciones[0]?.status ?? null;
                const spotsLeft = edicion.capacity - edicion._count.inscripciones;
                const canPostular =
                  user &&
                  memberStatus !== 'bloqueado' &&
                  edicion.enrollment_open &&
                  edicion.status !== 'finalizada' &&
                  !userStatus;

                return (
                  <div
                    key={edicion.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm">{edicion.name}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${edicionStatusColors[edicion.status] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {edicionStatusLabels[edicion.status] ?? edicion.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {edicion.start_date &&
                          new Date(edicion.start_date).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        {edicion.start_date && ' · '}
                        {spotsLeft > 0
                          ? `${spotsLeft} cupos disponibles`
                          : 'Sin cupos'}
                        {(edicion as { price?: unknown }).price !== null &&
                          (edicion as { price?: unknown }).price !== undefined &&
                          ` · $${Number((edicion as { price?: unknown }).price).toLocaleString('es-CL')} CLP`}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {userStatus === 'postulando' && (
                        <span className="text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
                          Postulación enviada
                        </span>
                      )}
                      {userStatus === 'aceptado' && (
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                          Aceptado ✓
                        </span>
                      )}
                      {userStatus === 'completado' && (
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                          Completado ✓
                        </span>
                      )}
                      {canPostular && (
                        <Link
                          href={`/cursos/edicion/${edicion.id}/postular`}
                          className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Postular
                        </Link>
                      )}
                      {!userStatus &&
                        edicion.enrollment_open &&
                        memberStatus === 'bloqueado' && (
                          <span className="text-xs text-gray-400">Prerequisitos pendientes</span>
                        )}
                      {!userStatus && !edicion.enrollment_open && edicion.status === 'planificada' && (
                        <span className="text-xs text-gray-400 italic">Próximamente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

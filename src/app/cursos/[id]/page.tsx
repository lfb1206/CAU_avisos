import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import AyudanteButton from './AyudanteButton';

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

function CurriculumSection({ taller }: { taller: { objetivo?: string | null; contenidos?: string | null; habilidades?: string | null; lugar_tipico?: string | null; requisitos_personales?: string | null; equipo_personal?: string | null; equipo_recomendado?: string | null } }) {
  const hasContent = !!(taller.objetivo || taller.contenidos || taller.habilidades || taller.lugar_tipico || taller.requisitos_personales || taller.equipo_personal || taller.equipo_recomendado);
  if (!hasContent) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Contenido del taller</h2>
      <dl className="space-y-4">
        {taller.objetivo && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Objetivo</dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{taller.objetivo}</dd>
          </div>
        )}
        {taller.contenidos && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Contenidos</dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{taller.contenidos}</dd>
          </div>
        )}
        {taller.habilidades && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Habilidades a desarrollar</dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{taller.habilidades}</dd>
          </div>
        )}
        {taller.lugar_tipico && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Lugar típico</dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300">{taller.lugar_tipico}</dd>
          </div>
        )}
        {taller.requisitos_personales && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Requisitos personales</dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{taller.requisitos_personales}</dd>
          </div>
        )}
        {(taller.equipo_personal || taller.equipo_recomendado) && (
          <div>
            <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Equipamiento</dt>
            {taller.equipo_personal && (
              <dd className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line mb-1">
                <span className="font-medium">Obligatorio: </span>{taller.equipo_personal}
              </dd>
            )}
            {taller.equipo_recomendado && (
              <dd className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                <span className="font-medium">Recomendado: </span>{taller.equipo_recomendado}
              </dd>
            )}
          </div>
        )}
      </dl>
    </div>
  );
}

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
              ayudantias: {
                where: { user_id: user.id },
                select: { id: true },
              },
              _count: {
                select: {
                  inscripciones: {
                    where: { status: { in: ['aceptado', 'completado'] } },
                  },
                  ayudantias: true,
                },
              },
            }
          : {
              inscripciones: { where: { id: -1 }, select: { status: true } },
              ayudantias: { where: { id: -1 }, select: { id: true } },
              _count: {
                select: {
                  inscripciones: {
                    where: { status: { in: ['aceptado', 'completado'] } },
                  },
                  ayudantias: true,
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

  // Determine member status
  let memberStatus: 'completado' | 'disponible' | 'bloqueado' = 'bloqueado';
  if (user) {
    const hasCompleted = taller.ediciones.some((e) =>
      e.inscripciones.some((i) => i.status === 'completado')
    );
    if (hasCompleted || taller.branch === 'base') {
      memberStatus = 'completado';
    } else {
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
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Todos los talleres
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{branchLabels[taller.branch] ?? taller.branch}</span>
            <span>·</span>
            <span>{levelLabels[taller.level] ?? taller.level}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{taller.name}</h1>
            {memberStatus === 'completado' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{taller.description}</p>

        {/* Prerequisites */}
        {prereqTalleres.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Prerequisitos</h2>
            <ul className="space-y-1">
              {prereqTalleres.map((p) => (
                <li key={p.id}>
                  <Link href={`/cursos/${p.id}`} className="text-sm text-blue-600 hover:underline">
                    → {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blocked message */}
        {user && memberStatus === 'bloqueado' && prereqTalleres.length > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl text-sm text-orange-800 dark:text-orange-300">
            Completa los prerequisitos para poder postular a ediciones de este taller.
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-blue-800 dark:text-blue-300">
            <Link href={`/auth/login?redirectTo=/cursos/${taller.id}`} className="font-medium hover:underline">
              Inicia sesión
            </Link>{' '}
            para ver tu progreso y postular a ediciones.
          </div>
        )}

        {/* Curriculum content (from Excel ficha) */}
        <CurriculumSection taller={taller} />

        {/* Ediciones */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Ediciones disponibles</h2>
          {taller.ediciones.length === 0 ? (
            <p className="text-sm text-gray-500">No hay ediciones programadas actualmente.</p>
          ) : (
            <div className="space-y-3">
              {taller.ediciones.map((edicion) => {
                const userStatus = edicion.inscripciones[0]?.status ?? null;
                const isUserAyudante = edicion.ayudantias.length > 0;
                const spotsLeft = edicion.capacity - edicion._count.inscripciones;
                const ayudanteSpotsLeft = edicion.max_ayudantes - edicion._count.ayudantias;
                const canPostular =
                  user &&
                  memberStatus !== 'bloqueado' &&
                  edicion.enrollment_open &&
                  edicion.status !== 'finalizada' &&
                  !userStatus;
                const canBeAyudante =
                  user &&
                  memberStatus === 'completado' &&
                  edicion.enrollment_open &&
                  edicion.max_ayudantes > 0 &&
                  ayudanteSpotsLeft > 0 &&
                  !isUserAyudante &&
                  !userStatus;

                return (
                  <div
                    key={edicion.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{edicion.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${edicionStatusColors[edicion.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {edicionStatusLabels[edicion.status] ?? edicion.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {edicion.start_date &&
                            new Date(edicion.start_date).toLocaleDateString('es-CL', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          {edicion.start_date && ' · '}
                          {spotsLeft > 0 ? `${spotsLeft} cupos` : 'Sin cupos'}
                          {(edicion as { price?: unknown }).price != null &&
                            ` · $${Number((edicion as { price?: unknown }).price).toLocaleString('es-CL')} CLP`}
                        </p>
                      </div>

                      {/* Primary enrollment action */}
                      <div className="flex-shrink-0">
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
                        {isUserAyudante && !userStatus && (
                          <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-full">
                            Ayudante ✓
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
                        {!userStatus && !isUserAyudante && edicion.enrollment_open && memberStatus === 'bloqueado' && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">Prerequisitos pendientes</span>
                        )}
                        {!userStatus && !isUserAyudante && !edicion.enrollment_open && edicion.status === 'planificada' && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">Próximamente</span>
                        )}
                      </div>
                    </div>

                    {/* Secondary actions row: ayudante + ficha */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        {canBeAyudante && <AyudanteButton edicionId={edicion.id} />}
                      </div>
                      <Link
                        href={`/cursos/edicion/${edicion.id}/ficha`}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:underline font-medium"
                      >
                        Ver ficha →
                      </Link>
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

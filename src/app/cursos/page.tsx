'use client';
import React from 'react';
import useSWR from 'swr';
import CourseCard from '@/resources/courses/CourseCard';
import type { MemberCourseStatus } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type EdicionRow = {
  id: number;
  name: string;
  status: string;
  enrollment_open: boolean;
  capacity: number;
  required_points: number;
  start_date: string | null;
  inscripciones: { status: string }[];
  ayudantias: { asistio: boolean | null }[];
  _count: { inscripciones: number };
};

type TallerRow = {
  id: number;
  name: string;
  description: string;
  branch: string;
  level: string;
  order_index: number;
  prerequisite_taller_ids: number[];
  ediciones: EdicionRow[];
};

function resolveMemberStatus(
  taller: TallerRow,
  completedIds: Set<number>,
  isLoggedIn: boolean
): MemberCourseStatus {
  if (!isLoggedIn) return 'bloqueado';
  if (taller.branch === 'base') return 'completado';
  if (completedIds.has(taller.id)) return 'completado';
  const prereqsMet = taller.prerequisite_taller_ids.every((pid) => completedIds.has(pid));
  return prereqsMet ? 'disponible' : 'bloqueado';
}

function getOpenEdicion(taller: TallerRow) {
  return taller.ediciones.find(
    (e) => e.enrollment_open && e.status !== 'cancelada' && e.status !== 'finalizada'
  ) ?? null;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

function BranchColumn({
  title,
  talleres,
  completedIds,
  allTalleres,
  isLoggedIn,
  userActivePoints,
}: {
  title: string;
  talleres: TallerRow[];
  completedIds: Set<number>;
  allTalleres: TallerRow[];
  isLoggedIn: boolean;
  userActivePoints: number;
}) {
  const tallerMap = new Map(allTalleres.map((t) => [t.id, t.name]));

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-center font-bold text-lg text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
        {title}
      </h2>
      <div className="space-y-3">
        {talleres.map((taller, idx) => {
          const status = resolveMemberStatus(taller, completedIds, isLoggedIn);
          const openEdicion = getOpenEdicion(taller);
          const userInscripcionStatus = openEdicion
            ? (taller.ediciones.find((e) => e.id === openEdicion.id)?.inscripciones[0]?.status ?? null)
            : null;
          const isAyudante = openEdicion
            ? taller.ediciones.some((e) => e.id === openEdicion.id && e.ayudantias.length > 0)
            : false;
          const missingPrerequisiteNames =
            status === 'bloqueado'
              ? taller.prerequisite_taller_ids
                  .filter((pid) => !completedIds.has(pid))
                  .map((pid) => tallerMap.get(pid) ?? `Taller #${pid}`)
              : [];

          return (
            <div key={taller.id} className="relative">
              <CourseCard
                id={taller.id}
                name={taller.name}
                description={taller.description}
                level={taller.level}
                status={status}
                openEdicion={
                  openEdicion
                    ? {
                        id: openEdicion.id,
                        name: openEdicion.name,
                        start_date: openEdicion.start_date,
                        capacity: openEdicion.capacity,
                        required_points: openEdicion.required_points,
                        _count: openEdicion._count,
                      }
                    : null
                }
                userInscripcionStatus={userInscripcionStatus}
                isAyudante={isAyudante}
                missingPrerequisiteNames={missingPrerequisiteNames}
                userActivePoints={userActivePoints}
              />
              {idx < talleres.length - 1 && (
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

export default function CursosPage() {
  const { data, isLoading } = useSWR('/api/cursos', fetcher);

  const talleres: TallerRow[] = data?.talleres ?? [];
  const userActivePoints: number = data?.userActivePoints ?? 0;
  const isLoggedIn = data !== undefined && !data?.error;

  const completedTallerIds = new Set<number>();
  for (const t of talleres) {
    if (t.branch === 'base') {
      if (isLoggedIn) completedTallerIds.add(t.id);
    } else if (t.ediciones.some((e) => e.inscripciones.some((i) => i.status === 'completado'))) {
      completedTallerIds.add(t.id);
    }
  }

  const baseTalleres = talleres.filter((t) => t.branch === 'base');
  const nieveTalleres = talleres.filter((t) => t.branch === 'nieve_hielo');
  const rocaTalleres = talleres.filter((t) => t.branch === 'roca');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Talleres del Club</h1>
        <p className="mt-2 text-gray-600">
          Ruta de formación CAU — completa los talleres en orden para avanzar en tu camino alpinista.
        </p>
        {!isLoading && !isLoggedIn && (
          <p className="mt-3 text-sm text-blue-700 bg-blue-50 inline-block px-4 py-2 rounded-full">
            <a href="/auth/login" className="font-medium hover:underline">Inicia sesión</a>{' '}
            para ver tu progreso y postular a ediciones.
          </p>
        )}
        {!isLoading && isLoggedIn && userActivePoints > 0 && (
          <p className="mt-3 text-sm text-purple-700 bg-purple-50 inline-block px-4 py-2 rounded-full">
            Tienes <strong>{userActivePoints} punto{userActivePoints !== 1 ? 's' : ''}</strong> activos
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 max-w-sm mx-auto" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="flex-1 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28" />)}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Foundation taller — spans both columns */}
          {baseTalleres.map((taller) => {
            const status = resolveMemberStatus(taller, completedTallerIds, isLoggedIn);
            const openEdicion = getOpenEdicion(taller);
            const userInscripcionStatus = openEdicion
              ? (taller.ediciones.find((e) => e.id === openEdicion.id)?.inscripciones[0]?.status ?? null)
              : null;
            const isAyudante = openEdicion
              ? taller.ediciones.some((e) => e.id === openEdicion.id && e.ayudantias.length > 0)
              : false;

            return (
              <div key={taller.id} className="mb-6">
                <div className="max-w-sm mx-auto">
                  <CourseCard
                    id={taller.id}
                    name={taller.name}
                    description={taller.description}
                    level={taller.level}
                    status={status}
                    openEdicion={
                      openEdicion
                        ? {
                            id: openEdicion.id,
                            name: openEdicion.name,
                            start_date: openEdicion.start_date,
                            capacity: openEdicion.capacity,
                            required_points: openEdicion.required_points,
                            _count: openEdicion._count,
                          }
                        : null
                    }
                    userInscripcionStatus={userInscripcionStatus}
                    isAyudante={isAyudante}
                    userActivePoints={userActivePoints}
                  />
                </div>
                <div className="flex justify-center mt-2 mb-4">
                  <div className="flex gap-12">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-px h-4 bg-gray-300" />
                        <div className="w-24 h-px bg-gray-300" />
                        <div className="w-px h-4 bg-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Two-column branch view */}
          <div className="flex gap-6 items-start">
            <BranchColumn
              title="Nieve / Hielo"
              talleres={nieveTalleres}
              completedIds={completedTallerIds}
              allTalleres={talleres}
              isLoggedIn={isLoggedIn}
              userActivePoints={userActivePoints}
            />
            <div className="w-px bg-gray-200 self-stretch hidden sm:block" />
            <BranchColumn
              title="Roca"
              talleres={rocaTalleres}
              completedIds={completedTallerIds}
              allTalleres={talleres}
              isLoggedIn={isLoggedIn}
              userActivePoints={userActivePoints}
            />
          </div>
        </>
      )}

      {/* Legend */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center text-xs text-gray-600">
        {[
          { color: 'bg-green-400', label: 'Completado' },
          { color: 'bg-blue-400', label: 'Disponible — edición abierta' },
          { color: 'bg-purple-400', label: 'Ayudante registrado' },
          { color: 'bg-gray-300', label: 'Bloqueado (prerequisitos pendientes)' },
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

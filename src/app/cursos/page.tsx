import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/resources/courses/CourseCard';
import type { MemberCourseStatus } from '@/types';

type OpenEdicionInfo = {
  id: number;
  name: string;
  start_date: Date | null;
  capacity: number;
  required_points: number;
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
  ediciones: Array<{
    id: number;
    status: string;
    enrollment_open: boolean;
    capacity: number;
    required_points: number;
    start_date: Date | null;
    name: string;
    inscripciones: { status: string }[];
    ayudantias: { asistio: boolean | null }[];
    _count: { inscripciones: number };
  }>;
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
  if (!prereqsMet) return 'bloqueado';
  return 'disponible';
}

function getOpenEdicion(taller: TallerRow): OpenEdicionInfo | null {
  const open = taller.ediciones.find(
    (e) =>
      e.enrollment_open &&
      e.status !== 'cancelada' &&
      e.status !== 'finalizada'
  );
  return open ?? null;
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
            ? (taller.ediciones
                .find((e) => e.id === openEdicion.id)
                ?.inscripciones[0]?.status ?? null)
            : null;
          const isAyudante = openEdicion
            ? taller.ediciones.some(
                (e) => e.id === openEdicion.id && e.ayudantias.length > 0
              )
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
                        start_date: openEdicion.start_date?.toISOString() ?? null,
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
                  <svg
                    className="w-4 h-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();

  const [talleres, userActivePoints] = await Promise.all([
    prisma.taller.findMany({
      orderBy: [{ branch: 'asc' }, { order_index: 'asc' }],
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
                  select: { asistio: true },
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
                ayudantias: { where: { id: -1 }, select: { asistio: true } },
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
    }) as Promise<TallerRow[]>,
    user
      ? prisma.coursePoints
          .aggregate({
            where: { user_id: user.id, expires_at: { gt: now } },
            _sum: { points: true },
          })
          .then((r) => r._sum.points ?? 0)
      : Promise.resolve(0),
  ]);

  // A taller is "completado" if the user has any Inscripcion with status 'completado'
  const completedTallerIds = new Set<number>();
  for (const t of talleres) {
    if (t.branch === 'base') {
      // base branch: auto-completed for all logged-in members
      if (user) completedTallerIds.add(t.id);
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
          Ruta de formación CAU — completa los talleres en orden para avanzar en tu camino
          alpinista.
        </p>
        {!user && (
          <p className="mt-3 text-sm text-blue-700 bg-blue-50 inline-block px-4 py-2 rounded-full">
            <a href="/auth/login" className="font-medium hover:underline">
              Inicia sesión
            </a>{' '}
            para ver tu progreso y postular a ediciones.
          </p>
        )}
        {user && userActivePoints > 0 && (
          <p className="mt-3 text-sm text-purple-700 bg-purple-50 inline-block px-4 py-2 rounded-full">
            Tienes{' '}
            <strong>
              {userActivePoints} punto{userActivePoints !== 1 ? 's' : ''}
            </strong>{' '}
            activos
          </p>
        )}
      </div>

      {/* Foundation taller — spans both columns */}
      {baseTalleres.map((taller) => {
        const status = resolveMemberStatus(taller, completedTallerIds, Boolean(user));
        const openEdicion = getOpenEdicion(taller);
        const userInscripcionStatus = openEdicion
          ? (taller.ediciones.find((e) => e.id === openEdicion.id)?.inscripciones[0]?.status ??
            null)
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
                        start_date: openEdicion.start_date?.toISOString() ?? null,
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
          isLoggedIn={Boolean(user)}
          userActivePoints={userActivePoints}
        />
        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />
        <BranchColumn
          title="Roca"
          talleres={rocaTalleres}
          completedIds={completedTallerIds}
          allTalleres={talleres}
          isLoggedIn={Boolean(user)}
          userActivePoints={userActivePoints}
        />
      </div>

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

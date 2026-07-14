'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { MemberCourseStatus } from '@/types';

interface OpenEdicionInfo {
  id: number;
  name: string;
  start_date?: string | null;
  capacity: number;
  required_points: number;
  _count: { inscripciones: number };
}

interface CourseCardProps {
  id: number; // taller id
  name: string;
  description: string;
  level: string;
  status: MemberCourseStatus;
  openEdicion?: OpenEdicionInfo | null;
  userInscripcionStatus?: string | null;
  isAyudante?: boolean;
  missingPrerequisiteNames?: string[];
  userActivePoints: number;
}

const levelLabels: Record<string, string> = {
  introductorio: 'Introductorio',
  intermedio: 'Intermedio',
  intermedio_avanzado: 'Intermedio-Avanzado',
  avanzado: 'Avanzado',
};

export default function CourseCard({
  id,
  name,
  description,
  level,
  status,
  openEdicion,
  userInscripcionStatus,
  isAyudante = false,
  missingPrerequisiteNames = [],
  userActivePoints,
}: CourseCardProps) {
  const [ayudanteState, setAyudanteState] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle'
  );

  const spotsLeft = openEdicion
    ? openEdicion.capacity - openEdicion._count.inscripciones
    : 0;
  const hasEnoughPoints =
    !openEdicion ||
    openEdicion.required_points === 0 ||
    userActivePoints >= openEdicion.required_points;

  const borderColor =
    status === 'completado'
      ? 'border-green-400'
      : status === 'disponible'
        ? 'border-blue-400'
        : 'border-gray-200';

  const bgColor =
    status === 'completado' ? 'bg-green-50' : status === 'disponible' ? 'bg-white' : 'bg-gray-50';

  const handleAyudante = async () => {
    if (!openEdicion) return;
    setAyudanteState('loading');
    try {
      const res = await fetch(`/api/ediciones/${openEdicion.id}/ayudante`, {
        method: 'POST',
      });
      if (res.ok) {
        setAyudanteState('done');
      } else {
        setAyudanteState('error');
      }
    } catch {
      setAyudanteState('error');
    }
  };

  const effectiveIsAyudante = isAyudante || ayudanteState === 'done';

  return (
    <div
      className={`relative border-2 ${borderColor} ${bgColor} rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {levelLabels[level] ?? level}
        </span>
        <div className="flex items-center gap-1.5">
          {status === 'completado' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Completado
            </span>
          )}
          {effectiveIsAyudante && (
            <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              Ayudante ✓
            </span>
          )}
          {status === 'bloqueado' && (
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      <h3
        className={`font-semibold text-sm mb-1 ${status === 'bloqueado' ? 'text-gray-400' : 'text-gray-900'}`}
      >
        {name}
      </h3>

      <p
        className={`text-xs line-clamp-2 mb-3 ${status === 'bloqueado' ? 'text-gray-400' : 'text-gray-600'}`}
      >
        {description}
      </p>

      {/* Missing prerequisites */}
      {status === 'bloqueado' && missingPrerequisiteNames.length > 0 && (
        <div className="mb-3 text-xs text-orange-700 bg-orange-50 rounded-md px-3 py-2 border border-orange-200">
          <span className="font-medium">
            Prerequisito{missingPrerequisiteNames.length > 1 ? 's' : ''}:{' '}
          </span>
          {missingPrerequisiteNames.join(', ')}
        </div>
      )}

      {/* Open edition info */}
      {openEdicion && status !== 'bloqueado' && (
        <div className="mb-3 text-xs text-gray-500">
          {openEdicion.start_date && (
            <span>
              {new Date(openEdicion.start_date).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              ·{' '}
            </span>
          )}
          <span>{spotsLeft > 0 ? `${spotsLeft} cupos disponibles` : 'Lista de espera'}</span>
        </div>
      )}

      {/* Points requirement */}
      {openEdicion && openEdicion.required_points > 0 && status !== 'completado' && (
        <div
          className={`mb-3 text-xs rounded-md px-3 py-2 border ${
            hasEnoughPoints
              ? 'text-blue-700 bg-blue-50 border-blue-200'
              : 'text-orange-700 bg-orange-50 border-orange-200'
          }`}
        >
          {hasEnoughPoints
            ? `Tienes ${userActivePoints} pts (necesitas ${openEdicion.required_points})`
            : `Necesitas ${openEdicion.required_points} pts — tienes ${userActivePoints}`}
        </div>
      )}

      {/* ── CTAs ── */}

      {/* completado + open edicion + not ayudante → offer ayudante */}
      {status === 'completado' && openEdicion && !effectiveIsAyudante && (
        <button
          onClick={handleAyudante}
          disabled={ayudanteState === 'loading'}
          className="w-full text-center text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-lg py-1.5 transition-colors disabled:opacity-50"
        >
          {ayudanteState === 'loading'
            ? 'Registrando…'
            : ayudanteState === 'error'
              ? 'Error — reintentar'
              : 'Ser Ayudante'}
        </button>
      )}

      {/* completado + no open edicion → view detail */}
      {status === 'completado' && !openEdicion && (
        <Link
          href={`/cursos/${id}`}
          className="block text-center text-xs font-medium text-green-700 hover:underline"
        >
          Ver ediciones
        </Link>
      )}

      {/* disponible + open edicion + user has not postulated */}
      {status === 'disponible' &&
        openEdicion &&
        !userInscripcionStatus &&
        hasEnoughPoints && (
          <Link
            href={`/cursos/edicion/${openEdicion.id}/postular`}
            className="block text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-1.5 transition-colors"
          >
            Postular
          </Link>
        )}

      {/* disponible + open edicion + user lacks points */}
      {status === 'disponible' &&
        openEdicion &&
        !userInscripcionStatus &&
        !hasEnoughPoints && (
          <span className="block text-center text-xs text-gray-400 cursor-not-allowed">
            Puntos insuficientes
          </span>
        )}

      {/* disponible + postulando */}
      {status === 'disponible' && userInscripcionStatus === 'postulando' && (
        <span className="block text-center text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg py-1.5">
          Postulación enviada
        </span>
      )}

      {/* disponible + aceptado */}
      {status === 'disponible' && userInscripcionStatus === 'aceptado' && (
        <span className="block text-center text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg py-1.5">
          Aceptado ✓
        </span>
      )}

      {/* disponible + en_lista */}
      {status === 'disponible' && userInscripcionStatus === 'en_lista' && (
        <span className="block text-center text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-1.5">
          En lista de espera
        </span>
      )}

      {/* disponible + no open edicion */}
      {status === 'disponible' && !openEdicion && (
        <span className="block text-center text-xs text-gray-400 italic">
          Sin edición abierta
        </span>
      )}

      {/* bloqueado */}
      {status === 'bloqueado' && (
        <span className="block text-center text-xs text-gray-400 cursor-not-allowed">
          No disponible
        </span>
      )}
    </div>
  );
}

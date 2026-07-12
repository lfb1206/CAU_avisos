'use client';
import React from 'react';
import Link from 'next/link';
import type { MemberCourseStatus } from '@/types';

interface CourseCardProps {
  id: number;
  name: string;
  description: string;
  level: string;
  status: MemberCourseStatus;
  enrolledCount: number;
  capacity: number;
  missingPrerequisiteNames?: string[];
}

const levelLabels: Record<string, string> = {
  introductorio:       'Introductorio',
  intermedio:          'Intermedio',
  intermedio_avanzado: 'Intermedio-Avanzado',
  avanzado:            'Avanzado',
};

export default function CourseCard({
  id,
  name,
  description,
  level,
  status,
  enrolledCount,
  capacity,
  missingPrerequisiteNames = [],
}: CourseCardProps) {
  const spotsLeft = capacity - enrolledCount;

  const borderColor =
    status === 'completado' ? 'border-green-400' :
    status === 'disponible' ? 'border-blue-400'  :
    'border-gray-200';

  const bgColor =
    status === 'completado' ? 'bg-green-50' :
    status === 'disponible' ? 'bg-white'    :
    'bg-gray-50';

  return (
    <div className={`relative border-2 ${borderColor} ${bgColor} rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md`}>
      {/* Status indicator */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {levelLabels[level] ?? level}
        </span>
        {status === 'completado' && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completado
          </span>
        )}
        {status === 'bloqueado' && (
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <h3 className={`font-semibold text-sm mb-1 ${status === 'bloqueado' ? 'text-gray-400' : 'text-gray-900'}`}>
        {name}
      </h3>

      <p className={`text-xs line-clamp-2 mb-3 ${status === 'bloqueado' ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>

      {/* Prerequisite tooltip for locked courses */}
      {status === 'bloqueado' && missingPrerequisiteNames.length > 0 && (
        <div className="mb-3 text-xs text-orange-700 bg-orange-50 rounded-md px-3 py-2 border border-orange-200">
          <span className="font-medium">Prerequisito{missingPrerequisiteNames.length > 1 ? 's' : ''}: </span>
          {missingPrerequisiteNames.join(', ')}
        </div>
      )}

      {/* Capacity indicator */}
      {status === 'disponible' && (
        <p className="text-xs text-gray-500 mb-3">
          {spotsLeft > 0 ? `${spotsLeft} cupos disponibles` : 'Lista de espera'}
        </p>
      )}

      {/* CTA */}
      {status === 'disponible' && (
        <Link
          href={`/cursos/${id}`}
          className="block text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-1.5 transition-colors"
        >
          {spotsLeft > 0 ? 'Inscribirse' : 'Lista de espera'}
        </Link>
      )}

      {status === 'completado' && (
        <Link
          href={`/cursos/${id}`}
          className="block text-center text-xs font-medium text-green-700 hover:underline"
        >
          Ver detalles
        </Link>
      )}

      {status === 'bloqueado' && (
        <span className="block text-center text-xs text-gray-400 cursor-not-allowed">
          No disponible
        </span>
      )}
    </div>
  );
}

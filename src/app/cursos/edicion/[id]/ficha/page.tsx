import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PrintButton from './PrintButton';

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

function FichaRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{value}</dd>
    </div>
  );
}

function NumRow({ label, value }: { label: string; value?: number | null }) {
  if (value == null) return null;
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

export default async function EdicionFichaPage({ params }: PageProps) {
  const { id } = await params;

  const edicion = await prisma.edicionTaller.findUnique({
    where: { id: Number(id) },
    include: {
      taller: true,
    },
  });

  if (!edicion) notFound();

  const t = edicion.taller;
  const hasCurriculum = !!(
    t.objetivo || t.contenidos || t.habilidades ||
    t.equipo_personal || t.equipo_recomendado || t.equipo_cau ||
    t.evaluacion_metodo || t.lugar_tipico || t.condiciones_lugar ||
    t.requisitos_personales || t.observaciones
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 print:py-4 print:px-6">
      {/* Back link — hidden on print */}
      <div className="mb-6 print:hidden">
        <Link
          href={`/cursos/${t.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al taller
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>{branchLabels[t.branch] ?? t.branch}</span>
          <span>·</span>
          <span>{levelLabels[t.level] ?? t.level}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t.name}</h1>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">Ficha — {edicion.name}</p>

        {/* Edition dates */}
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
          {edicion.start_date && (
            <p>
              Fecha de inicio:{' '}
              {new Date(edicion.start_date).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          {edicion.profesor && <p>Profesor/a: {edicion.profesor}</p>}
          {edicion.fecha_clases && <p>Clases: {edicion.fecha_clases}</p>}
          {edicion.fecha_salida && <p>Salida a terreno: {edicion.fecha_salida}</p>}
        </div>
      </div>

      {/* Duration stats */}
      {(t.horas_clases || t.horas_practica || t.dias_terreno) && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6 text-center">
          <NumRow label="Hrs. clases" value={t.horas_clases} />
          <NumRow label="Hrs. práctica" value={t.horas_practica} />
          <NumRow label="Hrs. evaluación" value={t.horas_evaluacion} />
          <NumRow label="Días terreno" value={t.dias_terreno} />
          <NumRow label="Días traslado" value={t.dias_traslado} />
        </div>
      )}

      {/* Description */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{t.description}</p>
      </div>

      {/* Curriculum content */}
      {hasCurriculum ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
            Contenido del taller
          </h2>
          <dl>
            <FichaRow label="Objetivo" value={t.objetivo} />
            <FichaRow label="Contenidos" value={t.contenidos} />
            <FichaRow label="Habilidades a desarrollar" value={t.habilidades} />
            <FichaRow label="Lugar típico" value={t.lugar_tipico} />
            <FichaRow label="Condiciones del lugar" value={t.condiciones_lugar} />
            <FichaRow label="Rutas posibles" value={t.rutas_posibles} />
            <FichaRow label="Requisitos personales" value={t.requisitos_personales} />
            <FichaRow label="Método de evaluación" value={t.evaluacion_metodo} />
            <FichaRow label="Prueba de convalidación" value={t.prueba_convalidacion} />
          </dl>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">El coordinador aún no ha ingresado el contenido de este taller.</p>
        </div>
      )}

      {/* Equipment */}
      {(t.equipo_personal || t.equipo_recomendado || t.equipo_cau) && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Equipamiento</h2>
          <dl>
            <FichaRow label="Equipo personal obligatorio" value={t.equipo_personal} />
            <FichaRow label="Equipo personal recomendado" value={t.equipo_recomendado} />
            <FichaRow label="Equipo disponible a préstamo CAU" value={t.equipo_cau} />
          </dl>
        </div>
      )}

      {/* References */}
      {(t.bibliografia || t.observaciones) && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Referencias</h2>
          <dl>
            <FichaRow label="Bibliografía" value={t.bibliografia} />
            <FichaRow label="Observaciones" value={t.observaciones} />
          </dl>
        </div>
      )}

      {/* Print button */}
      <div className="flex justify-end print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}

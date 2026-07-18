'use client';
import React from 'react';
import type { ItineraryDay } from '@/types';
import AutocompleteInput from './AutocompleteInput';

interface ItineraryDayFormProps {
  day: ItineraryDay;
  dayIndex: number;
  onUpdate: (dayIndex: number, field: string, value: unknown) => void;
  onRemove: (dayIndex: number) => void;
  fechaReporteRegreso?: string;
  tramos?: string[];
  actividadesEspecificas?: string[];
}

export default function ItineraryDayForm({
  day,
  dayIndex,
  onUpdate,
  onRemove,
  fechaReporteRegreso,
  tramos = [],
  actividadesEspecificas = [],
}: ItineraryDayFormProps) {
  return (
    <details
      className="border border-gray-200 rounded-lg p-0 transition-colors bg-gray-50"
    >
      <summary className="flex items-center gap-2 cursor-pointer px-4 md:px-6 py-3 text-gray-900 font-semibold">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
              Tramo {dayIndex + 1}
            </span>
            <span className="truncate">{day.tramo || 'Sin tramo'}</span>
            <span className="hidden sm:inline mx-2">-</span>
            <span className="truncate">
              {day.fecha ?
                (() => {
                  const date = new Date(day.fecha + 'T00:00:00');
                  return date.toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/-/g, '/');
                })()
                : 'Sin fecha'
              }
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(dayIndex);
            }}
            className="text-red-600 text-xs font-semibold hover:underline hover:font-bold"
          >
            <span className="hidden sm:inline">Eliminar tramo</span>
            <span className="sm:hidden">Eliminar</span>
          </button>
        </div>
      </summary>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AutocompleteInput
            label="Tramo"
            value={day.tramo || ''}
            onChange={(value) => onUpdate(dayIndex, 'tramo', value)}
            options={tramos}
            placeholder="Seleccione o escriba el tramo"
            required
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
            <input
              type="date"
              value={day.fecha || ''}
              onChange={(e) => onUpdate(dayIndex, 'fecha', e.target.value)}
              min={new Date().toLocaleDateString('sv-SE')}
              max={fechaReporteRegreso ? new Date(fechaReporteRegreso).toLocaleDateString('sv-SE') : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {day.fecha && (
              <>
                {new Date(day.fecha) < new Date(new Date().toLocaleDateString('sv-SE')) && (
                  <p className="text-red-500 text-xs mt-1">
                    La fecha del tramo debe ser hoy o posterior
                  </p>
                )}
                {fechaReporteRegreso && new Date(day.fecha) > new Date(fechaReporteRegreso) && (
                  <p className="text-red-500 text-xs mt-1">
                    La fecha del tramo no puede ser posterior a la fecha de reporte de regreso
                  </p>
                )}
              </>
            )}
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">Actividades *</label>
            <div className="space-y-2">
              {(day.actividades || []).map((actividad, actividadIndex) => (
                <div key={actividadIndex} className="flex items-center gap-2">
                  <div className="flex-1">
                    <AutocompleteInput
                      value={actividad}
                      onChange={(value) => {
                        const updatedActividades = [...(day.actividades || [])];
                        updatedActividades[actividadIndex] = value;
                        onUpdate(dayIndex, 'actividades', updatedActividades);
                      }}
                      options={actividadesEspecificas}
                      placeholder="Ej: Ascenso al campamento"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedActividades = (day.actividades || []).filter((_, index) => index !== actividadIndex);
                      onUpdate(dayIndex, 'actividades', updatedActividades);
                    }}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updatedActividades = [...(day.actividades || []), ''];
                  onUpdate(dayIndex, 'actividades', updatedActividades);
                }}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Agregar Actividad
              </button>
              {(!day.actividades || day.actividades.length === 0) && (
                <p className="text-sm text-gray-500 italic">
                  No se han agregado actividades. Haga clic en &quot;Agregar Actividad&quot; para comenzar.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Hora Inicio *</label>
            <input
              type="time"
              value={day.horaInicio || ''}
              onChange={(e) => onUpdate(dayIndex, 'horaInicio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Hora Fin *</label>
            <input
              type="time"
              value={day.horaFin || ''}
              onChange={(e) => onUpdate(dayIndex, 'horaFin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Altitud Inicio (msnm)</label>
            <input
              type="number"
              value={day.altitudInicio || ''}
              onChange={(e) => onUpdate(dayIndex, 'altitudInicio', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Altitud Fin (msnm)</label>
            <input
              type="number"
              value={day.altitudFin || ''}
              onChange={(e) => onUpdate(dayIndex, 'altitudFin', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </details>
  );
}

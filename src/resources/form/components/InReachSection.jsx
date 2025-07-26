'use client';
import React from 'react';

export default function InReachSection({ 
  llevaInreach, 
  numeroInreach, 
  codigoInreach, 
  onInreachChange, 
  onInreachNumberChange, 
  onInreachCodeChange 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={llevaInreach || false}
            onChange={(e) => onInreachChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            ¿Lleva dispositivo InReach?
          </span>
        </label>
      </div>

      {llevaInreach && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Número de InReach *
            </label>
            <input
              type="text"
              value={numeroInreach || ''}
              onChange={(e) => onInreachNumberChange(e.target.value)}
              placeholder="Ej: 1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={llevaInreach}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Código InReach *
            </label>
            <input
              type="text"
              value={codigoInreach || ''}
              onChange={(e) => onInreachCodeChange(e.target.value)}
              placeholder="Ej: ABC123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={llevaInreach}
            />
          </div>

          <div className="md:col-span-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
            <strong>Nota:</strong> El dispositivo InReach permite comunicación satelital y seguimiento en tiempo real. 
            Asegúrese de que esté activado y configurado correctamente antes de la expedición.
          </div>
        </div>
      )}
    </div>
  );
} 
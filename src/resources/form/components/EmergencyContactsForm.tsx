'use client';
import React from 'react';
import type { RescueBody } from '@/types';

interface EmergencyContactsFormProps {
  cuerposRescate: RescueBody[];
  onUpdate: (index: number, field: string, value: string) => void;
  onAdd: (contact: RescueBody) => void;
  onRemove: (index: number) => void;
  onToggleInclude: (index: number, include: boolean) => void;
}

export default function EmergencyContactsForm({
  cuerposRescate,
  onUpdate,
  onAdd,
  onRemove,
  onToggleInclude
}: EmergencyContactsFormProps) {
  const addNewContact = () => {
    const newContact = {
      nombre: '',
      telefono: '',
      incluir: true
    };
    onAdd(newContact);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {cuerposRescate.map((contacto, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre del cuerpo de rescate *
                    </label>
                    <input
                      type="text"
                      value={contacto.nombre || ''}
                      onChange={(e) => onUpdate(index, 'nombre', e.target.value)}
                      placeholder="Ej: Socorro Andino Santiago"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono *
                    </label>
                    <input
                      type="text"
                      value={contacto.telefono || ''}
                      onChange={(e) => onUpdate(index, 'telefono', e.target.value)}
                      placeholder="Ej: +56 9 9680 5512"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contacto.incluir}
                    onChange={(e) => onToggleInclude(index, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Incluir
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addNewContact}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Agregar Cuerpo de Rescate
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-900 mb-2">
          💡 Consejos para los cuerpos de rescate:
        </h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Marque solo los cuerpos de rescate relevantes para su región</li>
          <li>• Agregue contactos locales específicos de su área</li>
          <li>• Incluya números de emergencia internacionales si viaja al extranjero</li>
          <li>• Verifique que los números estén actualizados antes de la expedición</li>
        </ul>
      </div>
    </div>
  );
} 
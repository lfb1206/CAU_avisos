'use client';
import React from 'react';
import { formOptions } from '../../constants/formOptions';
import AutocompleteInput from './AutocompleteInput';

export default function EquipmentForm({ 
  equipment, 
  index, 
  onUpdate, 
  onRemove 
}) {
  const handleQuantityChange = (value) => {
    const numValue = parseInt(value);
    if (numValue > 0) {
      onUpdate(index, 'cantidad', value);
    }
  };

  return (
    <details
      className={`border border-gray-200 rounded-lg p-0 transition-colors ${equipment.checked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
    >
      <summary className="flex items-center gap-2 cursor-pointer px-6 py-3 text-gray-900 font-semibold">
        <span>{equipment.categoria || 'Sin categoría'}</span>
        <span className="mx-2">/</span>
        <span>{equipment.item || 'Sin item'}</span>
        <button
          type="button"
          onClick={() => onUpdate(index, 'checked', !equipment.checked)}
          className={`ml-2 flex items-center px-2 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${equipment.checked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          aria-pressed={equipment.checked}
        >
          {equipment.checked ? 'Se está portando' : 'No se porta'}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="ml-auto text-red-600 text-xs font-semibold hover:underline hover:font-bold"
        >
          Eliminar equipo
        </button>
      </summary>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AutocompleteInput
            label="Categoría"
            value={equipment.categoria || ''}
            onChange={(value) => onUpdate(index, 'categoria', value)}
            options={formOptions.equipmentCategories.map(cat => cat.label)}
            placeholder="Seleccione o escriba la categoría"
            required
          />

          <AutocompleteInput
            label="Item"
            value={equipment.item || ''}
            onChange={(value) => onUpdate(index, 'item', value)}
            options={formOptions.equipmentItems[equipment.categoria] || []}
            placeholder="Seleccione o escriba el item"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              value={equipment.cantidad || '1'}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {equipment.cantidad && (isNaN(equipment.cantidad) || parseInt(equipment.cantidad) < 1) && (
              <p className="text-red-500 text-xs mt-1">
                La cantidad debe ser un número mayor a 0
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <input
              type="text"
              value={equipment.observaciones || ''}
              onChange={(e) => onUpdate(index, 'observaciones', e.target.value)}
              placeholder="Observaciones adicionales"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </details>
  );
} 
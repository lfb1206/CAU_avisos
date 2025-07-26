'use client';
import React, { useState, useCallback } from 'react';
import AutocompleteInput from './AutocompleteInput';
import { savedData } from '../../constants/savedData';

export default function EquipmentForm({ equipment, index, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleInputChange = useCallback((field, value) => {
    onUpdate(index, field, value);
  }, [onUpdate, index]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  const handleToggleChecked = useCallback(() => {
    handleInputChange('checked', !equipment.checked);
  }, [handleInputChange, equipment.checked]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleExpanded}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="font-medium text-gray-900">
            {equipment.item || 'Nuevo equipo'}
          </span>
          {equipment.categoria && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {equipment.categoria}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleChecked}
            className={`flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
              equipment.checked 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {equipment.checked ? '✓ Se está portando' : '✗ No se porta'}
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <AutocompleteInput
                value={equipment.categoria || ''}
                onChange={(value) => handleInputChange('categoria', value)}
                options={savedData.formOptions.categoriasEquipo}
                placeholder="Ej: Equipo de Escalada"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Item
              </label>
              <input
                type="text"
                value={equipment.item || ''}
                onChange={(e) => handleInputChange('item', e.target.value)}
                placeholder="Ej: Casco"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                value={equipment.cantidad || ''}
                onChange={(e) => handleInputChange('cantidad', e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                value={equipment.observaciones || ''}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Detalles adicionales sobre el equipo..."
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
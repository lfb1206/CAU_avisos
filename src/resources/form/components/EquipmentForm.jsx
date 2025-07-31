'use client';
import React, { useState, useCallback } from 'react';
import AutocompleteInput from './AutocompleteInput';
import { equipmentData } from '../../constants/equipmentData';

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
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm">
      {/* Header - Mejorado para móvil */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleToggleExpanded}
            className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            <svg 
              className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="font-medium text-gray-900 truncate text-sm sm:text-base">
            {equipment.item || 'Nuevo equipo'}
          </span>
          {equipment.categoria && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">
              {equipment.categoria}
            </span>
          )}
        </div>
        
        {/* Botones - Apilados en móvil, en línea en desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">No se porta</span>
            <button
              type="button"
              onClick={handleToggleChecked}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                equipment.checked ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  equipment.checked ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-600">Se está portando</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-2 text-xs sm:text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Campos en una sola columna en móvil */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <AutocompleteInput
                value={equipment.categoria || ''}
                onChange={(value) => handleInputChange('categoria', value)}
                options={equipmentData.categories.map(cat => cat.name)}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          
          {/* Cantidad y Observaciones en una sola columna en móvil */}
          <div className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
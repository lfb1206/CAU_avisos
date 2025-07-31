'use client';
import React from 'react';
import { transportOptions } from '../../constants/transportOptions';
import AutocompleteInput from './AutocompleteInput';

export default function TransportForm({ 
  transport, 
  index, 
  onUpdate, 
  onRemove,
  getConductorOptions 
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Transporte {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AutocompleteInput
          label="Tipo"
          value={transport.tipo || ''}
          onChange={(value) => onUpdate(index, 'tipo', value)}
          options={transportOptions.transportTypes.map(t => t.label)}
          placeholder="Seleccione o escriba el tipo de transporte"
          required
        />

        <AutocompleteInput
          label="Conductor"
          value={transport.conductor || ''}
          onChange={(value) => onUpdate(index, 'conductor', value)}
          options={getConductorOptions()}
          placeholder="Seleccione o escriba el conductor"
          required
        />

        <AutocompleteInput
          label="Marca"
          value={transport.marca || ''}
          onChange={(value) => onUpdate(index, 'marca', value)}
          options={transportOptions.vehicleBrands}
          placeholder="Seleccione o escriba la marca"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            value={transport.modelo || ''}
            onChange={(e) => onUpdate(index, 'modelo', e.target.value)}
            placeholder="Modelo del vehículo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            value={transport.color || ''}
            onChange={(e) => onUpdate(index, 'color', e.target.value)}
            placeholder="Color del vehículo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Patente
          </label>
          <input
            type="text"
            value={transport.patente || ''}
            onChange={(e) => onUpdate(index, 'patente', e.target.value)}
            placeholder="Patente del vehículo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Distancia (km)
          </label>
          <input
            type="number"
            value={transport.distancia || ''}
            onChange={(e) => onUpdate(index, 'distancia', e.target.value)}
            placeholder="Distancia total ida y vuelta"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
} 
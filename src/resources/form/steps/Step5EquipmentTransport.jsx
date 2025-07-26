'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import { savedData } from '../../constants/savedData';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  const addEquipment = () => {
    const newEquipment = {
      categoria: '',
      item: '',
      cantidad: '',
      descripcion: ''
    };
    addItem('equipo', newEquipment);
  };

  const addTransport = () => {
    const newTransport = {
      tipo: '',
      conductor: '',
      marca: '',
      modelo: '',
      color: '',
      patente: '',
      distancia: ''
    };
    addItem('transporte', newTransport);
  };

  const updateEquipment = (index, field, value) => {
    updateItem('equipo', index, { [field]: value });
  };

  const updateTransport = (index, field, value) => {
    updateItem('transporte', index, { [field]: value });
  };

  // Get conductor options (participants + external)
  const getConductorOptions = () => {
    const participants = formData.participantes.map(p => p.nombre);
    const externalDrivers = [
      'Conductor externo',
      'Guía de montaña',
      'Chofer contratado',
      'Transporte público',
      'Otro'
    ];
    return [...participants, ...externalDrivers];
  };

  // Auto-fill equipment recommendations based on activity
  const addRecommendedEquipment = () => {
    const activity = formData.basicInfo.actividad;
    if (activity && savedData.activityRecommendations[activity]) {
      const recommendations = savedData.activityRecommendations[activity];
      
      // Clear existing equipment
      formData.equipo.forEach((_, index) => {
        removeItem('equipo', 0); // Remove first item until all are gone
      });
      
      // Add recommended equipment
      Object.entries(recommendations.equipment).forEach(([category, items]) => {
        items.forEach(item => {
          const newEquipment = {
            categoria: category,
            item: item,
            cantidad: '1',
            descripcion: `Recomendado para ${activity}`
          };
          addItem('equipo', newEquipment);
        });
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Equipo y Transporte
        </h2>
        <p className="text-gray-600">
          Registre el equipo que se porta y el transporte utilizado
        </p>
      </div>

      {/* Equipment Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Equipo Portado
          </h3>
          <div className="flex space-x-2">
            {formData.basicInfo.actividad && savedData.activityRecommendations[formData.basicInfo.actividad] && (
              <button
                type="button"
                onClick={addRecommendedEquipment}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                🎯 Cargar Recomendaciones
              </button>
            )}
            <button
              type="button"
              onClick={addEquipment}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Agregar Equipo
            </button>
          </div>
        </div>

        {formData.basicInfo.actividad && savedData.activityRecommendations[formData.basicInfo.actividad] && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              💡 Recomendación de Equipo
            </h4>
            <p className="text-sm text-yellow-800">
              Para la actividad "{formData.basicInfo.actividad}" se recomienda equipo específico. 
              Haga clic en "Cargar Recomendaciones" para agregar automáticamente el equipo sugerido.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {formData.equipo.map((equipment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Equipo {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeItem('equipo', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría *
                  </label>
                  <select
                    value={equipment.categoria}
                    onChange={(e) => updateEquipment(index, 'categoria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {formOptions.equipmentCategories.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <AutocompleteInput
                  label="Item"
                  value={equipment.item}
                  onChange={(value) => updateEquipment(index, 'item', value)}
                  options={equipment.categoria && formOptions.equipmentItems[equipment.categoria] 
                    ? formOptions.equipmentItems[equipment.categoria] 
                    : []
                  }
                  placeholder="Seleccione o escriba el item"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={equipment.cantidad}
                    onChange={(e) => updateEquipment(index, 'cantidad', e.target.value)}
                    placeholder="1"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={equipment.descripcion}
                    onChange={(e) => updateEquipment(index, 'descripcion', e.target.value)}
                    placeholder="Descripción adicional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Transporte Utilizado
          </h3>
          <button
            type="button"
            onClick={addTransport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            + Agregar Transporte
          </button>
        </div>

        <div className="space-y-4">
          {formData.transporte.map((transport, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Transporte {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeItem('transporte', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutocompleteInput
                  label="Tipo de Transporte"
                  value={transport.tipo}
                  onChange={(value) => updateTransport(index, 'tipo', value)}
                  options={formOptions.transportTypes.map(t => t.label)}
                  placeholder="Seleccione o escriba el tipo de transporte"
                  required
                />

                <AutocompleteInput
                  label="Conductor"
                  value={transport.conductor}
                  onChange={(value) => updateTransport(index, 'conductor', value)}
                  options={getConductorOptions()}
                  placeholder="Seleccione o escriba el conductor"
                />

                <AutocompleteInput
                  label="Marca"
                  value={transport.marca}
                  onChange={(value) => updateTransport(index, 'marca', value)}
                  options={formOptions.vehicleBrands}
                  placeholder="Seleccione o escriba la marca"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={transport.modelo}
                    onChange={(e) => updateTransport(index, 'modelo', e.target.value)}
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
                    value={transport.color}
                    onChange={(e) => updateTransport(index, 'color', e.target.value)}
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
                    value={transport.patente}
                    onChange={(e) => updateTransport(index, 'patente', e.target.value)}
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
                    value={transport.distancia}
                    onChange={(e) => updateTransport(index, 'distancia', e.target.value)}
                    placeholder="Distancia total ida y vuelta"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Registre todo el equipo que se porta en la expedición</li>
          <li>• Use "Cargar Recomendaciones" para agregar equipo sugerido según la actividad</li>
          <li>• Organice el equipo por categorías para mejor control</li>
          <li>• Especifique cantidades y descripciones detalladas</li>
          <li>• Registre todos los medios de transporte utilizados</li>
          <li>• Incluya información del conductor y detalles del vehículo</li>
          <li>• Calcule la distancia recorrida</li>
          <li>• Use las opciones sugeridas o escriba su propio texto</li>
        </ul>
      </div>
    </div>
  );
} 
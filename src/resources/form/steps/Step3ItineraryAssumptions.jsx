'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step3ItineraryAssumptions() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  // Excel logic for risk assessment - FIXED LOGIC
  const calculateRiskAction = (probability, impact) => {
    if (!probability || !impact) return '';
    
    const isHighProbability = probability === 'muy_probable' || probability === 'algo_probable';
    const isHighImpact = impact === 'significativo' || impact === 'critico';
    
    if (isHighProbability && isHighImpact) {
      return 'gestionar';
    } else if (impact === 'critico') {
      return 'monitoreo_intenso';
    } else {
      return 'monitoreo_normal';
    }
  };

  const addItineraryDay = () => {
    const newDay = {
      tramo: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      altitudInicio: '',
      altitudFin: '',
      actividad: '',
      supuestos: []
    };
    addItem('itinerario', newDay);
  };

  const addAssumption = (itineraryIndex) => {
    const newAssumption = {
      supuesto: '',
      tipoSupuesto: '',
      probabilidad: '',
      impacto: '',
      accion: ''
    };
    
    const updatedItinerary = [...formData.itinerario];
    updatedItinerary[itineraryIndex].supuestos.push(newAssumption);
    updateItem('itinerario', itineraryIndex, updatedItinerary[itineraryIndex]);
  };

  const updateAssumption = (itineraryIndex, assumptionIndex, field, value) => {
    const updatedItinerary = [...formData.itinerario];
    const updatedSupuestos = [...updatedItinerary[itineraryIndex].supuestos];
    updatedSupuestos[assumptionIndex] = { ...updatedSupuestos[assumptionIndex], [field]: value };
    
    // Calculate action based on probability and impact
    if (field === 'probabilidad' || field === 'impacto') {
      const prob = field === 'probabilidad' ? value : updatedSupuestos[assumptionIndex].probabilidad;
      const imp = field === 'impacto' ? value : updatedSupuestos[assumptionIndex].impacto;
      updatedSupuestos[assumptionIndex].accion = calculateRiskAction(prob, imp);
    }
    
    updatedItinerary[itineraryIndex].supuestos = updatedSupuestos;
    updateItem('itinerario', itineraryIndex, updatedItinerary[itineraryIndex]);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'gestionar': return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoreo_intenso': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'monitoreo_normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'gestionar': return 'Gestionar';
      case 'monitoreo_intenso': return 'Monitoreo Intenso';
      case 'monitoreo_normal': return 'Monitoreo Normal';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Itinerario y Supuestos Clave
        </h2>
        <p className="text-gray-600">
          Defina el itinerario detallado y los supuestos clave para cada tramo
        </p>
      </div>

      {/* Itinerary Days */}
      <div className="space-y-6">
        {formData.itinerario.map((day, dayIndex) => (
          <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tramo {dayIndex + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeItem('itinerario', dayIndex)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Eliminar Tramo
              </button>
            </div>

            {/* Itinerary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <AutocompleteInput
                label="Tramo"
                value={day.tramo}
                onChange={(value) => updateItem('itinerario', dayIndex, { ...day, tramo: value })}
                options={formOptions.tramos}
                placeholder="Seleccione o escriba el tramo"
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={day.fecha}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Actividad *
                </label>
                <input
                  type="text"
                  value={day.actividad}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, actividad: e.target.value })}
                  placeholder="Ej: Ascenso al campamento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={day.horaInicio}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, horaInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={day.horaFin}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, horaFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Altitud Inicio (msnm)
                </label>
                <input
                  type="number"
                  value={day.altitudInicio}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, altitudInicio: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Altitud Fin (msnm)
                </label>
                <input
                  type="number"
                  value={day.altitudFin}
                  onChange={(e) => updateItem('itinerario', dayIndex, { ...day, altitudFin: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Assumptions for this day */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Supuestos Clave para el Éxito
              </h4>
              
              <div className="space-y-4">
                {day.supuestos.map((assumption, assumptionIndex) => (
                  <div key={assumptionIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-medium text-gray-900">
                        Supuesto {assumptionIndex + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSupuestos = day.supuestos.filter((_, i) => i !== assumptionIndex);
                          updateItem('itinerario', dayIndex, { ...day, supuestos: updatedSupuestos });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <AutocompleteInput
                          label="Supuesto clave"
                          value={assumption.supuesto}
                          onChange={(value) => updateAssumption(dayIndex, assumptionIndex, 'supuesto', value)}
                          options={formOptions.supuestos}
                          placeholder="Seleccione o escriba el supuesto clave"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Tipo de supuesto
                        </label>
                        <select
                          value={assumption.tipoSupuesto}
                          onChange={(e) => updateAssumption(dayIndex, assumptionIndex, 'tipoSupuesto', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Seleccionar tipo</option>
                          {formOptions.tipoSupuestos.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Probabilidad *
                        </label>
                        <select
                          value={assumption.probabilidad}
                          onChange={(e) => updateAssumption(dayIndex, assumptionIndex, 'probabilidad', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        >
                          <option value="">Seleccionar probabilidad</option>
                          {formOptions.probabilidades.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Impacto *
                        </label>
                        <select
                          value={assumption.impacto}
                          onChange={(e) => updateAssumption(dayIndex, assumptionIndex, 'impacto', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          required
                        >
                          <option value="">Seleccionar impacto</option>
                          {formOptions.impactos.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Acción Requerida
                        </label>
                        <div className={`px-3 py-2 rounded-md border text-sm font-medium ${getActionColor(assumption.accion)}`}>
                          {getActionLabel(assumption.accion)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addAssumption(dayIndex)}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  + Agregar Supuesto
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Day Button */}
        <button
          type="button"
          onClick={addItineraryDay}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Agregar Tramo
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Defina el itinerario tramo por tramo con horarios y altitudes</li>
          <li>• Para cada tramo, identifique los supuestos clave para el éxito</li>
          <li>• Asigne probabilidad e impacto a cada supuesto</li>
          <li>• El sistema calculará automáticamente la acción requerida</li>
          <li>• Supuestos marcados como "Gestionar" irán al siguiente paso</li>
          <li>• Use las opciones sugeridas o escriba su propio texto</li>
        </ul>
      </div>
    </div>
  );
} 
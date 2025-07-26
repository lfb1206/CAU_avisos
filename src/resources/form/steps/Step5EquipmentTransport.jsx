'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { savedData } from '../../constants/savedData';
import EquipmentForm from '../components/EquipmentForm';
import TransportForm from '../components/TransportForm';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  const addEquipment = () => {
    const newEquipment = {
      categoria: '',
      item: '',
      cantidad: '1',
      observaciones: '',
      checked: true
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
        removeItem('equipo', 0);
      });
      
      // Handle both array format and object format
      if (Array.isArray(recommendations)) {
        recommendations.forEach(item => {
          const newEquipment = {
            categoria: item.categoria,
            item: item.item,
            cantidad: item.cantidad || '1',
            observaciones: item.observaciones || `Recomendado para ${activity}`,
            checked: false
          };
          addItem('equipo', newEquipment);
        });
      } else if (recommendations.equipment && typeof recommendations.equipment === 'object') {
        Object.entries(recommendations.equipment).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach(item => {
              const newEquipment = {
                categoria: category,
                item: item,
                cantidad: '1',
                observaciones: `Recomendado para ${activity}`,
                checked: false
              };
              addItem('equipo', newEquipment);
            });
          }
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
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
          {formData.basicInfo.actividad && savedData.activityRecommendations[formData.basicInfo.actividad] && (
            <button
              type="button"
              onClick={addRecommendedEquipment}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-semibold shadow hover:bg-yellow-500 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Cargar recomendaciones
            </button>
          )}
        </div>

        {/* Equipment Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            ℹ️ Importante - Checklist de Equipo
          </h4>
          <p className="text-sm text-blue-800">
            <strong>Solo el equipo marcado como "Se está portando" aparecerá en el aviso de salida.</strong> 
            Use los checkboxes para indicar qué equipo realmente se lleva en la expedición. 
            El equipo no marcado no se incluirá en el documento final.
          </p>
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
            <EquipmentForm
              key={index}
              equipment={equipment}
              index={index}
              onUpdate={updateEquipment}
              onRemove={(index) => removeItem('equipo', index)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={addEquipment}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + Agregar Equipo
          </button>
        </div>
      </div>

      {/* Transport Section */}
      <div className="space-y-6 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Transporte
          </h3>
        </div>
        
        <div className="space-y-4">
          {formData.transporte.map((transport, index) => (
            <TransportForm
              key={index}
              transport={transport}
              index={index}
              onUpdate={updateTransport}
              onRemove={(index) => removeItem('transporte', index)}
              getConductorOptions={getConductorOptions}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={addTransport}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + Agregar Transporte
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-purple-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-purple-900 mb-3">
          🎒 Consejos para registrar equipo y transporte:
        </h4>
        <ul className="list-disc pl-5 text-purple-900 text-sm space-y-1">
          <li>Agrega cada ítem de equipo con su categoría, nombre y cantidad.</li>
          <li>Utiliza el campo <b>Observaciones</b> para anotar detalles relevantes (por ejemplo: "Recomendado para la actividad", "Equipo compartido", etc.).</li>
          <li>Puedes cargar recomendaciones de equipo para la actividad seleccionada usando el botón amarillo <b>Cargar recomendaciones</b>. Revisa y edita antes de marcar como portado.</li>
          <li>Solo los ítems marcados como <b>Se está portando</b> aparecerán en el aviso de salida.</li>
          <li>En transporte, registra cada vehículo y conductor relevante.</li>
        </ul>
      </div>
    </div>
  );
} 
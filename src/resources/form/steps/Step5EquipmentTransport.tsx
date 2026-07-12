'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { getEquipmentForActivity as getActivityEquipment, getEquipmentForSpecificActivity } from '../../constants/activityEquipmentData';
import { getAvailableChecklists, applyChecklistToEquipment } from '../../constants/wikiexploraChecklists';
import { carbonEmissionFactors } from '../../constants/transportOptions';
import EquipmentTable from '../components/EquipmentTable';
import TransportForm from '../components/TransportForm';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [selectedChecklist, setSelectedChecklist] = useState('');

  const addEquipment = () => {
    addItem('equipo', {
      categoria: '',
      item: '',
      cantidad: '1',
      observaciones: '',
      checked: true
    });
  };

  const addTransport = () => {
    addItem('transporte', {
      tipo: '',
      conductor: '',
      marca: '',
      modelo: '',
      color: '',
      patente: '',
      distancia: '',
      tipoCombustible: '',
      tipoAuto: '',
      anioVehiculo: '',
      capacidad: '',
      huellaCarbono: ''
    });
  };

  const updateEquipment = (index: number, field: string, value: unknown) => {
    updateItem('equipo', index, { [field]: value });
  };

  const updateTransport = (index: number, field: string, value: unknown) => {
    updateItem('transporte', index, { [field]: value });

    const transport = formData.transporte[index];
    const updatedTransport = { ...transport, [field]: value };
    const tipoNormalizado = updatedTransport.tipo?.toLowerCase();
    const carbonTriggers = ['distancia', 'tipo', 'tipoCombustible', 'tipoAuto', 'anioVehiculo', 'capacidad'];

    if (carbonTriggers.includes(field)) {
      const huellaCarbono = calculateCarbonFootprint(updatedTransport);
      updateItem('transporte', index, { huellaCarbono });
    }
  };

  const calculateCarbonFootprint = (transport: import('@/types').Transport): string => {
    if (!transport.distancia || !transport.tipo) return '';

    const distancia = parseFloat(transport.distancia);
    if (isNaN(distancia) || distancia <= 0) return '';

    const tipoNormalizado = transport.tipo.toLowerCase();

    if (tipoNormalizado === 'auto particular') {
      if (!transport.tipoCombustible) return '';
      const fuelFactor = carbonEmissionFactors.fuelFactors[transport.tipoCombustible] || 0;
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
      const vehicleFactor = transport.tipoAuto ? (carbonEmissionFactors.vehicleFactors[transport.tipoAuto] || 0) : 0;
      const efficiencyFactor = carbonEmissionFactors.getEfficiencyFactor(transport.anioVehiculo);
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      const baseEmission = distancia * (fuelFactor + transportFactor + vehicleFactor);
      return (baseEmission * efficiencyFactor * occupancyFactor).toFixed(2);
    }

    if (tipoNormalizado === 'bus') {
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      return (distancia * transportFactor * occupancyFactor).toFixed(2);
    }

    const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
    return (distancia * transportFactor).toFixed(2);
  };

  const getConductorOptions = () => {
    const externalDrivers = ['Conductor externo', 'Guía de montaña', 'Chofer contratado', 'Transporte público', 'Otro'];
    return [...formData.participantes.map(p => p.nombre), ...externalDrivers];
  };

  const getEquipmentForActivity = (actividad: string) => {
    if (!actividad) return [];
    const suggestions = [];

    const specificEquipment = getEquipmentForSpecificActivity(actividad);
    if (specificEquipment && specificEquipment.length > 0) {
      specificEquipment.forEach(item => {
        suggestions.push({
          categoria: item.category,
          item: item.item,
          cantidad: 1,
          observaciones: `Esencial: ${item.essential ? 'Sí' : 'No'} (Sugerido por actividad específica)`
        });
      });
      return suggestions;
    }

    const generalEquipment = getActivityEquipment(actividad);
    if (generalEquipment) {
      const equipmentItems = generalEquipment.basicEquipment || (Array.isArray(generalEquipment) ? generalEquipment : []);
      equipmentItems.forEach(item => {
        suggestions.push({
          categoria: item.category,
          item: item.item,
          cantidad: 1,
          observaciones: `Esencial: ${item.essential ? 'Sí' : 'No'} (Sugerido por actividad general)`
        });
      });
    }

    return suggestions;
  };

  const loadActivityRecommendations = () => {
    const suggestions = [];
    const processedActivities = new Set();

    formData.itinerario?.forEach((day) => {
      day.actividades?.forEach(actividad => {
        if (!processedActivities.has(actividad)) {
          suggestions.push(...getEquipmentForActivity(actividad));
          processedActivities.add(actividad);
        }
      });
    });

    if (formData.basicInfo?.actividad && !processedActivities.has(formData.basicInfo.actividad)) {
      suggestions.push(...getEquipmentForActivity(formData.basicInfo.actividad));
    }

    const existingItems = new Set(
      formData.equipo.map(e => `${e.item.toLowerCase()}-${e.categoria.toLowerCase()}`)
    );

    suggestions.forEach(item => {
      const key = `${item.item.toLowerCase()}-${item.categoria.toLowerCase()}`;
      if (!existingItems.has(key)) {
        addItem('equipo', {
          categoria: item.categoria,
          item: item.item,
          cantidad: item.cantidad.toString(),
          observaciones: item.observaciones,
          checked: false
        });
        existingItems.add(key);
      }
    });
  };

  const applyWikiexploraChecklist = () => {
    if (!selectedChecklist) return;
    const equipment = applyChecklistToEquipment(selectedChecklist, true);
    equipment.forEach(item => {
      const exists = formData.equipo.some(
        e => e.item.toLowerCase() === item.item.toLowerCase() &&
             e.categoria.toLowerCase() === item.categoria.toLowerCase()
      );
      if (!exists) {
        addItem('equipo', {
          categoria: item.categoria,
          item: item.item,
          cantidad: item.cantidad.toString(),
          observaciones: item.observaciones,
          checked: false
        });
      }
    });
    setSelectedChecklist('');
  };

  // FIX BUG-3: remove from last index to first so indices don't shift
  const clearAllEquipment = () => {
    for (let i = formData.equipo.length - 1; i >= 0; i--) {
      removeItem('equipo', i);
    }
  };

  const availableChecklists = getAvailableChecklists();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Equipo y Transporte
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Registre el equipo que se porta y el transporte utilizado
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Equipo Portado</h3>

          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 sm:items-center">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedChecklist}
                onChange={(e) => setSelectedChecklist(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar checklist</option>
                {availableChecklists.map(checklist => (
                  <option key={checklist.value} value={checklist.value}>
                    {checklist.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                loadActivityRecommendations();
                if (selectedChecklist) applyWikiexploraChecklist();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-colors text-sm w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Cargar recomendaciones
            </button>

            {formData.equipo.length > 0 && (
              <button
                type="button"
                onClick={clearAllEquipment}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar todo
              </button>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Importante - Checklist de Equipo</h4>
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Solo el equipo marcado como "Se está portando" aparecerá en el aviso de salida.</strong>
              Use los checkboxes para indicar qué equipo realmente se lleva en la expedición.
            </p>
          </div>

          <div className="space-y-4">
            <EquipmentTable
              equipment={formData.equipo}
              onUpdate={updateEquipment}
              onRemove={(index) => removeItem('equipo', index)}
              onAdd={addEquipment}
            />
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Transporte</h3>
          </div>

          <div className="space-y-4">
            {formData.transporte?.map((transport, index) => (
              <TransportForm
                key={index}
                transport={transport}
                index={index}
                onUpdate={updateTransport}
                onRemove={(index) => removeItem('transporte', index)}
                getConductorOptions={getConductorOptions}
              />
            ))}

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={addTransport}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base"
              >
                + Agregar Transporte
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-purple-50 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-semibold text-purple-900 mb-3">Consejos para registrar equipo y transporte:</h4>
          <ul className="list-disc pl-5 text-purple-900 text-xs sm:text-sm space-y-1">
            <li><strong>Checklists:</strong> Seleccione un checklist específico para agregar equipo recomendado según el tipo de ruta.</li>
            <li><strong>Cargar recomendaciones:</strong> Use el botón azul para agregar equipo basado en las actividades de los tramos.</li>
            <li><strong>Sin duplicados:</strong> Los checklists y recomendaciones se agregan sin sobrescribir el equipo existente.</li>
            <li><strong>Limpiar todo:</strong> Use el botón rojo para eliminar todo el equipo y empezar de nuevo.</li>
            <li>Agrega cada ítem de equipo con su categoría, nombre y cantidad.</li>
            <li>Utiliza el campo <strong>Observaciones</strong> para anotar detalles relevantes.</li>
            <li>Solo los ítems marcados como <strong>Se está portando</strong> aparecerán en el aviso de salida.</li>
            <li>En transporte, registra cada vehículo y conductor relevante.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

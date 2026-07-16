'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { carbonEmissionFactors } from '../../constants/carbonFactors';
import EquipmentTable from '../components/EquipmentTable';
import TransportForm from '../components/TransportForm';

// ── Types for API responses ───────────────────────────────────────────────────

interface EquipmentEntry {
  item: string;
  category: string;
  essential: boolean;
}

interface ActivityEquipmentRecommendations {
  basicEquipment?: EquipmentEntry[];
  [key: string]: unknown;
}

interface Activity {
  id: number;
  name: string;
  equipment_recommendations: ActivityEquipmentRecommendations | null;
}

interface ChecklistItem {
  categoria: string;
  item: string;
  cantidad: number;
  observaciones: string;
}

interface ChecklistItems {
  imprescindibles: ChecklistItem[];
  aconsejables: ChecklistItem[];
}

interface Checklist {
  id: number;
  key: string;
  name: string;
  items: ChecklistItems;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [selectedChecklist, setSelectedChecklist] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);

  useEffect(() => {
    fetch('/api/activities')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (data && typeof data === 'object' && 'activities' in data) {
          setActivities((data as { activities: Activity[] }).activities);
        }
      })
      .catch(() => {});

    fetch('/api/checklists')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (data && typeof data === 'object' && 'checklists' in data) {
          setChecklists((data as { checklists: Checklist[] }).checklists);
        }
      })
      .catch(() => {});
  }, []);

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
      const fuelFactor = carbonEmissionFactors.fuelFactors[transport.tipoCombustible as keyof typeof carbonEmissionFactors.fuelFactors] ?? 0;
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] ?? 0;
      const vehicleFactor = transport.tipoAuto
        ? (carbonEmissionFactors.vehicleFactors[transport.tipoAuto as keyof typeof carbonEmissionFactors.vehicleFactors] ?? 0)
        : 0;
      const efficiencyFactor = carbonEmissionFactors.getEfficiencyFactor(transport.anioVehiculo);
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      const baseEmission = distancia * (fuelFactor + transportFactor + vehicleFactor);
      return (baseEmission * efficiencyFactor * occupancyFactor).toFixed(2);
    }

    if (tipoNormalizado === 'bus') {
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] ?? 0;
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      return (distancia * transportFactor * occupancyFactor).toFixed(2);
    }

    const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] ?? 0;
    return (distancia * transportFactor).toFixed(2);
  };

  const getConductorOptions = () => {
    const externalDrivers = ['Conductor externo', 'Guía de montaña', 'Chofer contratado', 'Transporte público', 'Otro'];
    return [...formData.participantes.map((p: { nombre: string }) => p.nombre), ...externalDrivers];
  };

  /** Look up equipment suggestions for an activity name from the API-fetched list */
  const getEquipmentSuggestionsForActivity = (actividadName: string): Array<{ categoria: string; item: string; cantidad: number; observaciones: string }> => {
    if (!actividadName) return [];

    // Try exact match first (case-insensitive), then partial
    const match = activities.find(
      (a) => a.name.toLowerCase() === actividadName.toLowerCase()
    ) ?? activities.find(
      (a) => actividadName.toLowerCase().includes(a.name.toLowerCase()) ||
             a.name.toLowerCase().includes(actividadName.toLowerCase())
    );

    if (!match?.equipment_recommendations?.basicEquipment) return [];

    return match.equipment_recommendations.basicEquipment.map((entry) => ({
      categoria: entry.category,
      item: entry.item,
      cantidad: 1,
      observaciones: `Esencial: ${entry.essential ? 'Sí' : 'No'} (Sugerido por actividad)`,
    }));
  };

  const loadActivityRecommendations = () => {
    const suggestions: Array<{ categoria: string; item: string; cantidad: number; observaciones: string }> = [];
    const processedActivities = new Set<string>();

    formData.itinerario?.forEach((day: { actividades?: string[] }) => {
      day.actividades?.forEach((actividad: string) => {
        if (!processedActivities.has(actividad)) {
          suggestions.push(...getEquipmentSuggestionsForActivity(actividad));
          processedActivities.add(actividad);
        }
      });
    });

    if (formData.basicInfo?.actividad && !processedActivities.has(formData.basicInfo.actividad)) {
      suggestions.push(...getEquipmentSuggestionsForActivity(formData.basicInfo.actividad));
    }

    const existingItems = new Set(
      formData.equipo.map((e: { item: string; categoria: string }) => `${e.item.toLowerCase()}-${e.categoria.toLowerCase()}`)
    );

    suggestions.forEach((item) => {
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

    const checklist = checklists.find((c) => c.key === selectedChecklist);
    if (!checklist) return;

    const allItems: ChecklistItem[] = [
      ...checklist.items.imprescindibles,
      ...checklist.items.aconsejables,
    ];

    allItems.forEach((item) => {
      const exists = formData.equipo.some(
        (e: { item: string; categoria: string }) =>
          e.item.toLowerCase() === item.item.toLowerCase() &&
          e.categoria.toLowerCase() === item.categoria.toLowerCase()
      );
      if (!exists) {
        addItem('equipo', {
          categoria: item.categoria,
          item: item.item,
          cantidad: item.cantidad.toString(),
          observaciones: `${item.observaciones} (Checklist: ${checklist.name})`,
          checked: false
        });
      }
    });

    setSelectedChecklist('');
  };

  // Remove from last index to first so indices don't shift
  const clearAllEquipment = () => {
    for (let i = formData.equipo.length - 1; i >= 0; i--) {
      removeItem('equipo', i);
    }
  };

  const availableChecklists = checklists.map((c) => ({ value: c.key, label: c.name }));

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
                {availableChecklists.map((checklist) => (
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
            {formData.transporte?.map((transport: import('@/types').Transport, index: number) => (
              <TransportForm
                key={index}
                transport={transport}
                index={index}
                onUpdate={updateTransport}
                onRemove={(idx) => removeItem('transporte', idx)}
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

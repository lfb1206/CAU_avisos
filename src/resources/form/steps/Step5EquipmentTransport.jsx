'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { activityEquipmentData, getEquipmentForActivity as getActivityEquipment, getEquipmentForSpecificActivity, getSpecificActivityEquipment } from '../../constants/activityEquipmentData';
import { getAvailableChecklists, applyChecklistToEquipment } from '../../constants/wikiexploraChecklists';
import { carbonEmissionFactors } from '../../constants/transportOptions';
import EquipmentTable from '../components/EquipmentTable';
import TransportForm from '../components/TransportForm';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [selectedChecklist, setSelectedChecklist] = useState('');

  // Debug: verificar que los factores estén cargados
  console.log('carbonEmissionFactors loaded:', carbonEmissionFactors);
  console.log('transportTypeFactors:', carbonEmissionFactors.transportTypeFactors);
  console.log('fuelFactors:', carbonEmissionFactors.fuelFactors);

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
      distancia: '',
      tipoCombustible: '',
      tipoAuto: '',
      anioVehiculo: '',
      capacidad: '',
      huellaCarbono: ''
    };
    addItem('transporte', newTransport);
  };

  const updateEquipment = (index, field, value) => {
    updateItem('equipo', index, { [field]: value });
  };

  const updateTransport = (index, field, value) => {
    updateItem('transporte', index, { [field]: value });
    
    // Calcular huella de carbono automáticamente cuando cambian los campos relevantes
    const relevantFields = ['distancia', 'tipo'];
    const transport = formData.transporte[index];
    const updatedTransport = { ...transport, [field]: value };
    
    if (relevantFields.includes(field)) {
      const huellaCarbono = calculateCarbonFootprint(updatedTransport);
      updateItem('transporte', index, { huellaCarbono });
    } else if (updatedTransport.tipo?.toLowerCase() === 'auto particular' && ['tipoCombustible', 'tipoAuto', 'anioVehiculo', 'capacidad'].includes(field)) {
      const huellaCarbono = calculateCarbonFootprint(updatedTransport);
      updateItem('transporte', index, { huellaCarbono });
    } else if (updatedTransport.tipo?.toLowerCase() === 'bus' && ['capacidad'].includes(field)) {
      const huellaCarbono = calculateCarbonFootprint(updatedTransport);
      updateItem('transporte', index, { huellaCarbono });
    }
  };

  // Función para calcular huella por persona
  const calculatePerPersonEmission = (totalEmission, capacity) => {
    if (!totalEmission || !capacity || capacity <= 1) {
      return null;
    }
    return (parseFloat(totalEmission) / parseInt(capacity)).toFixed(2);
  };

  // Función para calcular huella de carbono
  const calculateCarbonFootprint = (transport) => {
    console.log('calculateCarbonFootprint called with:', transport);
    
    if (!transport.distancia || !transport.tipo) {
      console.log('Missing distancia or tipo');
      return '';
    }

    const distancia = parseFloat(transport.distancia);
    if (isNaN(distancia) || distancia <= 0) {
      console.log('Invalid distancia:', transport.distancia);
      return '';
    }

    const tipoNormalizado = transport.tipo.toLowerCase();

    // Para auto particular, necesitamos combustible y tipo de auto
    if (tipoNormalizado === 'auto particular') {
      if (!transport.tipoCombustible) {
        console.log('Auto particular missing tipoCombustible');
        return '';
      }

      const fuelFactor = carbonEmissionFactors.fuelFactors[transport.tipoCombustible] || 0;
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
      
      let vehicleFactor = 0;
      if (transport.tipoAuto) {
        vehicleFactor = carbonEmissionFactors.vehicleFactors[transport.tipoAuto] || 0;
      }

      const efficiencyFactor = carbonEmissionFactors.getEfficiencyFactor(transport.anioVehiculo);
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      
      console.log('Auto particular factors:', {
        distancia,
        fuelFactor,
        transportFactor,
        vehicleFactor,
        efficiencyFactor,
        occupancyFactor
      });
      
      // Cálculo: distancia * (factor combustible + factor transporte + factor vehículo) * factor eficiencia * factor ocupación
      const baseEmission = distancia * (fuelFactor + transportFactor + vehicleFactor);
      const adjustedEmission = baseEmission * efficiencyFactor * occupancyFactor;
      
      console.log('Auto particular calculation:', { baseEmission, adjustedEmission });
      return adjustedEmission.toFixed(2);
    }

    // Para bus, solo necesitamos distancia
    if (tipoNormalizado === 'bus') {
      console.log('Processing bus calculation');
      console.log('Bus transport:', transport);
      console.log('Original tipo:', transport.tipo);
      console.log('Normalized tipo:', tipoNormalizado);
      console.log('Available factors:', Object.keys(carbonEmissionFactors.transportTypeFactors));
      
      const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
      const occupancyFactor = carbonEmissionFactors.getOccupancyFactor(transport.capacidad, tipoNormalizado);
      
      console.log('Bus factors:', {
        distancia,
        transportFactor,
        occupancyFactor,
        capacidad: transport.capacidad
      });
      
      const emission = distancia * transportFactor * occupancyFactor;
      
      console.log('Bus calculation:', { emission });
      return emission.toFixed(2);
    }

    // Para otros tipos de transporte, solo necesitamos el tipo
    const transportFactor = carbonEmissionFactors.transportTypeFactors[tipoNormalizado] || 0;
    const emission = distancia * transportFactor;
    
    console.log('Other transport calculation:', {
      tipo: transport.tipo,
      tipoNormalizado,
      distancia,
      transportFactor,
      emission,
      availableFactors: Object.keys(carbonEmissionFactors.transportTypeFactors)
    });
    
    return emission.toFixed(2);
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

  // Función mejorada para obtener equipo basado en actividad
  const getEquipmentForActivity = (actividad) => {
    if (!actividad) {
      return [];
    }
    
    const suggestions = [];
    
    // Primero intentar con actividades específicas
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
    
    // Si no hay equipo específico, buscar en actividades generales
    const generalEquipment = getActivityEquipment(actividad);
    
    if (generalEquipment && ((generalEquipment.basicEquipment && generalEquipment.basicEquipment.length > 0) || (Array.isArray(generalEquipment) && generalEquipment.length > 0))) {
      
      let equipmentItems = [];
      if (generalEquipment.basicEquipment) {
        equipmentItems = generalEquipment.basicEquipment;
      } else if (Array.isArray(generalEquipment)) {
        equipmentItems = generalEquipment;
      }
      
      equipmentItems.forEach(item => {
        suggestions.push({
          categoria: item.category,
          item: item.item,
          cantidad: 1,
          observaciones: `Esencial: ${item.essential ? 'Sí' : 'No'} (Sugerido por actividad general)`
        });
      });
      return suggestions;
    }
    
    return suggestions;
  };

  const loadActivityRecommendations = () => {
    // Analizar actividades del itinerario para sugerir equipo
    const suggestions = [];
    const processedActivities = new Set(); // Para evitar duplicados
    
    if (formData.itinerario && formData.itinerario.length > 0) {
      formData.itinerario.forEach((day, dayIndex) => {
        
        if (day.actividades && day.actividades.length > 0) {
          day.actividades.forEach(actividad => {
            if (!processedActivities.has(actividad)) {
              // Sugerir equipo basado en la actividad
              const activitySuggestions = getEquipmentForActivity(actividad);
              suggestions.push(...activitySuggestions);
              processedActivities.add(actividad);
            }
          });
        }
      });
    }
    
    // También considerar la actividad general SOLO si no hay actividades específicas
    if (formData.basicInfo && formData.basicInfo.actividad && !processedActivities.has(formData.basicInfo.actividad)) {
      const generalSuggestions = getEquipmentForActivity(formData.basicInfo.actividad);
      suggestions.push(...generalSuggestions);
    }
    
    // Agregar sugerencias sin duplicados
    let addedCount = 0;
    const existingItems = new Set(); // Para tracking de items existentes
    
    // Primero, registrar items existentes
    formData.equipo.forEach(equipment => {
      const key = `${equipment.item.toLowerCase()}-${equipment.categoria.toLowerCase()}`;
      existingItems.add(key);
    });
    
    suggestions.forEach(item => {
      const itemKey = `${item.item.toLowerCase()}-${item.categoria.toLowerCase()}`;
      
      if (!existingItems.has(itemKey)) {
        const newEquipment = {
          categoria: item.categoria,
          item: item.item,
          cantidad: item.cantidad.toString(),
          observaciones: item.observaciones,
          checked: false
        };
        addItem('equipo', newEquipment);
        existingItems.add(itemKey);
        addedCount++;
      }
    });
    
  };

  // Aplicar checklist de Wikiexplora
  const applyWikiexploraChecklist = () => {
    if (!selectedChecklist) return;
    
    const equipment = applyChecklistToEquipment(selectedChecklist, true); // Siempre incluir aconsejables
    
    // Agregar equipo del checklist sin duplicados
    equipment.forEach(item => {
      // Verificar si ya existe un equipo con el mismo item y categoría
      const existingItem = formData.equipo.find(equipment => 
        equipment.item.toLowerCase() === item.item.toLowerCase() && 
        equipment.categoria.toLowerCase() === item.categoria.toLowerCase()
      );
      
      if (!existingItem) {
        const newEquipment = {
          categoria: item.categoria,
          item: item.item,
          cantidad: item.cantidad.toString(),
          observaciones: item.observaciones,
          checked: false
        };
        addItem('equipo', newEquipment);
      }
    });
    
    setSelectedChecklist('');
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

      {/* Equipment Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Equipo Portado
          </h3>
          
          {/* Controles - Mejorados para móvil */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 sm:items-center">
            {/* Dropdown de checklists */}
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

            {/* Botón único para cargar recomendaciones */}
            <button
              type="button"
              onClick={() => {
                // Siempre cargar recomendaciones de actividades
                loadActivityRecommendations();
                // Luego aplicar checklist si está seleccionado
                if (selectedChecklist) {
                  applyWikiexploraChecklist();
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-colors text-sm w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Cargar recomendaciones
            </button>

            {/* Botón para limpiar todo el equipo */}
            {formData.equipo.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  formData.equipo.forEach((_, index) => {
                    removeItem('equipo', 0);
                  });
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar todo
              </button>
            )}
          </div>

          {/* Equipment Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              ℹ️ Importante - Checklist de Equipo
            </h4>
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>Solo el equipo marcado como "Se está portando" aparecerá en el aviso de salida.</strong> 
              Use los checkboxes para indicar qué equipo realmente se lleva en la expedición. 
              El equipo no marcado no se incluirá en el documento final.
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

        {/* Transport Section */}
        <div className="space-y-6 mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Transporte
            </h3>
          </div>

          <div className="space-y-4">
            {formData.transporte && formData.transporte.map((transport, index) => (
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

        {/* Instructions */}
        <div className="mt-8 bg-purple-50 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-semibold text-purple-900 mb-3">
            🎒 Consejos para registrar equipo y transporte:
          </h4>
          <ul className="list-disc pl-5 text-purple-900 text-xs sm:text-sm space-y-1">
            <li><strong>Checklists:</strong> Seleccione un checklist específico para agregar equipo recomendado según el tipo de ruta (incluye imprescindibles y aconsejables).</li>
            <li><strong>Cargar recomendaciones:</strong> Use el botón azul para agregar equipo basado en las actividades de los tramos y la actividad general.</li>
            <li><strong>Sin duplicados:</strong> Los checklists y recomendaciones se agregan sin sobrescribir el equipo existente.</li>
            <li><strong>Organización:</strong> El equipo se agrupa automáticamente por categorías con acordeones.</li>
            <li><strong>Limpiar todo:</strong> Use el botón rojo para eliminar todo el equipo y empezar de nuevo.</li>
            <li>Agrega cada ítem de equipo con su categoría, nombre y cantidad.</li>
            <li>Utiliza el campo <b>Observaciones</b> para anotar detalles relevantes.</li>
            <li>Solo los ítems marcados como <b>Se está portando</b> aparecerán en el aviso de salida.</li>
            <li>En transporte, registra cada vehículo y conductor relevante.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
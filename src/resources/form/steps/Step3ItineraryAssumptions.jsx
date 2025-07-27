'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { difficultyRecommendations } from '../../constants/savedData';
import ItineraryDayForm from '../components/ItineraryDayForm';

export default function Step3ItineraryAssumptions() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  // Excel logic for risk assessment
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
      dificultadesPrincipales: [''],
      supuestos: []
    };
    addItem('itinerario', newDay);
  };

  const updateDay = (dayIndex, field, value) => {
    const updatedDay = { ...formData.itinerario[dayIndex], [field]: value };
    updateItem('itinerario', dayIndex, updatedDay);
  };

  const removeDay = (dayIndex) => {
    removeItem('itinerario', dayIndex);
  };

  // Suggest assumptions based on selected difficulties
  const getSuggestedAssumptions = (selectedDifficulties) => {
    const suggestions = [];
    const validDifficulties = selectedDifficulties.filter(d => d && d.trim());
    
    validDifficulties.forEach(difficulty => {
      if (difficultyRecommendations[difficulty]) {
        difficultyRecommendations[difficulty].forEach(recommendation => {
          suggestions.push({
            ...recommendation,
            incluir: false
          });
        });
      }
    });
    
    return suggestions;
  };

  const addAssumption = (itineraryIndex) => {
    const newAssumption = {
      supuesto: '',
      tipoSupuesto: '',
      probabilidad: '',
      impacto: '',
      accion: '',
      incluir: false
    };
    
    const updatedItinerary = [...formData.itinerario];
    updatedItinerary[itineraryIndex].supuestos.push(newAssumption);
    updateItem('itinerario', itineraryIndex, updatedItinerary[itineraryIndex]);
  };

  const addSuggestedAssumptions = (itineraryIndex) => {
    const day = formData.itinerario[itineraryIndex];
    
    const suggestions = getSuggestedAssumptions(day.dificultadesPrincipales || []);
    
    if (suggestions.length === 0) {
      return;
    }
    
    const updatedItinerary = [...formData.itinerario];
    const existingSupuestos = day.supuestos || [];
    
    // Solo agregar supuestos que no existan ya
    suggestions.forEach(suggestion => {
      const alreadyExists = existingSupuestos.some(existing => 
        existing.supuesto === suggestion.supuesto && 
        existing.tipoSupuesto === suggestion.tipoSupuesto
      );
      
      if (!alreadyExists) {
        suggestion.accion = calculateRiskAction(suggestion.probabilidad, suggestion.impacto);
        updatedItinerary[itineraryIndex].supuestos.push(suggestion);
      }
    });
    
    updateItem('itinerario', itineraryIndex, updatedItinerary[itineraryIndex]);
  };

  const addDifficulty = (itineraryIndex) => {
    const day = formData.itinerario[itineraryIndex];
    const currentDifficulties = day.dificultadesPrincipales || [];
    const updatedDifficulties = [...currentDifficulties, ''];
    updateDay(itineraryIndex, 'dificultadesPrincipales', updatedDifficulties);
  };

  const removeDifficulty = (itineraryIndex, difficultyIndex) => {
    const day = formData.itinerario[itineraryIndex];
    const currentDifficulties = day.dificultadesPrincipales || [];
    const updatedDifficulties = currentDifficulties.filter((_, index) => index !== difficultyIndex);
    updateDay(itineraryIndex, 'dificultadesPrincipales', updatedDifficulties);
  };

  const updateDifficulty = (itineraryIndex, difficultyIndex, value) => {
    const day = formData.itinerario[itineraryIndex];
    const currentDifficulties = day.dificultadesPrincipales || [];
    const updatedDifficulties = [...currentDifficulties];
    updatedDifficulties[difficultyIndex] = value;
    updateDay(itineraryIndex, 'dificultadesPrincipales', updatedDifficulties);
  };

  const updateAssumption = (itineraryIndex, assumptionIndex, field, value) => {
    const updatedItinerary = [...formData.itinerario];
    const assumption = updatedItinerary[itineraryIndex].supuestos[assumptionIndex];
    assumption[field] = value;
    
    // Auto-calculate action if probability or impact changed
    if (field === 'probabilidad' || field === 'impacto') {
      assumption.accion = calculateRiskAction(assumption.probabilidad, assumption.impacto);
    }
    
    updateItem('itinerario', itineraryIndex, updatedItinerary[itineraryIndex]);
  };

  const removeAssumption = (itineraryIndex, assumptionIndex) => {
    const updatedItinerary = [...formData.itinerario];
    updatedItinerary[itineraryIndex].supuestos.splice(assumptionIndex, 1);
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
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
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
          <ItineraryDayForm
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            onUpdate={updateDay}
            onRemove={removeDay}
            onAddAssumption={addAssumption}
            onRemoveAssumption={removeAssumption}
            onUpdateAssumption={updateAssumption}
            onAddDifficulty={addDifficulty}
            onRemoveDifficulty={removeDifficulty}
            onUpdateDifficulty={updateDifficulty}
            onAddSuggestedAssumptions={addSuggestedAssumptions}
            getActionColor={getActionColor}
            getActionLabel={getActionLabel}
            fechaReporteRegreso={formData.basicInfo.fechaHoraReporteRegreso}
          />
        ))}
      </div>

      {/* Add Day Button */}
      <button
        type="button"
        onClick={addItineraryDay}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Agregar Tramo
      </button>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-900 mb-3">
          🗺️ Consejos para planificar su itinerario:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-800">
          <div>
            <p className="font-medium mb-1">Información del tramo:</p>
            <ul className="space-y-1 ml-2">
              <li>• Defina cada tramo de su ruta</li>
              <li>• Especifique fechas y horarios estimados</li>
              <li>• Describa la actividad principal de cada tramo</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Identificar dificultades:</p>
            <ul className="space-y-1 ml-2">
              <li>• Seleccione las principales dificultades del tramo</li>
              <li>• Use el botón "Sugerir Supuestos" para obtener recomendaciones</li>
              <li>• Puede agregar múltiples dificultades por tramo</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Gestión de supuestos:</p>
            <ul className="space-y-1 ml-2">
              <li>• Revise los supuestos sugeridos automáticamente</li>
              <li>• Marque solo los supuestos relevantes para incluir</li>
              <li>• Ajuste probabilidad e impacto según su criterio</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Recordatorio importante:</p>
            <ul className="space-y-1 ml-2">
              <li>• Complete el itinerario detallado de su expedición</li>
              <li>• Solo los supuestos marcados aparecen en el aviso</li>
              <li>• Identifique las dificultades principales de cada tramo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
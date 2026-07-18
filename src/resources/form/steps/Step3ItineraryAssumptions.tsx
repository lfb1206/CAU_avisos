'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import ItineraryDayForm from '../components/ItineraryDayForm';

export default function Step3ItineraryAssumptions() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [basicOptions, setBasicOptions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch('/api/basicOptions')
      .then((r) => r.json())
      .then((basicData) => {
        setBasicOptions(basicData?.options ?? {});
      })
      .catch(() => {});
  }, []);

  const addItineraryDay = () => {
    addItem('itinerario', {
      tramo: '', fecha: '', horaInicio: '', horaFin: '',
      altitudInicio: '', altitudFin: '', actividades: [],
    });
  };

  const updateDay = (dayIndex: number, field: string, value: unknown) => {
    const updatedDay = { ...formData.itinerario[dayIndex], [field]: value };
    updateItem('itinerario', dayIndex, updatedDay);
  };

  const removeDay = (dayIndex: number) => {
    removeItem('itinerario', dayIndex);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Itinerario
        </h2>
        <p className="text-gray-600">
          Defina el itinerario detallado de la salida
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
            tramos={basicOptions.tramo ?? []}
            actividadesEspecificas={basicOptions.actividad ?? []}
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
          Consejos para planificar su itinerario:
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
            <p className="font-medium mb-1">Recordatorio importante:</p>
            <ul className="space-y-1 ml-2">
              <li>• Complete el itinerario detallado de su expedición</li>
              <li>• Incluya las altitudes para cada tramo cuando corresponda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step4RiskManagement() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  const addRisk = () => {
    const newRisk = {
      supuesto: '',
      riesgo: '',
      peligro: '',
      lugar: '',
      accionProbabilidad: '',
      accionExposicion: '',
      accionConsecuencias: ''
    };
    addItem('riesgos', newRisk);
  };

  const updateRisk = (index, field, value) => {
    updateItem('riesgos', index, { [field]: value });
  };

  // Get risks that need management from Step 3
  const getRisksToManage = () => {
    const risksToManage = [];
    formData.itinerario.forEach((day, dayIndex) => {
      day.supuestos.forEach((assumption, assumptionIndex) => {
        if (assumption.accion === 'gestionar') {
          risksToManage.push({
            supuesto: assumption.supuesto,
            tramo: day.tramo,
            dia: day.dia,
            riesgo: '',
            peligro: '',
            lugar: '',
            accionProbabilidad: '',
            accionExposicion: '',
            accionConsecuencias: ''
          });
        }
      });
    });
    return risksToManage;
  };

  // Auto-populate risks from Step 3
  React.useEffect(() => {
    const risksToManage = getRisksToManage();
    if (risksToManage.length > 0 && formData.riesgos.length === 0) {
      risksToManage.forEach(risk => {
        addItem('riesgos', risk);
      });
    }
  }, [formData.itinerario]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Riesgos
        </h2>
        <p className="text-gray-600">
          Identifique riesgos, causas subyacentes y establezca acciones de gestión
        </p>
      </div>

      {/* Risk Management List */}
      <div className="space-y-6">
        {formData.riesgos.map((risk, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Riesgo {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeItem('riesgos', index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Assumption */}
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Supuesto Original
                </label>
                <input
                  type="text"
                  value={risk.supuesto}
                  onChange={(e) => updateRisk(index, 'supuesto', e.target.value)}
                  placeholder="Ej: Se logra cruzar el glaciar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  readOnly
                />
              </div>

              <AutocompleteInput
                label="Riesgo específico"
                value={risk.riesgo}
                onChange={(value) => updateRisk(index, 'riesgo', value)}
                options={formOptions.riesgos}
                placeholder="Seleccione o escriba el riesgo específico"
                required
              />

              <AutocompleteInput
                label="Peligro o causa subyacente"
                value={risk.peligro}
                onChange={(value) => updateRisk(index, 'peligro', value)}
                options={formOptions.peligros}
                placeholder="Seleccione o escriba el peligro"
                required
              />

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Lugar o coordenadas (WGS 84)
                </label>
                <input
                  type="text"
                  value={risk.lugar}
                  onChange={(e) => updateRisk(index, 'lugar', e.target.value)}
                  placeholder="Ej: Glaciar, Coordenadas específicas, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Risk Management Actions */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">
                  Acciones de Gestión de Riesgos
                </h4>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  ¿Cómo hago más probable que mi supuesto se cumpla? (Probabilidad)
                </label>
                <textarea
                  value={risk.accionProbabilidad}
                  onChange={(e) => updateRisk(index, 'accionProbabilidad', e.target.value)}
                  placeholder="Ej: Salgo temprano, voy en invierno, pronóstico de temperaturas bajas, selecciono itinerario..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  ¿Cómo disminuyo el impacto si el supuesto no se cumple? (Exposición)
                </label>
                <textarea
                  value={risk.accionExposicion}
                  onChange={(e) => updateRisk(index, 'accionExposicion', e.target.value)}
                  placeholder="Ej: Trazo ruta alternativa, llevo equipo de emergencia..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  ¿Qué hago para mitigar los efectos de los riesgos derivados de que no se cumpla el supuesto? (Consecuencias)
                </label>
                <textarea
                  value={risk.accionConsecuencias}
                  onChange={(e) => updateRisk(index, 'accionConsecuencias', e.target.value)}
                  placeholder="Ej: Voy encordado, uso casco, piolet, conocimiento, entrenamiento..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Risk Button */}
        <button
          type="button"
          onClick={addRisk}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Agregar Riesgo
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los riesgos marcados como "Gestionar" del paso anterior se cargan automáticamente</li>
          <li>• Identifique el riesgo específico y su causa subyacente</li>
          <li>• Especifique el lugar donde puede ocurrir el riesgo</li>
          <li>• Defina acciones para aumentar la probabilidad de éxito</li>
          <li>• Establezca medidas para reducir el impacto si falla</li>
          <li>• Describa acciones para mitigar las consecuencias</li>
          <li>• Use las opciones sugeridas o escriba su propio texto</li>
        </ul>
      </div>
    </div>
  );
} 
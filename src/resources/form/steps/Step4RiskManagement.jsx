'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import AutocompleteInput from '../components/AutocompleteInput';
import { useRef } from 'react';

export default function Step4RiskManagement() {
  const { formData, updateItem } = useFormContext();
  const [expandedSupuesto, setExpandedSupuesto] = React.useState(null);
  const [expandedCausa, setExpandedCausa] = React.useState({});
  const supRefs = useRef([]);

  // Obtener supuestos a gestionar del itinerario
  const supuestosGestionar = [];
  formData.itinerario.forEach((day, dayIndex) => {
    (day.supuestos || []).forEach((assumption, assumptionIndex) => {
      if (assumption.accion === 'gestionar') {
        supuestosGestionar.push({
          key: `${dayIndex}-${assumptionIndex}`,
          tramo: day.tramo,
          supuesto: assumption.supuesto,
          indexItinerario: dayIndex,
          indexSupuesto: assumptionIndex,
          causas: assumption.causas || []
        });
      }
    });
  });

  // Agregar causa/peligro a un supuesto
  const addCausa = (supKey) => {
    const [dayIndex, assumptionIndex] = supKey.split('-').map(Number);
    const updatedItinerario = [...formData.itinerario];
    const sup = updatedItinerario[dayIndex].supuestos[assumptionIndex];
    if (!sup.causas) sup.causas = [];
    sup.causas.push({
      peligro: '',
      riesgo: '',
      lugar: '',
      accionProbabilidad: '',
      accionExposicion: '',
      accionConsecuencias: ''
    });
    updateItem('itinerario', dayIndex, updatedItinerario[dayIndex]);
    setTimeout(() => {
      const el = document.querySelector(`[data-causa-item="${supKey}-${sup.causas.length - 1}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Actualizar causa/peligro
  const updateCausa = (supKey, causaIndex, field, value) => {
    const [dayIndex, assumptionIndex] = supKey.split('-').map(Number);
    const updatedItinerario = [...formData.itinerario];
    const sup = updatedItinerario[dayIndex].supuestos[assumptionIndex];
    if (!sup.causas) sup.causas = [];
    sup.causas[causaIndex][field] = value;
    updateItem('itinerario', dayIndex, updatedItinerario[dayIndex]);
  };

  // Eliminar causa/peligro
  const removeCausa = (supKey, causaIndex) => {
    const [dayIndex, assumptionIndex] = supKey.split('-').map(Number);
    const updatedItinerario = [...formData.itinerario];
    const sup = updatedItinerario[dayIndex].supuestos[assumptionIndex];
    if (!sup.causas) sup.causas = [];
    sup.causas.splice(causaIndex, 1);
    updateItem('itinerario', dayIndex, updatedItinerario[dayIndex]);
  };

  // Eliminar supuesto completo
  const removeSupuesto = (supKey) => {
    const [dayIndex, assumptionIndex] = supKey.split('-').map(Number);
    const updatedItinerario = [...formData.itinerario];
    updatedItinerario[dayIndex].supuestos.splice(assumptionIndex, 1);
    updateItem('itinerario', dayIndex, updatedItinerario[dayIndex]);
  };

  // UI
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Riesgos</h2>
        <p className="text-gray-600">Para cada supuesto crítico, agregue y gestione las causas/peligros relevantes.</p>
      </div>
      <div className="space-y-4">
        {supuestosGestionar.length === 0 && (
          <div className="text-gray-500 italic">No hay supuestos críticos para gestionar.</div>
        )}
        {supuestosGestionar.map((sup, supIndex) => (
          <details key={sup.key} className="border border-blue-200 rounded-lg bg-blue-50 mb-4">
            <summary className="flex items-center gap-4 px-4 py-2 text-blue-900 font-semibold cursor-pointer">
              <span>{sup.supuesto}</span>
            </summary>
            <div className="p-4">
              <div className="space-y-4">
                {(sup.causas || []).map((causa, causaIdx) => (
                  <div key={causaIdx} data-causa-item={`${sup.key}-${causaIdx}`} className="border border-gray-200 rounded bg-yellow-50 mb-2 p-4">
                    <div className="space-y-4">
                      <AutocompleteInput
                        label="Peligro o causa subyacente"
                        value={causa.peligro}
                        onChange={v => updateCausa(sup.key, causaIdx, 'peligro', v)}
                        options={formOptions.peligros}
                        placeholder="Seleccione o escriba el peligro"
                        required
                      />
                      <AutocompleteInput
                        label="Riesgo asociado"
                        value={causa.riesgo}
                        onChange={v => updateCausa(sup.key, causaIdx, 'riesgo', v)}
                        options={formOptions.riesgos}
                        placeholder="Describa el riesgo"
                        required
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={causa.lugar}
                        onChange={e => updateCausa(sup.key, causaIdx, 'lugar', e.target.value)}
                        placeholder="Lugar o coordenadas (opcional)"
                      />
                      {/* Acciones de gestión con tooltips */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Probabilidad
                            <span className="relative group">
                              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">¿Qué acciones aumentan la probabilidad de éxito?</span>
                            </span>
                          </label>
                          <textarea
                            value={causa.accionProbabilidad}
                            onChange={e => updateCausa(sup.key, causaIdx, 'accionProbabilidad', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Exposición
                            <span className="relative group">
                              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">¿Qué acciones reducen la exposición al peligro?</span>
                            </span>
                          </label>
                          <textarea
                            value={causa.accionExposicion}
                            onChange={e => updateCausa(sup.key, causaIdx, 'accionExposicion', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Consecuencias
                            <span className="relative group">
                              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">¿Qué acciones mitigan las consecuencias si ocurre el riesgo?</span>
                            </span>
                          </label>
                          <textarea
                            value={causa.accionConsecuencias}
                            onChange={e => updateCausa(sup.key, causaIdx, 'accionConsecuencias', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      {/* Si hay Acción Requerida aquí, dale un margen superior */}
                      {causa.accionRequerida && (
                        <div className="mt-2">
                          {/* Acción Requerida */}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{causa.riesgo ? 'Riesgo: ' + causa.riesgo : ''}</span>
                      <button
                        type="button"
                        onClick={() => removeCausa(sup.key, causaIdx)}
                        className="text-red-600 text-xs font-semibold hover:underline hover:font-bold"
                      >
                        Eliminar peligro
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => addCausa(sup.key)} className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  + Agregar causa/peligro
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
} 
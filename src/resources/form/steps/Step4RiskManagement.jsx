'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { riskManagementOptions } from '../../constants/riskManagementOptions';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step4RiskManagement() {
  const { formData, updateItem } = useFormContext();

  // Obtener supuestos a gestionar del itinerario
  const supuestosGestionar = [];
  formData.itinerario.forEach((day, dayIndex) => {
    (day.supuestos || []).forEach((assumption, assumptionIndex) => {
      // Incluir supuestos que tengan accion === 'gestionar' O 'monitoreo_intenso' Y incluir === true
      if ((assumption.accion === 'gestionar' || assumption.accion === 'monitoreo_intenso') && assumption.incluir === true) {
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
          <div className="text-center py-8">
            <div className="text-gray-500 italic mb-2">
              No hay supuestos críticos para gestionar.
            </div>
            <div className="text-sm text-gray-400">
              Los supuestos aparecerán aquí solo si:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Su acción requerida es "Gestionar" o "Monitoreo Intenso"</li>
                <li>Están marcados como "Incluir en aviso"</li>
              </ul>
            </div>
          </div>
        )}
        {supuestosGestionar.map((sup, supIndex) => (
          <details key={sup.key} className="border border-blue-200 rounded-lg bg-blue-50 mb-4">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-blue-900">{sup.tramo}</span>
                <span className="text-blue-700">-</span>
                <span className="text-blue-800">{sup.supuesto}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSupuesto(sup.key);
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Eliminar supuesto
              </button>
            </summary>
            <div className="p-4 border-t border-blue-200">
              <div className="space-y-4">
                {sup.causas.map((causa, causaIndex) => (
                  <div key={causaIndex} className="border border-gray-200 rounded bg-yellow-50 mb-2 p-4" data-causa-item={`${sup.key}-${causaIndex}`}>
                    <div className="space-y-4">
                      {/* 1. Ubicación */}
                      <div className="border-b border-gray-200 pb-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Ubicación</h4>
                        <div>
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            Lugar o coordenadas (WGS 84)
                            <span className="relative group">
                              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                ¿Dónde específicamente puede ocurrir este riesgo?<br/>
                                <span className="text-gray-300">Ej: Coordenadas GPS, nombre del sector, punto específico del recorrido</span>
                              </span>
                            </span>
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={causa.lugar}
                            onChange={e => updateCausa(sup.key, causaIndex, 'lugar', e.target.value)}
                            placeholder="Ej: -33.4489, -70.6693 o 'Sector Laguna Negra'"
                          />
                        </div>
                      </div>

                      {/* 2. Prevención Primaria */}
                      <div className="border-b border-gray-200 pb-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Prevención Primaria</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                              Probabilidad
                              <span className="relative group">
                                <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                  ¿Qué acciones aumentan la probabilidad de que el supuesto se cumpla?<br/>
                                  <span className="text-gray-300">Ej: Verificar condiciones climáticas, entrenar técnicas específicas, revisar equipamiento</span>
                                </span>
                              </span>
                            </label>
                            <textarea
                              value={causa.accionProbabilidad}
                              onChange={e => updateCausa(sup.key, causaIndex, 'accionProbabilidad', e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                              placeholder="¿Qué acciones aumentan la probabilidad de que el supuesto se cumpla?"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                              Exposición
                              <span className="relative group">
                                <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                  ¿Cómo disminuyo el impacto si el supuesto no se cumple?<br/>
                                  <span className="text-gray-300">Ej: Usar equipos de seguridad, establecer puntos de retorno, tener planes alternativos</span>
                                </span>
                              </span>
                            </label>
                            <textarea
                              value={causa.accionExposicion}
                              onChange={e => updateCausa(sup.key, causaIndex, 'accionExposicion', e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                              placeholder="¿Qué acciones reducen la exposición al peligro?"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Identificación del Problema */}
                      <div className="border-b border-gray-200 pb-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Identificación del Problema</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                              Peligro o causa subyacente
                              <span className="relative group">
                                <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                  ¿Qué puede salir mal? Identifique la causa raíz del problema<br/>
                                  <span className="text-gray-300">Ej: Condiciones climáticas adversas, falla de equipamiento, lesión de participante</span>
                                </span>
                              </span>
                            </label>
                            <AutocompleteInput
                              value={causa.peligro}
                              onChange={v => updateCausa(sup.key, causaIndex, 'peligro', v)}
                              options={riskManagementOptions.peligros}
                              placeholder="Seleccione o escriba el peligro"
                              required
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                              Riesgo asociado
                              <span className="relative group">
                                <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                  ¿Qué consecuencias puede tener si no se cumple el supuesto?<br/>
                                  <span className="text-gray-300">Ej: Pérdida de orientación, hipotermia, caída en terreno expuesto</span>
                                </span>
                              </span>
                            </label>
                            <AutocompleteInput
                              value={causa.riesgo}
                              onChange={v => updateCausa(sup.key, causaIndex, 'riesgo', v)}
                              options={riskManagementOptions.riesgos}
                              placeholder="Describa el riesgo"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Mitigación */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Mitigación</h4>
                        <div>
                          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Consecuencias
                            <span className="relative group">
                              <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs cursor-help">i</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                ¿Qué hago para mitigar los efectos de los riesgos?<br/>
                                <span className="text-gray-300">Ej: Llevar equipos de rescate, establecer comunicación de emergencia, entrenar primeros auxilios</span>
                              </span>
                            </span>
                          </label>
                          <textarea
                            value={causa.accionConsecuencias}
                            onChange={e => updateCausa(sup.key, causaIndex, 'accionConsecuencias', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="¿Qué acciones mitigan las consecuencias si ocurre el riesgo?"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{causa.riesgo ? 'Riesgo: ' + causa.riesgo : ''}</span>
                      <button
                        type="button"
                        onClick={() => removeCausa(sup.key, causaIndex)}
                        className="text-red-600 text-xs font-semibold hover:underline hover:font-bold"
                      >
                        Eliminar peligro
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addCausa(sup.key)}
                  className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
                >
                  + Agregar Causa/Peligro
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Instrucciones al final */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Instrucciones para la Gestión de Riesgos
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>¿Qué es la Gestión de Riesgos?</strong> Es el proceso de identificar, evaluar y controlar los peligros 
            que pueden afectar la seguridad de la expedición.
          </p>
          <p>
            <strong>¿Qué supuestos aparecen aquí?</strong> Solo los supuestos marcados como "Gestionar" o "Monitoreo Intenso" 
            y que estén incluidos en el aviso de salida.
          </p>
          <p>
            <strong>¿Cómo gestionar cada supuesto?</strong> Para cada supuesto crítico, debe:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Identificar el peligro:</strong> ¿Qué puede salir mal?</li>
            <li><strong>Evaluar el riesgo:</strong> ¿Qué tan probable es que ocurra?</li>
            <li><strong>Definir el lugar:</strong> ¿Dónde puede ocurrir?</li>
            <li><strong>Establecer acciones:</strong> ¿Qué medidas tomar para reducir probabilidad, exposición y consecuencias?</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            <strong>Tip:</strong> Cuanto más específicas sean sus acciones, más efectiva será la gestión del riesgo.
          </p>
        </div>
      </div>
    </div>
  );
} 
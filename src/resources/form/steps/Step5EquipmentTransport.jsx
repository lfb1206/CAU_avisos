'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import { savedData } from '../../constants/savedData';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [expandedEquipo, setExpandedEquipo] = React.useState(formData.equipo.length - 1);

  const addEquipment = () => {
    const newEquipment = {
      categoria: '',
      item: '',
      cantidad: '1',
      observaciones: '',
      checked: true
    };
    addItem('equipo', newEquipment);
    
    // Scroll to the new equipment item
    setTimeout(() => {
      setExpandedEquipo(formData.equipo.length); // expandir el nuevo
      const equipmentElements = document.querySelectorAll('[data-equipment-item]');
      const lastElement = equipmentElements[equipmentElements.length - 1];
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
        removeItem('equipo', 0); // Remove first item until all are gone
      });
      
      // Handle both array format and object format
      if (Array.isArray(recommendations)) {
        // Direct array format (new format)
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
        // Object format with equipment property (old format)
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
    <div className="space-y-8">
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
          <button
            type="button"
            onClick={addRecommendedEquipment}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-semibold shadow hover:bg-yellow-500 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Cargar recomendaciones
          </button>
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
            <details
              key={index}
              data-equipment-item
              open={expandedEquipo === index}
              onToggle={e => setExpandedEquipo(e.target.open ? index : null)}
              className={`border border-gray-200 rounded-lg p-0 transition-colors ${equipment.checked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
            >
              <summary className="flex items-center gap-2 cursor-pointer px-6 py-3 text-gray-900 font-semibold">
                <span>{equipment.categoria || 'Sin categoría'}</span>
                <span className="mx-2">/</span>
                <span>{equipment.item || 'Sin item'}</span>
                <button
                  type="button"
                  onClick={() => updateEquipment(index, 'checked', !equipment.checked)}
                  className={`ml-2 flex items-center px-2 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${equipment.checked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  aria-pressed={equipment.checked}
                >
                  {equipment.checked ? 'Se está portando' : 'No se porta'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem('equipo', index);
                  }}
                  className="ml-auto text-red-600 text-xs font-semibold hover:underline hover:font-bold"
                >
                  Eliminar equipo
                </button>
              </summary>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AutocompleteInput
                    label="Categoría *"
                    value={equipment.categoria}
                    onChange={(value) => updateEquipment(index, 'categoria', value)}
                    options={formOptions.equipmentCategories.map(option => option.label)}
                    placeholder="Seleccione o escriba la categoría"
                    required
                  />

                  <AutocompleteInput
                    label="Item *"
                    value={equipment.item}
                    onChange={(value) => updateEquipment(index, 'item', value)}
                    options={equipment.categoria ? (formOptions.equipmentItems[equipment.categoria] || []) : []}
                    placeholder="Seleccione o escriba el item"
                    required
                  />

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      value={equipment.cantidad}
                      onChange={(e) => updateEquipment(index, 'cantidad', e.target.value)}
                      placeholder="1"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {equipment.cantidad && (isNaN(equipment.cantidad) || parseInt(equipment.cantidad) < 1) && (
                      <p className="text-red-500 text-xs mt-1">
                        La cantidad debe ser un número mayor a 0
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Observaciones
                    </label>
                    <input
                      type="text"
                      value={equipment.observaciones || ''}
                      onChange={(e) => updateEquipment(index, 'observaciones', e.target.value)}
                      placeholder="Observaciones adicionales"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </details>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={addEquipment}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Agregar equipo
            </button>
          </div>
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
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Transporte {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeItem('transporte', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AutocompleteInput
                  label="Tipo *"
                  value={transport.tipo}
                  onChange={(value) => updateTransport(index, 'tipo', value)}
                  options={formOptions.transportTypes.map(t => t.label)}
                  placeholder="Seleccione o escriba el tipo de transporte"
                  required
                />

                <AutocompleteInput
                  label="Conductor *"
                  value={transport.conductor}
                  onChange={(value) => updateTransport(index, 'conductor', value)}
                  options={getConductorOptions()}
                  placeholder="Seleccione o escriba el conductor"
                />

                <AutocompleteInput
                  label="Marca"
                  value={transport.marca}
                  onChange={(value) => updateTransport(index, 'marca', value)}
                  options={formOptions.vehicleBrands}
                  placeholder="Seleccione o escriba la marca"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={transport.modelo}
                    onChange={(e) => updateTransport(index, 'modelo', e.target.value)}
                    placeholder="Modelo del vehículo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <input
                    type="text"
                    value={transport.color}
                    onChange={(e) => updateTransport(index, 'color', e.target.value)}
                    placeholder="Color del vehículo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Patente
                  </label>
                  <input
                    type="text"
                    value={transport.patente}
                    onChange={(e) => updateTransport(index, 'patente', e.target.value)}
                    placeholder="Patente del vehículo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Distancia (km)
                  </label>
                  <input
                    type="number"
                    value={transport.distancia}
                    onChange={(e) => updateTransport(index, 'distancia', e.target.value)}
                    placeholder="Distancia total ida y vuelta"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={addTransport}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Agregar transporte
            </button>
          </div>
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
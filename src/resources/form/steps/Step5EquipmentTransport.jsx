'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { activityEquipmentData } from '../../constants/activityEquipmentData';
import { getAvailableChecklists, applyChecklistToEquipment } from '../../constants/wikiexploraChecklists';
import EquipmentTable from '../components/EquipmentTable';
import TransportForm from '../components/TransportForm';

export default function Step5EquipmentTransport() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();
  const [selectedChecklist, setSelectedChecklist] = useState('');

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

  // Función auxiliar para obtener equipo basado en actividad
  const getEquipmentForActivity = (actividad) => {
    const suggestions = [];
    
    // Mapeo básico de actividades a equipo
    const activityEquipmentMap = {
      'escalada': [
        { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Obligatorio para escalada' },
        { categoria: 'Seguridad', item: 'Arnés', cantidad: 1, observaciones: 'Obligatorio para escalada' },
        { categoria: 'Seguridad', item: 'Cuerda', cantidad: 1, observaciones: 'Cuerda de escalada' },
        { categoria: 'Seguridad', item: 'Mosquetones', cantidad: 6, observaciones: 'Para asegurar' }
      ],
      'trekking': [
        { categoria: 'Calzado', item: 'Botas de trekking', cantidad: 1, observaciones: 'Impermeables y cómodas' },
        { categoria: 'Ropa', item: 'Polera técnica', cantidad: 2, observaciones: 'Material transpirable' },
        { categoria: 'Ropa', item: 'Pantalón de trekking', cantidad: 1, observaciones: 'Impermeable' },
        { categoria: 'Protección', item: 'Protector solar', cantidad: 1, observaciones: 'SPF 50+' }
      ],
      'montañismo': [
        { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Para montañismo' },
        { categoria: 'Seguridad', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en hielo' },
        { categoria: 'Calzado', item: 'Botas de montaña', cantidad: 1, observaciones: 'Impermeables y rígidas' },
        { categoria: 'Protección', item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' }
      ],
      'campamento': [
        { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
        { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Según temperatura' },
        { categoria: 'Campamento', item: 'Colchoneta', cantidad: 1, observaciones: 'Aislamiento térmico' },
        { categoria: 'Campamento', item: 'Cocina de campamento', cantidad: 1, observaciones: 'Para cocinar' }
      ],
      'senderismo': [
        { categoria: 'Calzado', item: 'Botas de senderismo', cantidad: 1, observaciones: 'Cómodas y resistentes' },
        { categoria: 'Ropa', item: 'Polera técnica', cantidad: 2, observaciones: 'Material transpirable' },
        { categoria: 'Protección', item: 'Protector solar', cantidad: 1, observaciones: 'SPF 50+' },
        { categoria: 'Protección', item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' }
      ],
      'ascenso': [
        { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Para ascenso' },
        { categoria: 'Calzado', item: 'Botas de montaña', cantidad: 1, observaciones: 'Impermeables y rígidas' },
        { categoria: 'Protección', item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' },
        { categoria: 'Seguridad', item: 'Piolet', cantidad: 1, observaciones: 'Para progresión en hielo' }
      ],
      'descenso': [
        { categoria: 'Seguridad', item: 'Casco', cantidad: 1, observaciones: 'Para descenso' },
        { categoria: 'Calzado', item: 'Botas de montaña', cantidad: 1, observaciones: 'Impermeables y rígidas' },
        { categoria: 'Protección', item: 'Gafas de sol', cantidad: 1, observaciones: 'Protección UV' }
      ],
      'acampada': [
        { categoria: 'Campamento', item: 'Carpa', cantidad: 1, observaciones: 'Según número de personas' },
        { categoria: 'Campamento', item: 'Saco de dormir', cantidad: 1, observaciones: 'Según temperatura' },
        { categoria: 'Campamento', item: 'Colchoneta', cantidad: 1, observaciones: 'Aislamiento térmico' },
        { categoria: 'Campamento', item: 'Cocina de campamento', cantidad: 1, observaciones: 'Para cocinar' }
      ]
    };
    
    // Buscar coincidencias parciales
    const actividadLower = actividad.toLowerCase();
    Object.keys(activityEquipmentMap).forEach(key => {
      if (actividadLower.includes(key)) {
        suggestions.push(...activityEquipmentMap[key]);
      }
    });
    
    return suggestions;
  };

  // Cargar recomendaciones basadas en actividades de los tramos
  const loadActivityRecommendations = () => {
    // Analizar actividades del itinerario para sugerir equipo
    const suggestions = [];
    
    if (formData.itinerario && formData.itinerario.length > 0) {
      formData.itinerario.forEach((day, dayIndex) => {
        if (day.actividades) {
          day.actividades.forEach(actividad => {
            // Sugerir equipo basado en la actividad
            const activitySuggestions = getEquipmentForActivity(actividad);
            suggestions.push(...activitySuggestions);
          });
        }
      });
    }
    
    // También considerar la actividad general
    if (formData.basicInfo && formData.basicInfo.actividad) {
      const generalSuggestions = getEquipmentForActivity(formData.basicInfo.actividad);
      suggestions.push(...generalSuggestions);
    }
    
    // Agregar sugerencias sin duplicados
    suggestions.forEach(item => {
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
          observaciones: `${item.observaciones} (Sugerido por actividad)`,
          checked: false
        };
        addItem('equipo', newEquipment);
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
            
            {/* Botón para cargar recomendaciones (incluye checklist seleccionado) */}
            <button
              type="button"
              onClick={() => {
                // Primero cargar recomendaciones de actividades
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
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base"
          >
            + Agregar Transporte
          </button>
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
  );
} 
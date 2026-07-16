'use client';
import React, { useState } from 'react';
import { wikiexploraChecklists, getAvailableChecklists } from '../../constants/wikiexploraChecklists';
export default function ChecklistsAdminPanel() {
  const [checklists] = useState(getAvailableChecklists());
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (checklistKey: string) => {
    setSelectedChecklist(checklistKey);
    setShowDetails(true);
  };

  const renderChecklistDetails = () => {
    if (!selectedChecklist) return null;

    const checklist = wikiexploraChecklists[selectedChecklist as keyof typeof wikiexploraChecklists];
    if (!checklist) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{checklist.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {selectedChecklist}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Items Imprescindibles */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Items Imprescindibles ({checklist.imprescindibles.length})
              </h4>
              <div className="space-y-3">
                {checklist.imprescindibles.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded border dark:border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.item}</h5>
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                        Cant: {item.cantidad}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <p><strong>Categoría:</strong> {item.categoria}</p>
                      <p><strong>Observaciones:</strong> {item.observaciones}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Aconsejables */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Items Aconsejables ({checklist.aconsejables.length})
              </h4>
              <div className="space-y-3">
                {checklist.aconsejables.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded border dark:border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.item}</h5>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                        Cant: {item.cantidad}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <p><strong>Categoría:</strong> {item.categoria}</p>
                      <p><strong>Observaciones:</strong> {item.observaciones}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Resumen del Checklist</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{checklist.imprescindibles.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Imprescindibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{checklist.aconsejables.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Aconsejables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {checklist.imprescindibles.length + checklist.aconsejables.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set([...checklist.imprescindibles.map(i => i.categoria), ...checklist.aconsejables.map(i => i.categoria)]).size}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Categorías</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Gestión de Checklists</h1>
        <p className="text-gray-600 dark:text-gray-400">Administra checklists de Wikiexplora para diferentes tipos de actividades</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Checklists Disponibles</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checklists.map((checklist, index) => {
          const checklistData = wikiexploraChecklists[checklist.value as keyof typeof wikiexploraChecklists];
          const totalItems = checklistData.imprescindibles.length + checklistData.aconsejables.length;
          const categories = new Set([
            ...checklistData.imprescindibles.map(i => i.categoria),
            ...checklistData.aconsejables.map(i => i.categoria)
          ]);

          return (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{checklist.label}</h4>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {checklist.value}
                </span>
              </div>
              
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex justify-between">
                  <span>Items imprescindibles:</span>
                  <span className="font-medium text-red-600">{checklistData.imprescindibles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items aconsejables:</span>
                  <span className="font-medium text-blue-600">{checklistData.aconsejables.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total items:</span>
                  <span className="font-medium text-green-600">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categorías:</span>
                  <span className="font-medium text-purple-600">{categories.size}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(checklist.value)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Información sobre Checklists de Wikiexplora
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <p>
                Los checklists de Wikiexplora son listas predefinidas de equipamiento optimizadas para diferentes tipos de expediciones y condiciones. 
                Cada checklist incluye <strong>items imprescindibles</strong> (obligatorios) e <strong>items aconsejables</strong> (recomendados) 
                organizados por categorías como calzado, ropa, protección solar, hidratación, alimentación, equipo, campamento, etc.
              </p>
              <p className="mt-2">
                <strong>Funcionalidades:</strong> Puedes ver los detalles completos de cada checklist, exportar checklists individuales 
                o exportar todos los checklists para su uso en otras aplicaciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showDetails && renderChecklistDetails()}
    </div>
  );
} 
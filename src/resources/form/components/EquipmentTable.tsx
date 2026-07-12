'use client';
import React from 'react';
import { equipmentData } from '../../constants/equipmentData';
import AutocompleteInput from './AutocompleteInput';

export default function EquipmentTable({ equipment, onUpdate, onRemove, onAdd }) {
  const handleToggleChecked = (index) => {
    const updatedEquipment = [...equipment];
    updatedEquipment[index].checked = !updatedEquipment[index].checked;
    onUpdate(index, 'checked', updatedEquipment[index].checked);
  };

  const handleInputChange = (index, field, value) => {
    onUpdate(index, field, value);
  };

  const handleRemove = (index) => {
    onRemove(index);
  };

  const handleAdd = () => {
    const newEquipment = {
      categoria: '',
      item: '',
      cantidad: '1',
      observaciones: '',
      checked: false
    };
    onAdd(newEquipment);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Equipo Portado</h3>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay equipo registrado</p>
          <p className="text-sm">Haga clic en "Agregar Equipo" para comenzar</p>
        </div>
      ) : (
        <div>
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Incluir
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Categoría
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Item
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-16">
                  Cant.
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Observaciones
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-12">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipment.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => handleToggleChecked(index)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        item.checked ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          item.checked ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-3 py-2 border-b relative">
                    <AutocompleteInput
                      value={item.categoria || ''}
                      onChange={(value) => handleInputChange(index, 'categoria', value)}
                      options={equipmentData.categories.map(cat => cat.name)}
                      placeholder="Seleccionar o escribir categoría"
                      className="w-full"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <input
                      type="text"
                      value={item.item || ''}
                      onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                      placeholder="Ej: Casco"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <input
                      type="number"
                      value={item.cantidad || ''}
                      onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)}
                      placeholder="1"
                      min="1"
                      className="w-full px-1 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <textarea
                      value={item.observaciones || ''}
                      onChange={(e) => handleInputChange(index, 'observaciones', e.target.value)}
                      placeholder="Detalles adicionales..."
                      rows="2"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón de agregar después de la tabla */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAdd}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm sm:text-base"
        >
          + Agregar Equipo
        </button>
      </div>
    </div>
  );
} 
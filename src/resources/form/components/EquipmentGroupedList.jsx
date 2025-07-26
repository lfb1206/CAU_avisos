'use client';
import React, { useState, useMemo, useRef } from 'react';
import EquipmentForm from './EquipmentForm';

export default function EquipmentGroupedList({ equipment, onUpdate, onRemove }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const isInitialized = useRef(false);

  // Agrupar equipo por categoría usando useMemo para evitar re-renders
  const groupedEquipment = useMemo(() => {
    return equipment.reduce((groups, item, index) => {
      const category = item.categoria || 'Sin categoría';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({ ...item, originalIndex: index });
      return groups;
    }, {});
  }, [equipment]);

  // Inicializar todas las categorías como abiertas solo una vez
  React.useEffect(() => {
    if (!isInitialized.current) {
      const currentCategories = new Set(Object.keys(groupedEquipment));
      setExpandedCategories(currentCategories);
      isInitialized.current = true;
    }
  }, [groupedEquipment]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return newExpanded;
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Equipo de Escalada': '🧗',
      'Equipo Básico': '🎒',
      'Ropa': '👕',
      'Calzado': '👟',
      'Protección Solar': '☀️',
      'Hidratación': '💧',
      'Alimentación': '🍎',
      'Campamento': '⛺',
      'Equipo de Nieve': '❄️',
      'Seguridad': '🛡️',
      'Navegación': '🧭',
      'Comunicación': '📱',
      'Primeros Auxilios': '🏥',
      'Medicina': '💊'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Equipo de Escalada': 'bg-red-100 text-red-800',
      'Equipo Básico': 'bg-blue-100 text-blue-800',
      'Ropa': 'bg-green-100 text-green-800',
      'Calzado': 'bg-yellow-100 text-yellow-800',
      'Protección Solar': 'bg-orange-100 text-orange-800',
      'Hidratación': 'bg-cyan-100 text-cyan-800',
      'Alimentación': 'bg-pink-100 text-pink-800',
      'Campamento': 'bg-purple-100 text-purple-800',
      'Equipo de Nieve': 'bg-indigo-100 text-indigo-800',
      'Seguridad': 'bg-red-100 text-red-800',
      'Navegación': 'bg-teal-100 text-teal-800',
      'Comunicación': 'bg-emerald-100 text-emerald-800',
      'Primeros Auxilios': 'bg-rose-100 text-rose-800',
      'Medicina': 'bg-violet-100 text-violet-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedEquipment).map(([category, items]) => (
        <div key={category} className="border border-gray-200 rounded-lg bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getCategoryIcon(category)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{category}</h3>
                <p className="text-sm text-gray-500">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                {items.filter(item => item.checked).length} portando
              </span>
              <svg 
                className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {expandedCategories.has(category) && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              {items.map((item, itemIndex) => (
                <EquipmentForm
                  key={`${category}-${itemIndex}`}
                  equipment={item}
                  index={item.originalIndex}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      
      {equipment.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay equipo registrado aún.</p>
          <p className="text-sm">Agrega equipo manualmente o usa los botones de arriba para cargar recomendaciones.</p>
        </div>
      )}
    </div>
  );
} 
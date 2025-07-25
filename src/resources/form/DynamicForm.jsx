'use client';
import React, { useState, useEffect } from 'react';
import FormField from './FormField';

export default function DynamicForm({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Enviar',
  disabled = false,
  fieldErrors = {} 
}) {
  const getInitialValue = (field) => {
    if (initialValues[field.name] !== undefined) return initialValues[field.name];
    if (field.type === 'checkbox') return false;
    if (field.type === 'dynamic-list') return [];
    return '';
  };

  const [values, setValues] = useState(
    fields.reduce((acc, f) => {
      acc[f.name] = getInitialValue(f);
      return acc;
    }, {})
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = values[field.name];
      
      // Required field validation
      if (field.required && !value) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
      
      // Dynamic list validation
      if (field.type === 'dynamic-list' && Array.isArray(value)) {
        if (field.required && value.length === 0) {
          newErrors[field.name] = `Debe agregar al menos un ${field.label.toLowerCase()}`;
        }
        
        // Validate each item in the list
        value.forEach((item, index) => {
          field.fields?.forEach(subField => {
            if (subField.required && !item[subField.name]) {
              newErrors[`${field.name}_${index}_${subField.name}`] = `${subField.label} es requerido`;
            }
          });
        });
      }
      
      // Email validation
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = 'Email inválido';
      }
      
      // Phone validation
      if (field.name.includes('telefono') && value && !/^\+?[0-9\s\-\(\)]+$/.test(value)) {
        newErrors[field.name] = 'Teléfono inválido';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleChange(name, newVal) {
    setValues(prev => ({ ...prev, [name]: newVal }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Format datetime for display
  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get equipment categories for summary
  const getEquipmentCategories = () => {
    if (!Array.isArray(values.equipo)) return [];
    const categories = [...new Set(values.equipo.map(item => item.categoria).filter(Boolean))];
    return categories;
  };

  // Get transport types for summary
  const getTransportTypes = () => {
    if (!Array.isArray(values.transporte)) return [];
    const types = [...new Set(values.transporte.map(item => item.tipo).filter(Boolean))];
    return types;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.name} className={field.type === 'dynamic-list' ? 'md:col-span-2' : ''}>
              <FormField
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                value={values[field.name]}
                options={field.options || []}
                fields={field.fields || []}
                disabled={field.disabled || disabled}
                onChange={val => handleChange(field.name, val)}
                error={errors[field.name] || fieldErrors[field.name] || null}
              />
            </div>
          ))}
        </div>

        {/* Form Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Resumen del Aviso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Contacto CAU:</strong> {values.contactoCAU || 'No especificado'}
            </div>
            <div>
              <strong>Actividad:</strong> {values.actividad || 'No especificada'}
            </div>
            <div>
              <strong>Cerro/Sector:</strong> {values.cerroOSector || 'No especificado'}
            </div>
            <div>
              <strong>Fecha de regreso:</strong> {formatDateTimeForDisplay(values.fechaHoraReporteRegreso)}
            </div>
            <div className="md:col-span-2">
              <strong>Participantes:</strong> {Array.isArray(values.participantes) ? values.participantes.length : 0} personas
            </div>
            <div className="md:col-span-2">
              <strong>Itinerario:</strong> {Array.isArray(values.itinerario) ? values.itinerario.length : 0} días
            </div>
            <div className="md:col-span-2">
              <strong>Equipo:</strong> {Array.isArray(values.equipo) ? values.equipo.length : 0} items 
              {getEquipmentCategories().length > 0 && (
                <span className="text-gray-600"> ({getEquipmentCategories().join(', ')})</span>
              )}
            </div>
            <div className="md:col-span-2">
              <strong>Transporte:</strong> {Array.isArray(values.transporte) ? values.transporte.length : 0} vehículos
              {getTransportTypes().length > 0 && (
                <span className="text-gray-600"> ({getTransportTypes().join(', ')})</span>
              )}
            </div>
            <div className="md:col-span-2">
              <strong>Datos Médicos:</strong> {Array.isArray(values.datosMedicos) ? values.datosMedicos.length : 0} registros
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || disabled}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';
import React from 'react';
import docFields from '../../constants/docFields';

interface SelectOption {
  value: string;
  label: string;
}

interface DynamicFormFieldProps {
  fieldName: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  required?: boolean;
  className?: string;
  placeholder?: string | null;
  options?: SelectOption[] | null;
  min?: string | null;
}

export default function DynamicFormField({
  fieldName,
  value,
  onChange,
  required = false,
  className = '',
  placeholder = null,
  options = null,
  min = null
}: DynamicFormFieldProps) {
  // Buscar la configuración del campo en docFields
  const fieldConfig = docFields.find(field => field.name === fieldName);
  
  if (!fieldConfig) {
    console.warn(`Field configuration not found for: ${fieldName}`);
    return null;
  }

  const {
    label,
    type,
    placeholder: defaultPlaceholder
  } = fieldConfig;

  const finalPlaceholder = placeholder || defaultPlaceholder;
  const isRequired = required || fieldConfig.required;

  const strValue = typeof value === 'string' ? value : '';
  const boolValue = typeof value === 'boolean' ? value : false;

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'tel':
        return (
          <input
            type="tel"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            min={min ?? undefined}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            min={min ?? undefined}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={boolValue}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              required={isRequired}
            />
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          >
            <option value="">{finalPlaceholder}</option>
            {options && options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            rows={4}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={finalPlaceholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            required={isRequired}
          />
        );
    }
  };

  // Para checkboxes, no necesitamos el label wrapper
  if (type === 'checkbox') {
    return renderField();
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {isRequired && '*'}
      </label>
      {renderField()}
    </div>
  );
}

export const getFieldConfig = (fieldName: string) =>
  docFields.find((field: { name: string }) => field.name === fieldName);

export const getFieldsForSection = (sectionName: string) => {
  const sectionField = docFields.find((field: { name: string }) => field.name === sectionName) as { fields?: unknown[] } | undefined;
  return sectionField?.fields || [];
}; 
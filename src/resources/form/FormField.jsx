'use client';
import React, { useState } from 'react';

export default function FormField({
  label,
  placeholder,
  value,
  type = 'text',
  onChange,
  options = [],
  disabled = false,
  error = null,
  fields = [], // For dynamic-list type
}) {
  const id = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const baseInputClass = `w-full pl-4 pr-4 py-2 rounded-lg border ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:outline-none focus:ring-2 ${
    error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
  }`;

  // Handle dynamic list type
  if (type === 'dynamic-list') {
    return (
      <div className="space-y-4 w-full">
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
        
        <div className="space-y-3">
          {Array.isArray(value) && value.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Elemento {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = [...value];
                    newValue.splice(index, 1);
                    onChange(newValue);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-600">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={item[field.name] || ''}
                      placeholder={field.placeholder}
                      onChange={(e) => {
                        const newValue = [...value];
                        newValue[index] = {
                          ...newValue[index],
                          [field.name]: e.target.value
                        };
                        onChange(newValue);
                      }}
                      className="w-full pl-3 pr-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => {
              const newItem = fields.reduce((acc, field) => {
                acc[field.name] = '';
                return acc;
              }, {});
              onChange([...(value || []), newItem]);
            }}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + Agregar {label.toLowerCase()}
          </button>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm ml-2">*{error}</p>}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="">{placeholder}</option>
          {options.map((opt, i) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={i} value={val}>
                {label}
              </option>
            );
          })}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
      </div>
    );
  }

  if (type === 'long-text') {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
        <textarea
          id={id}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} min-h-[120px] resize-y`}
          rows={6}
        />
        {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
      </div>
    );
  }

  if (type === 'datetime-local') {
    return (
      <div className="space-y-1 w-full">
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
        <input
          id={id}
          type="datetime-local"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        />
        {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
      </div>
    );
  }

  // Default input
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
      />
      {error && <p className="text-red-500 text-sm mt-1">*{error}</p>}
    </div>
  );
}

'use client';
import React from 'react';

export default function FormField({
  label,
  placeholder,
  value,
  type = 'text',
  onChange,
  options = [],
  disabled = false,
  error = null,
}) {
  const id = `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const baseInputClass = `w-full pl-4 pr-4 py-2 rounded-lg border ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:outline-none focus:ring-2 ${
    error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
  }`;

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

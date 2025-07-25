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
    return '';
  };

  const [values, setValues] = useState(
    fields.reduce((acc, f) => {
      acc[f.name] = getInitialValue(f);
      return acc;
    }, {})
  );

  // useEffect(() => {
  //   setValues(
  //     fields.reduce((acc, f) => {
  //       acc[f.name] = getInitialValue(f);
  //       return acc;
  //     }, {})
  //   );
  // }, [initialValues, fields]);

  function handleChange(name, newVal) {
    setValues(prev => ({ ...prev, [name]: newVal }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {fields.map(field => (
        <FormField
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          type={field.type}
          value={values[field.name]}
          options={field.options || []}
          disabled={field.disabled || disabled}
          onChange={val => handleChange(field.name, val)}
          error={fieldErrors[field.name] || null}
        />
      ))}

      <div className="flex w-full items-center justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#5A5A5A] text-white py-2 px-4 rounded-lg flex items-center gap-2"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-melon-100 text-black py-2 px-4 rounded-lg flex items-center gap-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

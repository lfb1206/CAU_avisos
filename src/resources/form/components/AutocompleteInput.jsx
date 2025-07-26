'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function AutocompleteInput({
  value,
  onChange,
  options = [],
  placeholder = '',
  label = '',
  required = false,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Filter options based on input
  useEffect(() => {
    if (inputValue === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Solo actualizar el filtro local, no llamar onChange inmediatamente
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option); // Solo llamar onChange cuando se selecciona una opción
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredOptions.length > 0) {
        handleOptionClick(filteredOptions[0]);
      } else {
        // Si no hay opciones filtradas, usar el valor actual del input
        onChange(inputValue);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputBlur = () => {
    // Solo actualizar si el valor cambió y no hay opciones abiertas
    setTimeout(() => {
      if (!isOpen && inputValue !== value) {
        onChange(inputValue);
      }
    }, 200);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && '*'}
        </label>
      )}
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
        required={required}
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-auto">
          {filteredOptions.slice(0, 8).map((option, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
          {filteredOptions.length > 8 && (
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
              +{filteredOptions.length - 8} más opciones...
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
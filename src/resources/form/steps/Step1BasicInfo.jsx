'use client';
import React, { useRef } from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import { savedData } from '../../constants/savedData';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step1BasicInfo() {
  const { formData, updateFormField, updateWeatherImages } = useFormContext();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleFieldChange = (field, value) => {
    updateFormField('basicInfo', field, value);
  };

  const handleContactChange = (value) => {
    handleFieldChange('contactoCAU', value);
    
    // Auto-fill contact information if it's a saved contact
    if (savedData.savedContacts[value]) {
      const contact = savedData.savedContacts[value];
      handleFieldChange('telefonoContacto', contact.telefono);
      handleFieldChange('emailContacto', contact.email);
    }
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    // Process each file to convert to base64
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          url: URL.createObjectURL(file), // For preview
          base64: e.target.result, // For printing and storage
          fechaObtencion: new Date().toISOString().split('T')[0] // Default to today's date
        };
        
        const currentImages = formData.basicInfo.weatherImages || [];
        updateWeatherImages([...currentImages, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event) => {
    processFiles(event.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (imageId) => {
    const currentImages = formData.basicInfo.weatherImages || [];
    const filtered = currentImages.filter(img => img.id !== imageId);
    
    // Revoke object URL to free memory
    const removed = currentImages.find(img => img.id === imageId);
    if (removed) {
      URL.revokeObjectURL(removed.url);
    }
    
    updateWeatherImages(filtered);
  };

  const updateImageDate = (imageId, newDate) => {
    const currentImages = formData.basicInfo.weatherImages || [];
    const updatedImages = currentImages.map(img => 
      img.id === imageId ? { ...img, fechaObtencion: newDate } : img
    );
    updateWeatherImages(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información Básica de la Actividad
        </h2>
        <p className="text-gray-600">
          Complete la información básica del aviso de salida
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Información de Contacto CAU
          </h3>
        </div>

        <AutocompleteInput
          label="Contacto CAU"
          value={formData.basicInfo.contactoCAU}
          onChange={handleContactChange}
          options={formOptions.contactoCAU}
          placeholder="Seleccione o escriba el nombre del contacto CAU"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Teléfono de contacto *
          </label>
          <input
            type="tel"
            value={formData.basicInfo.telefonoContacto}
            onChange={(e) => handleFieldChange('telefonoContacto', e.target.value)}
            placeholder="+569xxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email de contacto *
          </label>
          <input
            type="email"
            value={formData.basicInfo.emailContacto}
            onChange={(e) => handleFieldChange('emailContacto', e.target.value)}
            placeholder="correo@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Fecha y hora de reporte de regreso *
          </label>
          <input
            type="datetime-local"
            value={formData.basicInfo.fechaHoraReporteRegreso}
            onChange={(e) => handleFieldChange('fechaHoraReporteRegreso', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Activity Details */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Detalles de la Actividad
          </h3>
        </div>

        <AutocompleteInput
          label="Actividad"
          value={formData.basicInfo.actividad}
          onChange={(value) => handleFieldChange('actividad', value)}
          options={formOptions.actividades}
          placeholder="Seleccione o escriba el tipo de actividad"
          required
        />

        <AutocompleteInput
          label="Cerro o Sector"
          value={formData.basicInfo.cerroOSector}
          onChange={(value) => handleFieldChange('cerroOSector', value)}
          options={formOptions.cerrosSectores}
          placeholder="Seleccione o escriba el cerro o sector"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ruta
          </label>
          <input
            type="text"
            value={formData.basicInfo.ruta}
            onChange={(e) => handleFieldChange('ruta', e.target.value)}
            placeholder="Ej: Cara norte, Ruta normal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Link al pronóstico del tiempo
          </label>
          <input
            type="url"
            value={formData.basicInfo.linkPronostico}
            onChange={(e) => handleFieldChange('linkPronostico', e.target.value)}
            placeholder="https://weather.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Link a la ruta
          </label>
          <input
            type="url"
            value={formData.basicInfo.linkRuta}
            onChange={(e) => handleFieldChange('linkRuta', e.target.value)}
            placeholder="https://link-a-la-ruta.cl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* InReach Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Dispositivo InReach
          </h3>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.basicInfo.llevaInreach || false}
                onChange={(e) => handleFieldChange('llevaInreach', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                ¿Lleva dispositivo InReach?
              </span>
            </label>
          </div>

          {formData.basicInfo.llevaInreach && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Número de InReach *
                </label>
                <input
                  type="text"
                  value={formData.basicInfo.numeroInreach || ''}
                  onChange={(e) => handleFieldChange('numeroInreach', e.target.value)}
                  placeholder="Ej: 1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.basicInfo.llevaInreach}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Código InReach *
                </label>
                <input
                  type="text"
                  value={formData.basicInfo.codigoInreach || ''}
                  onChange={(e) => handleFieldChange('codigoInreach', e.target.value)}
                  placeholder="Ej: ABC123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.basicInfo.llevaInreach}
                />
              </div>

              <div className="md:col-span-2 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                <strong>Nota:</strong> El dispositivo InReach permite comunicación satelital y seguimiento en tiempo real. 
                Asegúrese de que esté activado y configurado correctamente antes de la expedición.
              </div>
            </div>
          )}
        </div>

        {/* Weather Images Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Imágenes del Pronóstico del Tiempo
          </h3>
          
          <div className="space-y-4">
            <div 
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="weather-images"
              />
              <label
                htmlFor="weather-images"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Seleccionar Imágenes del Clima
              </label>
              <p className="text-sm text-gray-500 mt-2">
                O arrastre y suelte las imágenes aquí
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Formatos: JPG, PNG, GIF
              </p>
            </div>

            {/* Display uploaded images */}
            {formData.basicInfo.weatherImages && formData.basicInfo.weatherImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.basicInfo.weatherImages.map((image) => (
                  <div key={image.id} className="relative border rounded-lg p-3 bg-gray-50">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs text-gray-600 mb-2 truncate" title={image.name}>
                          {image.name}
                        </p>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">
                            Fecha de obtención:
                          </label>
                          <input
                            type="date"
                            value={image.fechaObtencion || ''}
                            onChange={(e) => updateImageDate(image.id, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Complete la información de contacto del CAU responsable</li>
          <li>• Al seleccionar un contacto guardado, se auto-completarán teléfono y email</li>
          <li>• Especifique la fecha y hora de reporte de regreso</li>
          <li>• Describa la actividad y el cerro/sector</li>
          <li>• <strong>Marque si lleva InReach</strong> y complete número y código si aplica</li>
          <li>• Agregue enlaces al pronóstico del tiempo y la ruta si están disponibles</li>
          <li>• Puede agregar imágenes del pronóstico del tiempo arrastrando y soltando o seleccionando archivos</li>
          <li>• <strong>Asigne fecha de obtención</strong> a cada imagen del clima</li>
          <li>• Use las opciones sugeridas o escriba su propio texto</li>
        </ul>
      </div>
    </div>
  );
} 
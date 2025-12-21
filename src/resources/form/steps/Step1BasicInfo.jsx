'use client';
import React, {useState, useEffect} from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { getContacts } from '../../constants/peopleData';
import { getAllPeople } from '@/app/lib/actions';
import { basicFormOptions } from '../../constants/basicFormOptions';
import AutocompleteInput from '../components/AutocompleteInput';
import WeatherImageUpload from '../components/WeatherImageUpload';
import InReachSection from '../components/InReachSection';
import DynamicFormField from '../components/DynamicFormField';

export default function Step1BasicInfo() {
  const { formData, updateFormField } = useFormContext();
  const [peopleData, setPeopleData] = useState({});

   useEffect(() => {
    async function fetchData() {
      try {
        const peopleDataValue = await getAllPeople();
        setPeopleData(peopleDataValue);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    }
    fetchData();
  }, []); // Empty dependency array runs once on mount
  
  const handleFieldChange = (field, value) => {
    updateFormField('basicInfo', field, value);
  };

  const handleContactChange = (value) => {
    handleFieldChange('contactoCAU', value);
    
    // Autocompletar todos los datos si el contacto existe en peopleData
    if (value && peopleData[value]) {
      const contactData = peopleData[value];
      handleFieldChange('telefonoContacto', contactData.telefono);
      handleFieldChange('emailContacto', contactData.email);
      // También autocompletar datos médicos si están disponibles
      if (contactData.grupoSanguineo) handleFieldChange('grupoSanguineo', contactData.grupoSanguineo);
      if (contactData.alergias) handleFieldChange('alergias', contactData.alergias);
      if (contactData.enfermedades) handleFieldChange('enfermedades', contactData.enfermedades);
      if (contactData.medicamentos) handleFieldChange('medicamentos', contactData.medicamentos);
      if (contactData.condicionesEspeciales) handleFieldChange('condicionesEspeciales', contactData.condicionesEspeciales);
    }
  };

  const handleImageUpload = (newImage) => {
    const currentImages = formData.basicInfo.weatherImages || [];
    handleFieldChange('weatherImages', [...currentImages, newImage]);
  };

  const handleImageRemove = (imageId) => {
    const currentImages = formData.basicInfo.weatherImages || [];
    const filtered = currentImages.filter(img => img.id !== imageId);
    handleFieldChange('weatherImages', filtered);
  };

  const handleImageDateUpdate = (imageId, newDate) => {
    const currentImages = formData.basicInfo.weatherImages || [];
    const updatedImages = currentImages.map(img => 
      img.id === imageId ? { ...img, fechaObtencion: newDate } : img
    );
    handleFieldChange('weatherImages', updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
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
          { Object.keys(peopleData).length === 0 && 
          <h4 className="text-sm font-semibold">
            Inicie sesión como socio para autocompletar datos. 
          </h4>
          }
        </div>

        <div>
          <AutocompleteInput
            label="Contacto CAU"
            value={formData.basicInfo.contactoCAU || ''}
            onChange={handleContactChange}
            options={Object.keys(peopleData)}
            placeholder="Seleccione o escriba el nombre del contacto CAU"
            required
          />
        </div>

        <div>
          <DynamicFormField
            fieldName="telefonoContacto"
            value={formData.basicInfo.telefonoContacto || ''}
            onChange={(value) => handleFieldChange('telefonoContacto', value)}
          />
        </div>

        <div>
          <DynamicFormField
            fieldName="emailContacto"
            value={formData.basicInfo.emailContacto || ''}
            onChange={(value) => handleFieldChange('emailContacto', value)}
          />
        </div>

        <div>
          <DynamicFormField
            fieldName="fechaHoraReporteRegreso"
            value={formData.basicInfo.fechaHoraReporteRegreso || ''}
            onChange={(value) => handleFieldChange('fechaHoraReporteRegreso', value)}
            min={new Date().toLocaleString('sv-SE').slice(0, 16)}
          />
          {formData.basicInfo.fechaHoraReporteRegreso && 
           new Date(formData.basicInfo.fechaHoraReporteRegreso) <= new Date() && (
            <p className="text-red-500 text-xs mt-1">
              La fecha de reporte de regreso debe ser posterior a hoy
            </p>
          )}
        </div>

        {/* Activity Details */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Detalles de la Actividad
          </h3>
        </div>

        <AutocompleteInput
          label="Actividad"
          value={formData.basicInfo.actividad || ''}
          onChange={(value) => handleFieldChange('actividad', value)}
                      options={basicFormOptions.actividades}
          placeholder="Seleccione o escriba el tipo de actividad"
          required
        />
        
        <AutocompleteInput
          label="Cerro o Sector"
          value={formData.basicInfo.cerroOSector || ''}
          onChange={(value) => handleFieldChange('cerroOSector', value)}
                      options={basicFormOptions.cerrosSectores}
          placeholder="Seleccione o escriba el cerro o sector"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ruta
          </label>
          <input
            type="text"
            value={formData.basicInfo.ruta || ''}
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
            value={formData.basicInfo.linkPronostico || ''}
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
            value={formData.basicInfo.linkRuta || ''}
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

        <div className="md:col-span-2">
          <InReachSection
            llevaInreach={formData.basicInfo.llevaInreach || false}
            numeroInreach={formData.basicInfo.numeroInreach || ''}
            codigoInreach={formData.basicInfo.codigoInreach || ''}
            onInreachChange={(value) => handleFieldChange('llevaInreach', value)}
            onInreachNumberChange={(value) => handleFieldChange('numeroInreach', value)}
            onInreachCodeChange={(value) => handleFieldChange('codigoInreach', value)}
          />
        </div>

        {/* Weather Images Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Imágenes del Pronóstico del Tiempo
          </h3>
          
          <WeatherImageUpload
            weatherImages={formData.basicInfo.weatherImages || []}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            onImageDateUpdate={handleImageDateUpdate}
          />
        </div>

        {/* Instructions */}
        <div className="md:col-span-2 mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-4">
            💡 Consejos útiles para completar este paso:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-2">Información de contacto:</p>
              <ul className="space-y-2 ml-4">
                <li>• Seleccione un contacto CAU guardado para auto-completar datos</li>
                <li>• Verifique que teléfono y email estén correctos</li>
                <li>• La fecha de regreso es obligatoria para el aviso</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Detalles de la actividad:</p>
              <ul className="space-y-2 ml-4">
                <li>• Use las opciones sugeridas o escriba su propia actividad</li>
                <li>• Especifique el cerro o sector exacto de destino</li>
                <li>• Los enlaces del pronóstico y ruta son opcionales</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Equipo InReach:</p>
              <ul className="space-y-2 ml-4">
                <li>• Marque solo si realmente porta un dispositivo InReach</li>
                <li>• Complete número y código si los tiene disponibles</li>
                <li>• Esta información es importante para emergencias</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Imágenes del clima:</p>
              <ul className="space-y-2 ml-4">
                <li>• Arrastre imágenes o use el botón de selección</li>
                <li>• Asigne la fecha de obtención a cada imagen</li>
                <li>• Las imágenes aparecerán en el aviso final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
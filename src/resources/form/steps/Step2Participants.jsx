'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { formOptions } from '../../constants/formOptions';
import { savedData } from '../../constants/savedData';
import AutocompleteInput from '../components/AutocompleteInput';

export default function Step2Participants() {
  const { formData, addItem, removeItem, updateItem } = useFormContext();

  // Ensure participantes is always an array
  const participantes = Array.isArray(formData.participantes) ? formData.participantes : [];

  const addParticipant = () => {
    const newParticipant = {
      nombre: '',
      rut: '',
      telefono: '',
      contactoEmergencia: '',
      telefonoEmergencia: '',
      // Medical data fields
      grupoSanguineo: '',
      alergias: '',
      enfermedades: '',
      medicamentos: '',
      condicionesEspeciales: ''
    };
    addItem('participantes', newParticipant);
  };

  const updateParticipant = (index, field, value) => {
    updateItem('participantes', index, { [field]: value });
  };

  // Handle participant name change with auto-fill
  const handleParticipantNameChange = (index, participantName) => {
    console.log('Changing participant name to:', participantName);
    
    // Auto-fill data if it's a saved participant
    if (savedData.savedParticipants[participantName]) {
      const participant = savedData.savedParticipants[participantName];
      console.log('Found saved participant data:', participant);
      
      // Update all fields at once including the name
      const allUpdates = {
        nombre: participantName,
        rut: participant.rut || '',
        telefono: participant.telefono || '',
        contactoEmergencia: participant.contactoEmergencia || '',
        telefonoEmergencia: participant.telefonoEmergencia || '',
        grupoSanguineo: participant.grupoSanguineo || '',
        alergias: participant.alergias || '',
        enfermedades: participant.enfermedades || '',
        medicamentos: participant.medicamentos || '',
        condicionesEspeciales: participant.condicionesEspeciales || ''
      };
      
      console.log('Updating participant with:', allUpdates);
      updateItem('participantes', index, allUpdates);
      console.log('Auto-fill completed for:', participantName);
    } else {
      console.log('No saved data found for participant:', participantName);
      // Just update the name
      updateParticipant(index, 'nombre', participantName);
    }
  };

  // Format RUT input
  const formatRUT = (rut) => {
    // Remove all non-alphanumeric characters
    let value = rut.replace(/[^0-9kK]/g, '');
    
    // Limit to 9 characters
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    // Add formatting
    if (value.length > 1) {
      value = value.slice(0, -1) + '-' + value.slice(-1);
    }
    if (value.length > 4) {
      value = value.slice(0, -5) + '.' + value.slice(-5);
    }
    if (value.length > 8) {
      value = value.slice(0, -9) + '.' + value.slice(-9);
    }
    
    return value;
  };

  const handleRUTChange = (index, value) => {
    const formattedRUT = formatRUT(value);
    updateParticipant(index, 'rut', formattedRUT);
  };

  // Get saved participant names for dropdown
  const getSavedParticipantNames = () => {
    return Object.keys(savedData.savedParticipants);
  };

  // Auto-add first participant if none exists
  React.useEffect(() => {
    if (participantes.length === 0) {
      addParticipant();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Participantes de la Expedición
        </h2>
        <p className="text-gray-600">
          Registre la información de todos los participantes incluyendo datos médicos relevantes
        </p>
      </div>

      {/* Participants List */}
      <div className="space-y-6">
        {participantes.map((participant, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Participante {index + 1}
              </h3>
              {participantes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem('participantes', index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">
                  Información Básica
                </h4>
              </div>

              <AutocompleteInput
                label="Nombre completo *"
                value={participant.nombre || ''}
                onChange={(value) => handleParticipantNameChange(index, value)}
                options={getSavedParticipantNames()}
                placeholder="Seleccione o escriba el nombre del participante"
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  RUT *
                </label>
                <input
                  type="text"
                  value={participant.rut || ''}
                  onChange={(e) => handleRUTChange(index, e.target.value)}
                  placeholder="20.666.498-3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={participant.telefono || ''}
                  onChange={(e) => updateParticipant(index, 'telefono', e.target.value)}
                  placeholder="+569xxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Contacto de emergencia *
                </label>
                <input
                  type="text"
                  value={participant.contactoEmergencia || ''}
                  onChange={(e) => updateParticipant(index, 'contactoEmergencia', e.target.value)}
                  placeholder="Nombre del contacto de emergencia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono de emergencia *
                </label>
                <input
                  type="tel"
                  value={participant.telefonoEmergencia || ''}
                  onChange={(e) => updateParticipant(index, 'telefonoEmergencia', e.target.value)}
                  placeholder="+569xxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Medical Information */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">
                  Datos Médicos Importantes
                </h4>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Grupo sanguíneo
                </label>
                <select
                  value={participant.grupoSanguineo || ''}
                  onChange={(e) => updateParticipant(index, 'grupoSanguineo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar grupo sanguíneo</option>
                  {formOptions.bloodTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <AutocompleteInput
                label="Alergias"
                value={participant.alergias || ''}
                onChange={(value) => updateParticipant(index, 'alergias', value)}
                options={formOptions.allergies}
                placeholder="Seleccione o escriba las alergias"
              />

              <AutocompleteInput
                label="Enfermedades o condiciones"
                value={participant.enfermedades || ''}
                onChange={(value) => updateParticipant(index, 'enfermedades', value)}
                options={formOptions.medicalConditions}
                placeholder="Seleccione o escriba las condiciones"
              />

              <AutocompleteInput
                label="Medicamentos que toma"
                value={participant.medicamentos || ''}
                onChange={(value) => updateParticipant(index, 'medicamentos', value)}
                options={formOptions.medications}
                placeholder="Seleccione o escriba los medicamentos"
              />

              <AutocompleteInput
                label="Condiciones especiales"
                value={participant.condicionesEspeciales || ''}
                onChange={(value) => updateParticipant(index, 'condicionesEspeciales', value)}
                options={formOptions.specialConditions}
                placeholder="Seleccione o escriba las condiciones especiales"
              />
            </div>
          </div>
        ))}

        {/* Add Participant Button */}
        <button
          type="button"
          onClick={addParticipant}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Agregar Participante
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Instrucciones para este paso:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Registre todos los participantes de la expedición</li>
          <li>• Al seleccionar un participante guardado, se auto-completarán todos los datos</li>
          <li>• El RUT se formatea automáticamente (ej: 20.666.498-3)</li>
          <li>• Complete la información médica relevante para la seguridad</li>
          <li>• Especifique grupo sanguíneo para emergencias</li>
          <li>• Identifique alergias que puedan afectar la expedición</li>
          <li>• Documente enfermedades o condiciones relevantes</li>
          <li>• Registre medicamentos que se toman regularmente</li>
          <li>• Incluya condiciones especiales para montañismo</li>
          <li>• Use las opciones sugeridas o escriba su propio texto</li>
        </ul>
      </div>
    </div>
  );
} 
'use client';
import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { getParticipants, peopleData } from '../../constants/peopleData';
import ParticipantForm from '../components/ParticipantForm';

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
      grupoSanguineo: '',
      alergias: '',
      enfermedades: '',
      medicamentos: '',
      condicionesEspeciales: '',
      isDuplicate: false
    };
    addItem('participantes', newParticipant);
  };

  const updateParticipant = (index, field, value) => {
    const updatedParticipant = { ...participantes[index], [field]: value };
    updateItem('participantes', index, updatedParticipant);
  };

  const handleParticipantNameChange = (index, participantName) => {
    // Check for duplicates
    const isDuplicate = participantes.some((p, i) => i !== index && p.nombre === participantName);
    if (isDuplicate) {
      updateItem('participantes', index, { ...participantes[index], isDuplicate: true });
      return;
    }
    
    // Update name and clear duplicate flag
    updateItem('participantes', index, { ...participantes[index], nombre: participantName, isDuplicate: false });
    
    // Auto-fill data if it's a saved participant
    if (peopleData[participantName]) {
      const saved = peopleData[participantName];
      updateItem('participantes', index, {
        ...saved,
        nombre: participantName,
        isDuplicate: false
      });
    }
  };

  const getSavedParticipantNames = () => {
    return Object.keys(peopleData);
  };

  // Auto-add first participant if none exists
  React.useEffect(() => {
    if (participantes.length === 0) {
      addParticipant();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
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

            <ParticipantForm
              participant={participant}
              index={index}
              onUpdate={updateParticipant}
              onNameChange={handleParticipantNameChange}
              getSavedParticipantNames={getSavedParticipantNames}
            />
          </div>
        ))}
      </div>

      {/* Add Participant Button */}
      <button
        type="button"
        onClick={addParticipant}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Agregar Participante
      </button>

      {/* Instructions */}
      <div className="mt-8 bg-green-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-900 mb-3">
          👥 Consejos para registrar participantes:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
          <div>
            <p className="font-medium mb-1">Datos personales básicos:</p>
            <ul className="space-y-1 ml-2">
              <li>• Complete nombre completo del participante</li>
              <li>• Ingrese RUT (se formatea automáticamente)</li>
              <li>• Proporcione teléfono de contacto</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Contacto de emergencia:</p>
            <ul className="space-y-1 ml-2">
              <li>• Nombre de contacto de emergencia</li>
              <li>• Teléfono de contacto de emergencia</li>
              <li>• Debe ser alguien externo a la expedición</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Información médica:</p>
            <ul className="space-y-1 ml-2">
              <li>• Grupo sanguíneo (importante para emergencias)</li>
              <li>• Alergias conocidas (medicamentos, alimentos)</li>
              <li>• Enfermedades preexistentes relevantes</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Consejos útiles:</p>
            <ul className="space-y-1 ml-2">
              <li>• Use nombres guardados para auto-completar</li>
              <li>• Agregue tantos participantes como sea necesario</li>
              <li>• Verifique que todos los campos requeridos estén completos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
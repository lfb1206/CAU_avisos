'use client';
import React, { useState, useEffect } from 'react';
import { getContacts, getParticipants } from '../../constants/peopleData';
import { basicFormOptions } from '../../constants/basicFormOptions';
import { medicalOptions } from '../../constants/medicalOptions';
import { transportOptions } from '../../constants/transportOptions';
import { equipmentData } from '../../constants/equipmentData';
import { riskManagementOptions } from '../../constants/riskManagementOptions';
import { exportAllData, createBackup, getChanges, exportChangesReport } from '../../constants/dataExportUtils';

export default function DataAdminPanel() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [auditReport, setAuditReport] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para edición
  const [contacts, setContacts] = useState(getContacts());
  const [participants, setParticipants] = useState(getParticipants());
  const [basicOptions, setBasicOptions] = useState(basicFormOptions);
  const [medicalOptionsData, setMedicalOptionsData] = useState(medicalOptions);
  const [transportOptionsData, setTransportOptionsData] = useState(transportOptions);
  const [equipmentOptionsData, setEquipmentOptionsData] = useState(equipmentData);
  const [riskOptionsData, setRiskOptionsData] = useState(riskManagementOptions);

  const handleGenerateStatistics = () => {
    const stats = {
      contacts: {
        total: Object.keys(contacts).length,
        withValidPhone: Object.values(contacts).filter(c => c.telefono && c.telefono.includes('+569')).length,
        withValidEmail: Object.values(contacts).filter(c => c.email && c.email.includes('@')).length
      },
      participants: {
        total: Object.keys(participants).length,
        withValidRUT: Object.values(participants).filter(p => p.rut && p.rut.includes('-')).length,
        withValidPhone: Object.values(participants).filter(p => p.telefono && p.telefono.includes('+569')).length
      },
      activities: {
        total: basicOptions.actividades.length
      }
    };
    setStatistics(stats);
  };

  const handleExportAllData = () => {
    try {
      const currentData = {
        contacts,
        participants,
        basicOptions,
        medicalOptions,
        transportOptions,
        equipmentOptions,
        riskOptions
      };
      exportAllData(currentData);
    } catch (error) {
      console.error('Error exportando datos:', error);
      alert('Error al exportar datos: ' + error.message);
    }
  };

  const handleCreateBackup = () => {
    try {
      createBackup();
    } catch (error) {
      console.error('Error creando backup:', error);
      alert('Error al crear backup: ' + error.message);
    }
  };

  const handleExportChanges = () => {
    try {
      const changes = getChanges(savedContacts, contacts);
      exportChangesReport(changes, `changes_report_${new Date().toISOString().split('T')[0]}.txt`);
    } catch (error) {
      console.error('Error exportando cambios:', error);
      alert('Error al exportar cambios: ' + error.message);
    }
  };

  const handleEditData = (dataType, data) => {
    setEditingData({ type: dataType, data });
    setEditMode(true);
  };

  const handleSaveData = (dataType, updatedData) => {
    switch (dataType) {
      case 'contacts':
        setContacts(updatedData);
        break;
      case 'participants':
        setParticipants(updatedData);
        break;
      case 'basicOptions':
        setBasicOptions(updatedData);
        break;
          case 'medicalOptions':
      setMedicalOptionsData(updatedData);
      break;
          case 'transportOptions':
      setTransportOptionsData(updatedData);
      break;
    case 'equipmentOptions':
      setEquipmentOptionsData(updatedData);
      break;
    case 'riskOptions':
      setRiskOptionsData(updatedData);
      break;
    }
    setEditMode(false);
    setEditingData(null);
  };

  const handleAddItem = (dataType, newItem) => {
    const currentData = getCurrentData(dataType);
    const updatedData = { ...currentData, ...newItem };
    handleSaveData(dataType, updatedData);
  };

  const handleDeleteItem = (dataType, key) => {
    const currentData = getCurrentData(dataType);
    const updatedData = { ...currentData };
    delete updatedData[key];
    handleSaveData(dataType, updatedData);
  };

  const getCurrentData = (dataType) => {
    switch (dataType) {
      case 'contacts': return contacts;
      case 'participants': return participants;
      case 'basicOptions': return basicOptions;
      case 'medicalOptions': return medicalOptionsData;
          case 'transportOptions': return transportOptionsData;
    case 'equipmentOptions': return equipmentOptionsData;
    case 'riskOptions': return riskOptionsData;
      default: return {};
    }
  };

  const renderContactsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contactos CAU</h3>
        <button
          onClick={() => handleEditData('contacts', {})}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Agregar Contacto
        </button>
      </div>
      
      <div className="grid gap-4">
        {Object.entries(contacts).map(([name, data]) => (
          <div key={name} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{name}</h4>
                <p className="text-sm text-gray-600">Teléfono: {data.telefono}</p>
                <p className="text-sm text-gray-600">Email: {data.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditData('contacts', { [name]: data })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteItem('contacts', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Participantes Guardados</h3>
        <button
          onClick={() => handleEditData('participants', {})}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Agregar Participante
        </button>
      </div>
      
      <div className="grid gap-4">
        {Object.entries(participants).map(([name, data]) => (
          <div key={name} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{name}</h4>
                <p className="text-sm text-gray-600">RUT: {data.rut}</p>
                <p className="text-sm text-gray-600">Teléfono: {data.telefono}</p>
                <p className="text-sm text-gray-600">Grupo Sanguíneo: {data.grupoSanguineo}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditData('participants', { [name]: data })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteItem('participants', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBasicOptionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Opciones Básicas de Formulario</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Contactos CAU</h4>
          <div className="space-y-2">
            {basicOptions.contactoCAU.map((contact, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{contact}</span>
                <button
                  onClick={() => {
                    const newList = basicOptions.contactoCAU.filter((_, i) => i !== index);
                    setBasicOptions({ ...basicOptions, contactoCAU: newList });
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Actividades</h4>
          <div className="space-y-2">
            {basicOptions.actividades.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{activity}</span>
                <button
                  onClick={() => {
                    const newList = basicOptions.actividades.filter((_, i) => i !== index);
                    setBasicOptions({ ...basicOptions, actividades: newList });
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalOptionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Opciones Médicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tipos de Sangre</h4>
          <div className="space-y-2">
            {medicalOptionsData.bloodTypes.map((type, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{type.label}</span>
                <button
                  onClick={() => {
                    const newList = medicalOptionsData.bloodTypes.filter((_, i) => i !== index);
                    setMedicalOptionsData({ ...medicalOptionsData, bloodTypes: newList });
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Alergias</h4>
          <div className="space-y-2">
            {medicalOptionsData.allergies.map((allergy, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">{allergy}</span>
                <button
                  onClick={() => {
                    const newList = medicalOptionsData.allergies.filter((_, i) => i !== index);
                    setMedicalOptionsData({ ...medicalOptionsData, allergies: newList });
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatisticsTab = () => (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={handleGenerateStatistics}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Generar Estadísticas
        </button>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Contactos</h3>
            <div className="space-y-1 text-sm">
              <p>Total: {statistics.contacts.total}</p>
              <p>Con teléfono válido: {statistics.contacts.withValidPhone}</p>
              <p>Con email válido: {statistics.contacts.withValidEmail}</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Participantes</h3>
            <div className="space-y-1 text-sm">
              <p>Total: {statistics.participants.total}</p>
              <p>Con RUT válido: {statistics.participants.withValidRUT}</p>
              <p>Con teléfono válido: {statistics.participants.withValidPhone}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Actividades</h3>
            <div className="space-y-1 text-sm">
              <p>Total: {statistics.activities.total}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEditModal = () => {
    if (!editMode || !editingData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {editingData.type === 'contacts' ? 'Editar Contacto' : 
             editingData.type === 'participants' ? 'Editar Participante' : 'Editar Datos'}
          </h3>
          
          <EditForm 
            dataType={editingData.type}
            data={editingData.data}
            onSave={handleSaveData}
            onCancel={() => setEditMode(false)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración de Datos</h1>
            <p className="text-gray-600">
              Revisar y modificar los diccionarios de autorellenado de la aplicación
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateBackup}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm"
            >
              Crear Backup
            </button>
            <button
              onClick={handleExportAllData}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
            >
              Exportar Todo
            </button>
            <button
              onClick={handleExportChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
            >
              Exportar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Navegación a páginas específicas */}
      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/admin"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          🏠 Panel Principal
        </a>
        <a
          href="/admin/people"
          className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          👥 Gestión de Personas
        </a>
        <a
          href="/admin/activities"
          className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          🏔️ Gestión de Actividades
        </a>
        <a
          href="/admin/equipment"
          className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          🎒 Gestión de Equipamiento
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contactos
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'participants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Participantes
          </button>
          <button
            onClick={() => setActiveTab('basicOptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'basicOptions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Opciones Básicas
          </button>
          <button
            onClick={() => setActiveTab('medicalOptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'medicalOptions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Opciones Médicas
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'statistics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      <div className="space-y-6">
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'participants' && renderParticipantsTab()}
        {activeTab === 'basicOptions' && renderBasicOptionsTab()}
        {activeTab === 'medicalOptions' && renderMedicalOptionsTab()}
        {activeTab === 'statistics' && renderStatisticsTab()}
      </div>

      {/* Modal de edición */}
      {renderEditModal()}

      {/* Información adicional */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Información Importante</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Los cambios se realizan en memoria y no se guardan automáticamente</li>
          <li>• Para guardar cambios permanentes, exporte los datos modificados</li>
          <li>• Se recomienda hacer backup antes de realizar cambios importantes</li>
          <li>• Los datos personales deben manejarse con confidencialidad</li>
        </ul>
      </div>
    </div>
  );
}

// Componente para editar datos
function EditForm({ dataType, data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(dataType, formData);
  };

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="tel"
          value={formData.telefono || ''}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  const renderParticipantForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          type="text"
          value={formData.nombre || ''}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">RUT</label>
        <input
          type="text"
          value={formData.rut || ''}
          onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="tel"
          value={formData.telefono || ''}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
        <input
          type="text"
          value={formData.contactoEmergencia || ''}
          onChange={(e) => setFormData({ ...formData, contactoEmergencia: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono de Emergencia</label>
        <input
          type="tel"
          value={formData.telefonoEmergencia || ''}
          onChange={(e) => setFormData({ ...formData, telefonoEmergencia: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Grupo Sanguíneo</label>
        <select
          value={formData.grupoSanguineo || ''}
          onChange={(e) => setFormData({ ...formData, grupoSanguineo: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Seleccionar</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="Desconocido">Desconocido</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  if (dataType === 'contacts') {
    return renderContactForm();
  } else if (dataType === 'participants') {
    return renderParticipantForm();
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Formulario de edición no disponible para este tipo de datos</p>
      <button
        onClick={onCancel}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
      >
        Cerrar
      </button>
    </div>
  );
} 
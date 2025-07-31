'use client';
import React, { useState } from 'react';
import { peopleData, getContacts, getParticipants } from '../../constants/peopleData';
import { exportDataToJSON, createBackup } from '../../constants/dataExportUtils';

export default function PeopleAdminPanel() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState(getContacts());
  const [participants, setParticipants] = useState(getParticipants());
  const [editMode, setEditMode] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({ type: 'contact' });

  const handleExportContacts = () => {
    const data = {
      contacts: contacts,
      timestamp: new Date().toISOString(),
      description: 'Contactos CAU exportados'
    };
    exportDataToJSON(data, 'contacts_export.json');
  };

  const handleExportParticipants = () => {
    const data = {
      participants: participants,
      timestamp: new Date().toISOString(),
      description: 'Participantes exportados'
    };
    exportDataToJSON(data, 'participants_export.json');
  };

  const handleExportAll = () => {
    const data = {
      peopleData: {
        contacts: contacts,
        participants: participants
      },
      timestamp: new Date().toISOString(),
      description: 'Todos los datos de personas exportados'
    };
    exportDataToJSON(data, 'people_data_export.json');
  };

  const handleCreateBackup = () => {
    const backupData = {
      originalData: peopleData,
      timestamp: new Date().toISOString(),
      type: 'backup'
    };
    exportDataToJSON(backupData, 'people_backup.json');
  };

  const handleEditPerson = (personType, personName, personData) => {
    setEditingPerson({ type: personType, name: personName, data: personData });
    setEditMode(true);
  };

  const handleSavePerson = (updatedPerson) => {
    if (updatedPerson.type === 'contact') {
      setContacts(prev => ({
        ...prev,
        [updatedPerson.name]: updatedPerson.data
      }));
    } else {
      setParticipants(prev => ({
        ...prev,
        [updatedPerson.name]: updatedPerson.data
      }));
    }
    setEditMode(false);
    setEditingPerson(null);
  };

  const handleDeletePerson = (personType, personName) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${personName}?`)) {
      if (personType === 'contact') {
        setContacts(prev => {
          const newContacts = { ...prev };
          delete newContacts[personName];
          return newContacts;
        });
      } else {
        setParticipants(prev => {
          const newParticipants = { ...prev };
          delete newParticipants[personName];
          return newParticipants;
        });
      }
    }
  };

  const handleAddPerson = (personData) => {
    if (personData.type === 'contact') {
      setContacts(prev => ({
        ...prev,
        [personData.name]: personData.data
      }));
    } else {
      setParticipants(prev => ({
        ...prev,
        [personData.name]: personData.data
      }));
    }
    setShowAddForm(false);
    setNewPerson({ type: 'contact' });
  };

  const renderContactsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Contactos CAU</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Contacto
          </button>
          <button
            onClick={handleExportContacts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Contactos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(contacts).map(([name, contact]) => (
          <div key={name} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditPerson('contact', name, contact)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePerson('contact', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Teléfono:</strong> {contact.telefono}</p>
              <p><strong>Email:</strong> {contact.email}</p>
              <p><strong>Rol:</strong> {contact.role}</p>
              <p><strong>Estado:</strong> {contact.active ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Participantes Frecuentes</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Participante
          </button>
          <button
            onClick={handleExportParticipants}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Participantes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(participants).map(([name, participant]) => (
          <div key={name} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditPerson('participant', name, participant)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePerson('participant', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>RUT:</strong> {participant.rut}</p>
              <p><strong>Teléfono:</strong> {participant.telefono}</p>
              <p><strong>Grupo Sanguíneo:</strong> {participant.grupoSanguineo}</p>
              <p><strong>Experiencia:</strong> {participant.experiencia}</p>
              <p><strong>Estado:</strong> {participant.active ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEditModal = () => {
    if (!editMode || !editingPerson) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">
            Editar {editingPerson.type === 'contact' ? 'Contacto' : 'Participante'}
          </h3>
          <PersonForm
            person={editingPerson}
            onSave={handleSavePerson}
            onCancel={() => {
              setEditMode(false);
              setEditingPerson(null);
            }}
          />
        </div>
      </div>
    );
  };

  const renderAddModal = () => {
    if (!showAddForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">
            Agregar {newPerson.type === 'contact' ? 'Contacto' : 'Participante'}
          </h3>
          <PersonForm
            person={{ type: newPerson.type, name: '', data: {} }}
            onSave={handleAddPerson}
            onCancel={() => setShowAddForm(false)}
            isNew={true}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Personas</h1>
        <p className="text-gray-600">Administra contactos y participantes del CAU</p>
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={handleExportAll}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Exportar Todos los Datos
        </button>
        <button
          onClick={handleCreateBackup}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Crear Backup
        </button>
      </div>

      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'contacts'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Contactos CAU
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'participants'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Participantes
        </button>
      </nav>

      <div className="bg-white rounded-lg shadow">
        {activeTab === 'contacts' && renderContactsTab()}
        {activeTab === 'participants' && renderParticipantsTab()}
      </div>

      {renderEditModal()}
      {renderAddModal()}
    </div>
  );
}

// Componente para editar/agregar persona
function PersonForm({ person, onSave, onCancel, isNew = false }) {
  const [formData, setFormData] = useState({
    name: isNew ? '' : person.name,
    type: person.type,
    data: isNew ? {} : person.data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderContactForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="text"
          value={formData.data.telefono || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, telefono: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.data.email || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, email: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <input
          type="text"
          value={formData.data.role || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, role: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
    </div>
  );

  const renderParticipantForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">RUT</label>
        <input
          type="text"
          value={formData.data.rut || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, rut: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="text"
          value={formData.data.telefono || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, telefono: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Grupo Sanguíneo</label>
        <select
          value={formData.data.grupoSanguineo || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, grupoSanguineo: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Experiencia</label>
        <select
          value={formData.data.experiencia || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, experiencia: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Seleccionar</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedia">Intermedia</option>
          <option value="Avanzada">Avanzada</option>
        </select>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="contact">Contacto</option>
          <option value="participant">Participante</option>
        </select>
      </div>

      {formData.type === 'contact' ? renderContactForm() : renderParticipantForm()}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isNew ? 'Agregar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
} 
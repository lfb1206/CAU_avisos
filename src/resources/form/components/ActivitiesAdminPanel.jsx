'use client';
import React, { useState } from 'react';
import { activityEquipmentData, getAllActivities, getAllSpecificActivities } from '../../constants/activityEquipmentData';
import { exportDataToJSON } from '../../constants/dataExportUtils';

export default function ActivitiesAdminPanel() {
  const [activeTab, setActiveTab] = useState('activities');
  const [activities, setActivities] = useState(activityEquipmentData.activities);
  const [specificActivities, setSpecificActivities] = useState(activityEquipmentData.specificActivities);
  const [editMode, setEditMode] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'activity' });

  const handleExportActivities = () => {
    const data = {
      activities: activities,
      timestamp: new Date().toISOString(),
      description: 'Actividades generales exportadas'
    };
    exportDataToJSON(data, 'activities_export.json');
  };

  const handleExportSpecificActivities = () => {
    const data = {
      specificActivities: specificActivities,
      timestamp: new Date().toISOString(),
      description: 'Actividades específicas exportadas'
    };
    exportDataToJSON(data, 'specific_activities_export.json');
  };

  const handleExportAll = () => {
    const data = {
      activityEquipmentData: {
        activities: activities,
        specificActivities: specificActivities
      },
      timestamp: new Date().toISOString(),
      description: 'Todos los datos de actividades exportados'
    };
    exportDataToJSON(data, 'activities_data_export.json');
  };

  const handleEditActivity = (activityType, activityName, activityData) => {
    setEditingActivity({ type: activityType, name: activityName, data: activityData });
    setEditMode(true);
  };

  const handleSaveActivity = (updatedActivity) => {
    if (updatedActivity.type === 'activity') {
      setActivities(prev => ({
        ...prev,
        [updatedActivity.name]: updatedActivity.data
      }));
    } else {
      setSpecificActivities(prev => ({
        ...prev,
        [updatedActivity.name]: updatedActivity.data
      }));
    }
    setEditMode(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activityType, activityName) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la actividad "${activityName}"?`)) {
      if (activityType === 'activity') {
        setActivities(prev => {
          const newActivities = { ...prev };
          delete newActivities[activityName];
          return newActivities;
        });
      } else {
        setSpecificActivities(prev => {
          const newSpecificActivities = { ...prev };
          delete newSpecificActivities[activityName];
          return newSpecificActivities;
        });
      }
    }
  };

  const handleAddActivity = (activityData) => {
    if (activityData.type === 'activity') {
      setActivities(prev => ({
        ...prev,
        [activityData.name]: activityData.data
      }));
    } else {
      setSpecificActivities(prev => ({
        ...prev,
        [activityData.name]: activityData.data
      }));
    }
    setShowAddForm(false);
    setNewActivity({ type: 'activity' });
  };

  const renderActivitiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Actividades Generales</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Actividad
          </button>
          <button
            onClick={handleExportActivities}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Actividades
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(activities).map(([name, activity]) => (
          <div key={name} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditActivity('activity', name, activity)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteActivity('activity', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Categoría:</strong> {activity.category}</p>
              <p><strong>Dificultad:</strong> {activity.difficulty}</p>
              <p><strong>Equipamiento básico:</strong> {activity.basicEquipment.length} items</p>
              <p><strong>Condiciones climáticas:</strong> {Object.keys(activity.weatherEquipment).length} tipos</p>
            </div>
            <div className="mt-3">
              <h5 className="font-medium text-sm text-gray-700 mb-2">Equipamiento Básico:</h5>
              <div className="space-y-1">
                {activity.basicEquipment.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    • {item.item} ({item.category})
                  </div>
                ))}
                {activity.basicEquipment.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{activity.basicEquipment.length - 3} más...
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpecificActivitiesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Actividades Específicas</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Actividad Específica
          </button>
          <button
            onClick={handleExportSpecificActivities}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Actividades Específicas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specificActivities).map(([name, activity]) => (
          <div key={name} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditActivity('specificActivity', name, activity)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteActivity('specificActivity', name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Actividad padre:</strong> {activity.parentActivity}</p>
              <p><strong>Dificultad:</strong> {activity.difficulty}</p>
              <p><strong>Equipamiento:</strong> {activity.equipment.length} items</p>
            </div>
            <div className="mt-3">
              <h5 className="font-medium text-sm text-gray-700 mb-2">Equipamiento:</h5>
              <div className="space-y-1">
                {activity.equipment.slice(0, 3).map((item, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    • {item.item} ({item.category})
                  </div>
                ))}
                {activity.equipment.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{activity.equipment.length - 3} más...
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEditModal = () => {
    if (!editMode || !editingActivity) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Editar {editingActivity.type === 'activity' ? 'Actividad General' : 'Actividad Específica'}
          </h3>
          <ActivityForm
            activity={editingActivity}
            onSave={handleSaveActivity}
            onCancel={() => {
              setEditMode(false);
              setEditingActivity(null);
            }}
            parentActivities={Object.keys(activities)}
          />
        </div>
      </div>
    );
  };

  const renderAddModal = () => {
    if (!showAddForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Agregar {newActivity.type === 'activity' ? 'Actividad General' : 'Actividad Específica'}
          </h3>
          <ActivityForm
            activity={{ type: newActivity.type, name: '', data: {} }}
            onSave={handleAddActivity}
            onCancel={() => setShowAddForm(false)}
            parentActivities={Object.keys(activities)}
            isNew={true}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Actividades</h1>
        <p className="text-gray-600">Administra actividades y su equipamiento recomendado</p>
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={handleExportAll}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Exportar Todos los Datos
        </button>
      </div>

      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('activities')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'activities'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Actividades Generales
        </button>
        <button
          onClick={() => setActiveTab('specificActivities')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'specificActivities'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Actividades Específicas
        </button>
      </nav>

      <div className="bg-white rounded-lg shadow">
        {activeTab === 'activities' && renderActivitiesTab()}
        {activeTab === 'specificActivities' && renderSpecificActivitiesTab()}
      </div>

      {renderEditModal()}
      {renderAddModal()}
    </div>
  );
}

// Componente para editar/agregar actividad
function ActivityForm({ activity, onSave, onCancel, parentActivities = [], isNew = false }) {
  const [formData, setFormData] = useState({
    name: isNew ? '' : activity.name,
    type: activity.type,
    data: isNew ? {} : activity.data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderGeneralActivityForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la Actividad</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <input
          type="text"
          value={formData.data.category || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, category: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dificultad</label>
        <select
          value={formData.data.difficulty || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, difficulty: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Seleccionar</option>
          <option value="Baja">Baja</option>
          <option value="Baja a Media">Baja a Media</option>
          <option value="Media">Media</option>
          <option value="Media a Alta">Media a Alta</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
    </div>
  );

  const renderSpecificActivityForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la Actividad Específica</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Actividad Padre</label>
        <select
          value={formData.data.parentActivity || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, parentActivity: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Seleccionar actividad padre</option>
          {parentActivities.map(activity => (
            <option key={activity} value={activity}>{activity}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dificultad</label>
        <select
          value={formData.data.difficulty || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, difficulty: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Seleccionar</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Actividad</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="activity">Actividad General</option>
          <option value="specificActivity">Actividad Específica</option>
        </select>
      </div>

      {formData.type === 'activity' ? renderGeneralActivityForm() : renderSpecificActivityForm()}

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
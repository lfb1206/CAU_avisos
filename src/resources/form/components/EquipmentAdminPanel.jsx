'use client';
import React, { useState } from 'react';
import { equipmentData, getCategoryById, getItemsByCategory, getEssentialItems } from '../../constants/equipmentData';
import { exportDataToJSON } from '../../constants/dataExportUtils';

export default function EquipmentAdminPanel() {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState(equipmentData.categories);
  const [items, setItems] = useState(equipmentData.items);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'calzado' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleExportCategories = () => {
    const data = {
      categories: categories,
      timestamp: new Date().toISOString(),
      description: 'Categorías de equipamiento exportadas'
    };
    exportDataToJSON(data, 'equipment_categories_export.json');
  };

  const handleExportItems = () => {
    const data = {
      items: items,
      timestamp: new Date().toISOString(),
      description: 'Items de equipamiento exportados'
    };
    exportDataToJSON(data, 'equipment_items_export.json');
  };

  const handleExportAll = () => {
    const data = {
      equipmentData: {
        categories: categories,
        items: items
      },
      timestamp: new Date().toISOString(),
      description: 'Todos los datos de equipamiento exportados'
    };
    exportDataToJSON(data, 'equipment_data_export.json');
  };

  const handleEditItem = (itemName, categoryId, itemData) => {
    setEditingItem({ name: itemName, category: categoryId, data: itemData });
    setEditMode(true);
  };

  const handleSaveItem = (updatedItem) => {
    setItems(prev => ({
      ...prev,
      [updatedItem.category]: prev[updatedItem.category].map(item => 
        item.name === updatedItem.name ? updatedItem.data : item
      )
    }));
    setEditMode(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemName, categoryId) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${itemName}"?`)) {
      setItems(prev => ({
        ...prev,
        [categoryId]: prev[categoryId].filter(item => item.name !== itemName)
      }));
    }
  };

  const handleAddItem = (itemData) => {
    setItems(prev => ({
      ...prev,
      [itemData.category]: [...(prev[itemData.category] || []), itemData.data]
    }));
    setShowAddForm(false);
    setNewItem({ category: 'calzado' });
  };

  const handleEditCategory = (categoryId, categoryData) => {
    setEditingCategory({ id: categoryId, data: categoryData });
    setEditMode(true);
  };

  const handleSaveCategory = (updatedCategory) => {
    setCategories(prev => 
      prev.map(cat => cat.id === updatedCategory.id ? updatedCategory.data : cat)
    );
    setEditMode(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${getCategoryById(categoryId)?.name}"? Esto también eliminará todos sus items.`)) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setItems(prev => {
        const newItems = { ...prev };
        delete newItems[categoryId];
        return newItems;
      });
    }
  };

  const handleAddCategory = (categoryData) => {
    setCategories(prev => [...prev, categoryData]);
    setItems(prev => ({
      ...prev,
      [categoryData.id]: []
    }));
    setShowAddCategory(false);
  };

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Categorías de Equipamiento</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Categoría
          </button>
          <button
            onClick={handleExportCategories}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Categorías
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEditCategory(category.id, category)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>ID:</strong> {category.id}</p>
              <p><strong>Descripción:</strong> {category.description}</p>
              <p><strong>Items:</strong> {items[category.id]?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderItemsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Items de Equipamiento</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Agregar Item
          </button>
          <button
            onClick={handleExportItems}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Exportar Items
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Cómo marcar items como esenciales
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Para marcar un item como esencial, edítalo y marca la casilla "Item esencial". 
                Los items esenciales aparecerán en la pestaña "Items Esenciales" y se recomendarán 
                automáticamente en las actividades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items[category.id]?.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm text-gray-900">{item.name}</h5>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditItem(item.name, category.id, item)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.name, category.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>Descripción:</strong> {item.description}</p>
                  <div className="flex items-center gap-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      item.essential 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.essential ? 'Esencial' : 'Opcional'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderEssentialItemsTab = () => {
    const essentialItems = getEssentialItems();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Items Esenciales</h3>
          <div className="text-sm text-gray-600">
            Total: {essentialItems.length} items
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {essentialItems.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Esencial
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Categoría:</strong> {item.categoryName}</p>
                <p><strong>Descripción:</strong> {item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!editMode || !editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Editar Item de Equipamiento</h3>
          <ItemForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setEditMode(false);
              setEditingItem(null);
            }}
            categories={categories}
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
          <h3 className="text-lg font-semibold mb-4">Agregar Item de Equipamiento</h3>
          <ItemForm
            item={{ name: '', category: newItem.category, data: {} }}
            onSave={handleAddItem}
            onCancel={() => setShowAddForm(false)}
            categories={categories}
            isNew={true}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Equipamiento</h1>
        <p className="text-gray-600">Administra categorías e items de equipamiento</p>
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
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'categories'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Categorías
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'items'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Items
        </button>
        <button
          onClick={() => setActiveTab('essential')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'essential'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Items Esenciales
        </button>
      </nav>

      <div className="bg-white rounded-lg shadow">
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'items' && renderItemsTab()}
        {activeTab === 'essential' && renderEssentialItemsTab()}
      </div>

      {renderEditModal()}
      {renderAddModal()}

      {/* Modales para categorías */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Agregar Categoría</h3>
            <CategoryForm
              onSave={handleAddCategory}
              onCancel={() => setShowAddCategory(false)}
            />
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Editar Categoría</h3>
            <CategoryForm
              category={editingCategory.data}
              onSave={(data) => handleSaveCategory({ id: editingCategory.id, data })}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para formulario de categorías
function CategoryForm({ category = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: category.id || '',
    name: category.name || '',
    description: category.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ID de Categoría</label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="ej: electronica"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="ej: Electrónica"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows="3"
          placeholder="ej: Dispositivos electrónicos y de comunicación"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
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
          Guardar
        </button>
      </div>
    </form>
  );
}

// Componente para editar/agregar item
function ItemForm({ item, onSave, onCancel, categories = [], isNew = false }) {
  const [formData, setFormData] = useState({
    name: isNew ? '' : item.name,
    category: item.category,
    data: isNew ? {} : item.data
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Item</label>
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
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={formData.data.description || ''}
          onChange={(e) => setFormData({
            ...formData,
            data: { ...formData.data, description: e.target.value }
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.data.essential || false}
            onChange={(e) => setFormData({
              ...formData,
              data: { ...formData.data, essential: e.target.checked }
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Item esencial</span>
        </label>
      </div>

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
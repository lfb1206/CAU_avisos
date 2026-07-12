'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface EquipmentItem {
  id: number;
  category: string;
  name: string;
  active: boolean;
}

type ItemDraft = Omit<EquipmentItem, 'id'>;

const emptyDraft = (): ItemDraft => ({ category: '', name: '', active: true });

export default function EquipmentAdminPanel() {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/equipment');
      if (res.status === 403) { setError('Se requieren permisos de administrador.'); return; }
      if (!res.ok) { setError('Error al cargar equipamiento.'); return; }
      setItems(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = Array.from(new Set(items.map((i) => i.category))).sort();

  const handleSave = async (draft: ItemDraft, id?: number) => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/equipment/${id}` : '/api/admin/equipment', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) { alert('Error al guardar. Intenta nuevamente.'); return; }
      await load();
      setEditingItem(null);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: EquipmentItem) => {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    await fetch(`/api/admin/equipment/${item.id}`, { method: 'DELETE' });
    await load();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ items, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'equipment_export.json'; a.click();
  };

  const filtered = items.filter((i) => {
    const matchesCategory = !selectedCategory || i.category === selectedCategory;
    const matchesSearch = !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const grouped = categories.reduce<Record<string, EquipmentItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.category === cat);
    return acc;
  }, {});

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando equipamiento...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Equipamiento</h1>
        <p className="text-gray-600">{items.length} items · {categories.length} categorías</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Agregar item
        </button>
        <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Exportar JSON
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catItems]) => {
          if (catItems.length === 0 && selectedCategory && selectedCategory !== category) return null;
          return (
            <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-800 capitalize">{category}</h3>
                <p className="text-xs text-gray-500">{catItems.length} items</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-100">
                {catItems.map((item) => (
                  <div key={item.id} className="bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                        <span className={`text-xs ${item.active ? 'text-green-600' : 'text-gray-400'}`}>
                          {item.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-800 text-xs">Editar</button>
                        <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800 text-xs">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">Sin resultados</div>
        )}
      </div>

      {(editingItem || showAddForm) && (
        <ItemModal
          item={editingItem ?? undefined}
          categories={categories}
          saving={saving}
          onSave={(draft) => handleSave(draft, editingItem?.id)}
          onClose={() => { setEditingItem(null); setShowAddForm(false); }}
        />
      )}
    </div>
  );
}

function ItemModal({
  item,
  categories,
  saving,
  onSave,
  onClose,
}: {
  item?: EquipmentItem;
  categories: string[];
  saving: boolean;
  onSave: (draft: ItemDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ItemDraft>(
    item ? { category: item.category, name: item.name, active: item.active }
         : emptyDraft()
  );
  const [newCategory, setNewCategory] = useState('');
  const useNewCategory = draft.category === '__new__';

  const set = (field: keyof ItemDraft, value: string | boolean) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDraft = { ...draft, category: useNewCategory ? newCategory.trim() : draft.category };
    onSave(finalDraft);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{item ? 'Editar item' : 'Agregar item'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              value={draft.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required={!useNewCategory}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="__new__">+ Nueva categoría...</option>
            </select>
            {useNewCategory && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del item *</label>
            <input required value={draft.name} onChange={(e) => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">Item activo</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Guardando...' : (item ? 'Guardar' : 'Agregar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';
import React, { useCallback, useEffect, useState } from 'react';
import type { InventoryItem, ItemCondition } from '@/types';

type ItemDraft = Omit<InventoryItem, 'id' | 'pool_id' | 'disponible'>;

const emptyDraft = (): ItemDraft => ({
  uso: '',
  descripcion: '',
  cantidad: 1,
  estado: 'bueno',
  en_inspeccion: 0,
  fecha_compra: null,
  observaciones: null,
  active: true,
});

const estadoLabel: Record<ItemCondition, string> = {
  nuevo: 'Nuevo',
  bueno: 'Bueno',
  con_uso: 'Con uso',
  gastado: 'Gastado',
  roto: 'Roto',
};

const estadoColor: Record<ItemCondition, string> = {
  nuevo: 'bg-green-100 text-green-700',
  bueno: 'bg-blue-100 text-blue-700',
  con_uso: 'bg-yellow-100 text-yellow-700',
  gastado: 'bg-orange-100 text-orange-700',
  roto: 'bg-red-100 text-red-700',
};

export default function InventoryCatalogPanel() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/custodio/items');
      if (res.status === 403) { setError('Se requieren permisos de custodio.'); return; }
      if (!res.ok) { setError('Error al cargar el catálogo.'); return; }
      setItems(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = Array.from(new Set(items.map((i) => i.uso))).sort();

  const handleSave = async (draft: ItemDraft, id?: number) => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/custodio/items/${id}` : '/api/custodio/items', {
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

  const handleRetire = async (item: InventoryItem) => {
    if (!confirm(`¿Retirar "${item.descripcion}" del catálogo? Seguirá apareciendo en el historial de préstamos.`)) return;
    await fetch(`/api/custodio/items/${item.id}`, { method: 'DELETE' });
    await load();
  };

  const filtered = items.filter((i) => !searchQuery || i.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
  const grouped = categories.reduce<Record<string, InventoryItem[]>>((acc, cat) => {
    acc[cat] = filtered.filter((i) => i.uso === cat);
    return acc;
  }, {});

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando catálogo...</div>;
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Catálogo de Equipo Club</h1>
        <p className="text-gray-500 text-sm">{items.length} ítems · {categories.length} categorías</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar ítem..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Agregar ítem
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-800">{category}</h3>
              <p className="text-xs text-gray-500">{catItems.length} ítems</p>
            </div>
            <div className="divide-y divide-gray-100">
              {catItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-gray-900 truncate">{item.descripcion}</p>
                      {!item.active && <span className="text-xs text-gray-400 flex-shrink-0">(retirado)</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${estadoColor[item.estado]}`}>{estadoLabel[item.estado]}</span>
                      <span className="text-xs text-gray-500">
                        {item.disponible ?? 0}/{item.cantidad} disponible{item.en_inspeccion > 0 ? ` · ${item.en_inspeccion} en inspección` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0 text-xs">
                    <button onClick={() => setHistoryItem(item)} className="text-gray-500 hover:text-gray-700">Historial</button>
                    <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-800">Editar</button>
                    {item.active && (
                      <button onClick={() => handleRetire(item)} className="text-red-600 hover:text-red-800">Retirar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Sin resultados</div>}
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

      {historyItem && <ItemHistoryModal item={historyItem} onClose={() => setHistoryItem(null)} />}
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
  item?: InventoryItem;
  categories: string[];
  saving: boolean;
  onSave: (draft: ItemDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ItemDraft>(
    item
      ? {
          uso: item.uso,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          estado: item.estado,
          en_inspeccion: item.en_inspeccion,
          fecha_compra: item.fecha_compra ? item.fecha_compra.split('T')[0] : null,
          observaciones: item.observaciones,
          active: item.active,
        }
      : emptyDraft()
  );
  const [newCategory, setNewCategory] = useState('');
  const useNewCategory = draft.uso === '__new__';

  const set = <K extends keyof ItemDraft>(field: K, value: ItemDraft[K]) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...draft, uso: useNewCategory ? newCategory.trim() : draft.uso });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{item ? 'Editar ítem' : 'Agregar ítem'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              value={draft.uso}
              onChange={(e) => set('uso', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <input required value={draft.descripcion} onChange={(e) => set('descripcion', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad total *</label>
              <input type="number" min={0} required value={draft.cantidad}
                onChange={(e) => set('cantidad', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">En inspección</label>
              <input type="number" min={0} value={draft.en_inspeccion}
                onChange={(e) => set('en_inspeccion', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select value={draft.estado} onChange={(e) => set('estado', e.target.value as ItemCondition)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              {Object.entries(estadoLabel).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de compra</label>
            <input type="date" value={draft.fecha_compra ?? ''} onChange={(e) => set('fecha_compra', e.target.value || null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea value={draft.observaciones ?? ''} onChange={(e) => set('observaciones', e.target.value || null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={2} />
          </div>
          {item && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">Ítem activo en el catálogo</span>
            </label>
          )}
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

interface LoanHistoryEntry {
  id: number;
  quantity: number;
  loan_request: {
    id: number;
    status: string;
    requested_at: string;
    returned_at: string | null;
    user: { name: string; email: string };
  };
}

function ItemHistoryModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [history, setHistory] = useState<LoanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/custodio/items/${item.id}/historial`)
      .then((res) => res.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [item.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Historial: {item.descripcion}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Cargando...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin préstamos registrados para este ítem.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div key={entry.id} className="border border-gray-100 rounded-md p-3 text-sm">
                  <p className="font-medium text-gray-900">{entry.loan_request.user.name || entry.loan_request.user.email}</p>
                  <p className="text-xs text-gray-500">
                    x{entry.quantity} · {entry.loan_request.status} · {new Date(entry.loan_request.requested_at).toLocaleDateString('es-CL')}
                    {entry.loan_request.returned_at && ` → devuelto ${new Date(entry.loan_request.returned_at).toLocaleDateString('es-CL')}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface Activity {
  id: number;
  name: string;
  equipment_recommendations: Record<string, unknown> | null;
}

type ActivityDraft = Omit<Activity, 'id'>;

const emptyDraft = (): ActivityDraft => ({ name: '', equipment_recommendations: null });

export default function ActivitiesAdminPanel() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/activities');
      if (res.status === 403) { setError('Se requieren permisos de administrador.'); return; }
      if (!res.ok) { setError('Error al cargar actividades.'); return; }
      setActivities(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (draft: ActivityDraft, id?: number) => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/activities/${id}` : '/api/admin/activities', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) { alert('Error al guardar. Intenta nuevamente.'); return; }
      await load();
      setEditingActivity(null);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity: Activity) => {
    if (!confirm(`¿Eliminar la actividad "${activity.name}"?`)) return;
    await fetch(`/api/admin/activities/${activity.id}`, { method: 'DELETE' });
    await load();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ activities, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'activities_export.json'; a.click();
  };

  const filtered = activities.filter((a) =>
    !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando actividades...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Actividades</h1>
        <p className="text-gray-600">{activities.length} actividades en total</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar actividad..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Agregar actividad
        </button>
        <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Exportar JSON
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actividad</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Recomendaciones equipo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">Sin resultados</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {a.equipment_recommendations
                    ? `${Object.keys(a.equipment_recommendations).length} entradas`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingActivity(a)} className="text-blue-600 hover:text-blue-800 mr-3 text-xs">Editar</button>
                  <button onClick={() => handleDelete(a)} className="text-red-600 hover:text-red-800 text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingActivity || showAddForm) && (
        <ActivityModal
          activity={editingActivity ?? undefined}
          saving={saving}
          onSave={(draft) => handleSave(draft, editingActivity?.id)}
          onClose={() => { setEditingActivity(null); setShowAddForm(false); }}
        />
      )}
    </div>
  );
}

function ActivityModal({
  activity,
  saving,
  onSave,
  onClose,
}: {
  activity?: Activity;
  saving: boolean;
  onSave: (draft: ActivityDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ActivityDraft>(
    activity
      ? { name: activity.name, equipment_recommendations: activity.equipment_recommendations }
      : emptyDraft()
  );
  const [jsonText, setJsonText] = useState(
    activity?.equipment_recommendations ? JSON.stringify(activity.equipment_recommendations, null, 2) : ''
  );
  const [jsonError, setJsonError] = useState('');

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      setJsonError('');
      setDraft((prev) => ({ ...prev, equipment_recommendations: null }));
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setJsonError('');
      setDraft((prev) => ({ ...prev, equipment_recommendations: parsed }));
    } catch {
      setJsonError('JSON inválido');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{activity ? 'Editar actividad' : 'Agregar actividad'}</h3>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (!jsonError) onSave(draft); }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recomendaciones de equipo (JSON)
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={6}
              placeholder={'{\n  "basico": ["Cuerda", "Arnés"],\n  "invierno": ["Crampones"]\n}'}
              className={`w-full border rounded-md px-3 py-2 text-xs font-mono ${jsonError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving || !!jsonError}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Guardando...' : (activity ? 'Guardar' : 'Agregar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

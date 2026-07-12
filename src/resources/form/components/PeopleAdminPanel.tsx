'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface Person {
  id: number;
  name: string;
  rut: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
}

type PersonDraft = Omit<Person, 'id'>;

const emptyDraft = (): PersonDraft => ({ name: '', rut: '', phone: '', email: '', active: true });

export default function PeopleAdminPanel() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/people');
      if (res.status === 403) { setError('Se requieren permisos de administrador.'); return; }
      if (!res.ok) { setError('Error al cargar participantes.'); return; }
      setPeople(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (draft: PersonDraft, id?: number) => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/people/${id}` : '/api/admin/people', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) { alert('Error al guardar. Intenta nuevamente.'); return; }
      await load();
      setEditingPerson(null);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (person: Person) => {
    if (!confirm(`¿Eliminar a ${person.name}?`)) return;
    await fetch(`/api/admin/people/${person.id}`, { method: 'DELETE' });
    await load();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ people, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'people_export.json'; a.click();
  };

  const filtered = people.filter((p) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.rut ?? '').includes(searchQuery)
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando participantes...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Participantes</h1>
        <p className="text-gray-600">{people.length} participantes en total</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Agregar participante
        </button>
        <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          Exportar JSON
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">RUT</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Sin resultados</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.rut ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.phone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.email ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingPerson(p)} className="text-blue-600 hover:text-blue-800 mr-3 text-xs">Editar</button>
                  <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800 text-xs">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingPerson || showAddForm) && (
        <PersonModal
          person={editingPerson ?? undefined}
          saving={saving}
          onSave={(draft) => handleSave(draft, editingPerson?.id)}
          onClose={() => { setEditingPerson(null); setShowAddForm(false); }}
        />
      )}
    </div>
  );
}

function PersonModal({
  person,
  saving,
  onSave,
  onClose,
}: {
  person?: Person;
  saving: boolean;
  onSave: (draft: PersonDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<PersonDraft>(
    person ? { name: person.name, rut: person.rut ?? '', phone: person.phone ?? '', email: person.email ?? '', active: person.active }
           : emptyDraft()
  );

  const set = (field: keyof PersonDraft, value: string | boolean) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{person ? 'Editar participante' : 'Agregar participante'}</h3>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(draft); }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input required value={draft.name} onChange={(e) => set('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
              <input value={draft.rut ?? ''} onChange={(e) => set('rut', e.target.value)}
                placeholder="12.345.678-9"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input value={draft.phone ?? ''} onChange={(e) => set('phone', e.target.value)}
                placeholder="+56 9 xxxx xxxx"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={draft.email ?? ''} onChange={(e) => set('email', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">Participante activo</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Guardando...' : (person ? 'Guardar' : 'Agregar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

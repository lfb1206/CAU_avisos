'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface ProfileEntry {
  id: string;
  email: string;
  name: string;
  role: string;
  is_registered: boolean;
  created_at: string;
}

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  coordinador: 'Coordinador',
  member: 'Socio',
};

const roleColor: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  coordinador: 'bg-blue-100 text-blue-700',
  member: 'bg-gray-100 text-gray-600',
};

export default function PeopleAdminPanel() {
  const [profiles, setProfiles] = useState<ProfileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/people');
      if (res.status === 403) { setError('Se requieren permisos de administrador.'); return; }
      if (!res.ok) { setError('Error al cargar socios.'); return; }
      setProfiles(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      const res = await fetch('/api/admin/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? 'Error al agregar.'); return; }
      setNewEmail('');
      await load();
    } catch {
      setAddError('Error de conexión.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (profile: ProfileEntry) => {
    if (!confirm(`¿Eliminar el acceso de ${profile.email}?`)) return;
    const res = await fetch(`/api/admin/people/${profile.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? 'No se pudo eliminar.');
      return;
    }
    await load();
  };

  const pending = profiles.filter((p) => !p.is_registered && (!search || p.email.includes(search)));
  const registered = profiles.filter((p) => p.is_registered && (!search || p.email.includes(search) || p.name.toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando socios…</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Socios Autorizados</h1>
        <p className="text-gray-500 text-sm">
          Agrega el correo de un socio para permitirle registrarse. El administrador no puede editar datos personales — cada socio gestiona su propio perfil.
        </p>
      </div>

      {/* Add email form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Autorizar nuevo correo</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setAddError(''); }}
            placeholder="socio@ejemplo.cl"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={adding || !newEmail.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {adding ? 'Agregando…' : 'Agregar'}
          </button>
        </form>
        {addError && <p className="mt-2 text-sm text-red-600">{addError}</p>}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por nombre o correo…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      {/* Pending registration */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Pendientes de registro ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Sin correos pendientes.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-gray-800">{p.email}</span>
                  <span className="ml-3 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Sin registrar</span>
                </div>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Quitar acceso
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Registered members */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Registrados ({registered.length})
        </h2>
        {registered.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Sin socios registrados.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {registered.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900">
                    {p.name || <span className="text-gray-400 italic">Sin nombre</span>}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">{p.email}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColor[p.role] ?? 'bg-gray-100 text-gray-500'}`}>
                  {roleLabel[p.role] ?? p.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

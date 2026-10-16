'use client';
import React, { useState, useEffect, useCallback } from 'react';

interface ProfileEntry {
  id: string;
  email: string;
  name: string;
  role: string;
  is_registered: boolean;
  created_at: string;
  membership_expires_at: string | null;
}

interface Pool {
  id: number;
  key: string;
  name: string;
  custodian_id: string | null;
  custodian: { id: string; name: string; email: string } | null;
}

const roleLabel: Record<string, string> = {
  admin: 'Admin',
  coordinador: 'Coordinador',
  custodio: 'Custodio',
  member: 'Socio',
};

const roleColor: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  coordinador: 'bg-blue-100 text-blue-700',
  custodio: 'bg-teal-100 text-teal-700',
  member: 'bg-gray-100 text-gray-600',
};

function isMembershipActive(expiresAt: string | null): boolean {
  return !!expiresAt && new Date(expiresAt) > new Date();
}

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

  const updateProfile = async (profile: ProfileEntry, data: { role?: string; membership_expires_at?: string | null }) => {
    const res = await fetch(`/api/admin/people/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? 'No se pudo actualizar.');
      return;
    }
    await load();
  };

  const handleRenewMembership = (profile: ProfileEntry) => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    updateProfile(profile, { membership_expires_at: oneYearFromNow.toISOString() });
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

      <PoolCustodianSection registered={registered} />

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
            {registered.map((p) => {
              const active = isMembershipActive(p.membership_expires_at);
              return (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-900">
                      {p.name || <span className="text-gray-400 italic">Sin nombre</span>}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                      title={p.membership_expires_at ? new Date(p.membership_expires_at).toLocaleDateString('es-CL') : undefined}
                    >
                      {active
                        ? `Vigente hasta ${new Date(p.membership_expires_at!).toLocaleDateString('es-CL')}`
                        : 'Sin membresía vigente'}
                    </span>
                    <button
                      onClick={() => handleRenewMembership(p)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Renovar 1 año
                    </button>
                    {active && (
                      <button
                        onClick={() => updateProfile(p, { membership_expires_at: null })}
                        className="text-xs text-gray-400 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    )}
                    <select
                      value={p.role}
                      onChange={(e) => updateProfile(p, { role: e.target.value })}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${roleColor[p.role] ?? 'bg-gray-100 text-gray-500'}`}
                    >
                      {Object.entries(roleLabel).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function PoolCustodianSection({ registered }: { registered: ProfileEntry[] }) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/pools');
      if (!res.ok) { setError('Error al cargar los pools de equipo.'); return; }
      setPools(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAssign = async (pool: Pool, custodianId: string) => {
    const res = await fetch(`/api/admin/pools/${pool.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custodian_id: custodianId || null }),
    });
    if (!res.ok) { alert('No se pudo asignar el custodio.'); return; }
    await load();
  };

  if (loading || error || pools.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Custodios de equipo</h2>
      <p className="text-xs text-gray-500 mb-3">
        Quien administra el catálogo y las solicitudes de préstamo de cada pool de equipo. Asignar un custodio también requiere darle el rol &quot;Custodio&quot; más abajo.
      </p>
      <div className="space-y-2">
        {pools.map((pool) => (
          <div key={pool.id} className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">{pool.name}</span>
            <select
              value={pool.custodian_id ?? ''}
              onChange={(e) => handleAssign(pool, e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="">Sin asignar</option>
              {registered.map((p) => (
                <option key={p.id} value={p.id}>{p.name || p.email}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

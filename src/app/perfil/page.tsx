'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const inscripcionStatusLabel: Record<string, string> = {
  postulando: 'Postulando',
  aceptado: 'Aceptado',
  en_lista: 'En lista',
  rechazado: 'Rechazado',
  no_asiste: 'No asiste',
  completado: 'Completado',
  reprobado: 'Reprobado',
  retirado: 'Retirado',
  rezagado: 'Rezagado',
};

const inscripcionStatusColor: Record<string, string> = {
  postulando: 'bg-yellow-100 text-yellow-700',
  aceptado: 'bg-blue-100 text-blue-700',
  en_lista: 'bg-orange-100 text-orange-700',
  rechazado: 'bg-red-100 text-red-700',
  no_asiste: 'bg-gray-100 text-gray-500',
  completado: 'bg-green-100 text-green-700',
  reprobado: 'bg-red-100 text-red-700',
  retirado: 'bg-gray-100 text-gray-500',
  rezagado: 'bg-purple-100 text-purple-700',
};

const roleLabel: Record<string, string> = {
  admin: 'Administrador',
  coordinador: 'Coordinador',
  member: 'Socio',
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

type ProfileData = {
  name: string;
  phone: string | null;
  rut: string | null;
  blood_type: string | null;
  allergies: string | null;
  medications: string | null;
  medical_conditions: string | null;
  has_first_aid: boolean;
  emergency_contact: string | null;
  emergency_phone: string | null;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500';

function EditProfileForm({ profile, onClose }: { profile: ProfileData; onClose: () => void }) {
  const [form, setForm] = useState<ProfileData>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof ProfileData, value: string | boolean | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      phone: form.phone || null,
      rut: form.rut || null,
      blood_type: form.blood_type || null,
      allergies: form.allergies || null,
      medications: form.medications || null,
      medical_conditions: form.medical_conditions || null,
      has_first_aid: form.has_first_aid,
      emergency_contact: form.emergency_contact || null,
      emergency_phone: form.emergency_phone || null,
    };
    const res = await fetch('/api/perfil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      mutate('/api/perfil');
      onClose();
    } else {
      setError('No se pudo guardar. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos personales</p>
        <Field label="Nombre completo">
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="RUT">
            <input type="text" value={form.rut ?? ''} onChange={(e) => set('rut', e.target.value)} placeholder="12.345.678-9" className={inputClass} />
          </Field>
          <Field label="Teléfono">
            <input type="text" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+56 9 1234 5678" className={inputClass} />
          </Field>
        </div>
      </div>

      {/* Medical */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Información médica</p>
        <Field label="Grupo sanguíneo">
          <select value={form.blood_type ?? ''} onChange={(e) => set('blood_type', e.target.value || null)} className={inputClass}>
            <option value="">Sin especificar</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Alergias">
          <textarea value={form.allergies ?? ''} onChange={(e) => set('allergies', e.target.value)} rows={2} placeholder="Ej: Polen, polvo, penicilina…" className={inputClass} />
        </Field>
        <Field label="Medicamentos habituales">
          <textarea value={form.medications ?? ''} onChange={(e) => set('medications', e.target.value)} rows={2} placeholder="Ej: Ventolín, insulina…" className={inputClass} />
        </Field>
        <Field label="Condiciones especiales">
          <textarea value={form.medical_conditions ?? ''} onChange={(e) => set('medical_conditions', e.target.value)} rows={2} placeholder="Ej: Asma, diabetes, hipertensión…" className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.has_first_aid} onChange={(e) => set('has_first_aid', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
          <span className="text-sm text-gray-700">Tengo conocimientos de primeros auxilios</span>
        </label>
      </div>

      {/* Emergency contact */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contacto de emergencia</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre">
            <input type="text" value={form.emergency_contact ?? ''} onChange={(e) => set('emergency_contact', e.target.value)} placeholder="Nombre apellido" className={inputClass} />
          </Field>
          <Field label="Teléfono">
            <input type="text" value={form.emergency_phone ?? ''} onChange={(e) => set('emergency_phone', e.target.value)} placeholder="+56 9 1234 5678" className={inputClass} />
          </Field>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !form.name.trim()}
          className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const { data, isLoading } = useSWR('/api/perfil', fetcher);
  const [editing, setEditing] = useState(false);

  const profile = data?.profile;
  const inscripciones: {
    id: number;
    status: string;
    inscrito_at: string;
    edicion: { name: string; taller: { id: number; name: string; branch: string } };
  }[] = data?.inscripciones ?? [];
  const pointsHistory: {
    id: number;
    points: number;
    description: string | null;
    earned_at: string;
    expires_at: string;
    edicion?: { taller?: { name: string } } | null;
  }[] = data?.pointsHistory ?? [];

  const now = new Date();
  const activePoints = pointsHistory
    .filter((p) => new Date(p.expires_at) > now)
    .reduce((sum, p) => sum + p.points, 0);

  const tallerMap = new Map<number, { name: string; branch: string; status: string }>();
  for (const insc of inscripciones) {
    const t = insc.edicion.taller;
    const existing = tallerMap.get(t.id);
    if (!existing || insc.status === 'completado') {
      tallerMap.set(t.id, { name: t.name, branch: t.branch, status: insc.status });
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold flex-shrink-0">
              {(profile.name || profile.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile.name || <span className="text-gray-400 italic">Sin nombre</span>}</h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {roleLabel[profile.role] ?? profile.role}
              </span>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Editar
            </button>
          )}
        </div>

        {editing ? (
          <EditProfileForm profile={profile} onClose={() => setEditing(false)} />
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">RUT</span>
                <p className="font-medium text-gray-900">{profile.rut ?? '—'}</p>
              </div>
              <div>
                <span className="text-gray-500">Teléfono</span>
                <p className="font-medium text-gray-900">{profile.phone ?? '—'}</p>
              </div>
            </div>

            {(profile.blood_type || profile.allergies || profile.medications || profile.medical_conditions) && (
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Grupo sanguíneo</span>
                  <p className="font-medium text-gray-900">{profile.blood_type ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Primeros auxilios</span>
                  <p className="font-medium text-gray-900">{profile.has_first_aid ? 'Sí' : 'No'}</p>
                </div>
                {profile.allergies && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Alergias</span>
                    <p className="font-medium text-gray-900">{profile.allergies}</p>
                  </div>
                )}
                {profile.medications && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Medicamentos</span>
                    <p className="font-medium text-gray-900">{profile.medications}</p>
                  </div>
                )}
                {profile.medical_conditions && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Condiciones especiales</span>
                    <p className="font-medium text-gray-900">{profile.medical_conditions}</p>
                  </div>
                )}
              </div>
            )}

            {(profile.emergency_contact || profile.emergency_phone) && (
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Contacto de emergencia</span>
                  <p className="font-medium text-gray-900">{profile.emergency_contact ?? '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Teléfono emergencia</span>
                  <p className="font-medium text-gray-900">{profile.emergency_phone ?? '—'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Points summary */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-purple-900">Puntos de Formación</h2>
          <span className="text-3xl font-bold text-purple-700">{activePoints}</span>
        </div>
        <p className="text-xs text-purple-600 mb-4">
          Los puntos se obtienen siendo Ayudante en talleres y vencen al año de ser otorgados.
        </p>
        {pointsHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no tienes puntos registrados.</p>
        ) : (
          <div className="space-y-2">
            {pointsHistory.map((entry) => {
              const expired = new Date(entry.expires_at) <= now;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${expired ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'}`}
                >
                  <div>
                    <span className="font-medium">
                      {entry.edicion?.taller?.name ?? 'Puntos manuales'}
                    </span>
                    {entry.description && (
                      <span className="text-xs ml-2 text-gray-400">— {entry.description}</span>
                    )}
                    <div className="text-xs text-gray-400">
                      Vence: {new Date(entry.expires_at).toLocaleDateString('es-CL')}
                      {expired && ' (vencido)'}
                    </div>
                  </div>
                  <span className={`font-bold ${expired ? 'text-gray-400' : 'text-purple-700'}`}>
                    +{entry.points}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boletín de talleres */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Boletín de Talleres</h2>
        {tallerMap.size === 0 ? (
          <p className="text-sm text-gray-500">Aún no te has postulado a ningún taller.</p>
        ) : (
          <div className="space-y-2">
            {Array.from(tallerMap.entries()).map(([tallerId, info]) => (
              <div key={tallerId} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-800 font-medium">{info.name}</span>
                  <span className="ml-2 text-xs text-gray-400 capitalize">
                    {info.branch.replace('_', '/')}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColor[info.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {inscripcionStatusLabel[info.status] ?? info.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de postulaciones */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Historial de postulaciones</h2>
        {inscripciones.length === 0 ? (
          <p className="text-sm text-gray-500">Sin postulaciones registradas.</p>
        ) : (
          <div className="space-y-2">
            {inscripciones.map((insc) => (
              <div key={insc.id} className="flex items-center justify-between text-sm py-1">
                <div>
                  <span className="text-gray-800">{insc.edicion.taller.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{insc.edicion.name}</span>
                  <div className="text-xs text-gray-400">
                    {new Date(insc.inscrito_at).toLocaleDateString('es-CL')}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColor[insc.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {inscripcionStatusLabel[insc.status] ?? insc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

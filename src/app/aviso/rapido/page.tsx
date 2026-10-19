'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AutocompleteInput from '@/resources/form/components/AutocompleteInput';
import PrintViewRapido from '@/resources/form/components/PrintViewRapido';
import type { Participant as Participante } from '@/types';

const CATEGORIAS = [
  'Alta montaña',
  'Escalada deportiva',
  'Escalada en roca',
  'Escalada en hielo',
  'Trekking',
  'Senderismo',
  'Esquí / Snowboard',
  'Otro',
];

interface Vehiculo {
  marca: string;
  modelo: string;
  patente: string;
  color: string;
}

export interface RapidoFormData {
  // Step 1
  categoria: string;
  cerro: string;
  ruta: string;
  fechaInicio: string;
  fechaMaxRegreso: string;
  contactoCau: string;
  destinatariosAdicionales: string[];
  comentarios: string;
  // Step 2
  participantes: Participante[];
  vehiculos: Vehiculo[];
  lugarEstacionamiento: string;
  otroTransporte: string;
}

type FormData = RapidoFormData;

const emptyParticipante = (): Participante => ({ nombre: '', rut: '', telefono: '', email: '' });
const emptyVehiculo = (): Vehiculo => ({ marca: '', modelo: '', patente: '', color: '' });

const initialForm: FormData = {
  categoria: '',
  cerro: '',
  ruta: '',
  fechaInicio: '',
  fechaMaxRegreso: '',
  contactoCau: '',
  destinatariosAdicionales: [],
  comentarios: '',
  participantes: [emptyParticipante()],
  vehiculos: [],
  lugarEstacionamiento: '',
  otroTransporte: '',
};

const LS_KEY = 'cau_aviso_rapido_draft';

function AvisoRapidoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const avisoId = searchParams.get('id'); // populated when cloning from library

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [people, setPeople] = useState<{ name: string; email: string }[]>([]);
  const [showPrintView, setShowPrintView] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');

  // Load draft from localStorage or from existing aviso (clone case)
  useEffect(() => {
    if (avisoId) {
      fetch(`/api/avisos/${avisoId}`)
        .then((r) => r.json())
        .then((data) => {
          // Merge over initialForm instead of replacing it outright — an aviso
          // created before a field like destinatariosAdicionales existed would
          // otherwise load with that field missing entirely and crash on render.
          if (data.form_data) setForm({ ...initialForm, ...(data.form_data as Partial<FormData>) });
        })
        .catch(() => {});
    } else {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setForm({ ...initialForm, ...(JSON.parse(saved) as Partial<FormData>) });
    }

    fetch('/api/members')
      .then((r) => r.json())
      .then((data: { members?: { name: string; email: string }[] }) =>
        setPeople(Array.isArray(data?.members) ? data.members : [])
      )
      .catch(() => {});
  }, [avisoId]);

  // Save to localStorage on every change
  useEffect(() => {
    if (!avisoId) localStorage.setItem(LS_KEY, JSON.stringify(form));
  }, [form, avisoId]);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setParticipante = (idx: number, field: keyof Participante, value: string) =>
    setForm((prev) => {
      const arr = [...prev.participantes];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, participantes: arr };
    });

  const setVehiculo = (idx: number, field: keyof Vehiculo, value: string) =>
    setForm((prev) => {
      const arr = [...prev.vehiculos];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, vehiculos: arr };
    });

  const addRecipient = () => {
    const email = newRecipient.trim().toLowerCase();
    if (!email || !/\S+@\S+\.\S+/.test(email) || form.destinatariosAdicionales.includes(email)) return;
    set('destinatariosAdicionales', [...form.destinatariosAdicionales, email]);
    setNewRecipient('');
  };

  const removeRecipient = (email: string) =>
    set('destinatariosAdicionales', form.destinatariosAdicionales.filter((r) => r !== email));

  const fillFromPerson = (idx: number, personName: string) => {
    const p = people.find((p) => p.name === personName);
    if (!p) return;
    setForm((prev) => {
      const arr = [...prev.participantes];
      arr[idx] = {
        nombre: p.name,
        rut: '',
        telefono: '',
        email: p.email,
      };
      return { ...prev, participantes: arr };
    });
  };

  const step1Valid =
    form.categoria && form.cerro && form.ruta && form.fechaInicio && form.fechaMaxRegreso && form.contactoCau;

  const step2Valid = form.participantes.length > 0 && form.participantes.every((p) => p.nombre.trim());

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Create or update the aviso
      let id = avisoId ? Number(avisoId) : null;
      const title = `${form.categoria || 'Aviso'} — ${form.cerro}`;

      if (!id) {
        const res = await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, tipo: 'rapido', form_data: form }),
        });
        const data = await res.json();
        id = data.id;
      } else {
        await fetch(`/api/avisos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, form_data: form }),
        });
      }

      // Submit
      const submitRes = await fetch(`/api/avisos/${id}/submit`, { method: 'POST' });
      if (submitRes.ok) {
        localStorage.removeItem(LS_KEY);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('[aviso rapido submit]:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/dashboard" className="hover:text-blue-600">Panel</a>
          <span>/</span>
          <span className="text-gray-800 font-medium">Aviso Rápido</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Aviso Rápido</h1>
        <p className="text-gray-500 text-sm mt-1">
          Para salidas de día o actividades cortas sin pernocte.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { n: 1, label: 'Actividad' },
          { n: 2, label: 'Participantes' },
        ].map(({ n, label }) => (
          <React.Fragment key={n}>
            {n > 1 && <div className={`flex-1 h-px ${step >= n ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {n}
              </div>
              <span className={`text-sm font-medium ${step === n ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de actividad *</label>
            <select
              value={form.categoria}
              onChange={(e) => set('categoria', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar…</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cerro / Sector *</label>
              <input
                value={form.cerro}
                onChange={(e) => set('cerro', e.target.value)}
                placeholder="Ej: Tupungato"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ruta *</label>
              <input
                value={form.ruta}
                onChange={(e) => set('ruta', e.target.value)}
                placeholder="Ej: Ruta Normal"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de inicio *</label>
              <input
                type="datetime-local"
                value={form.fechaInicio}
                onChange={(e) => set('fechaInicio', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plazo máximo de regreso *</label>
              <input
                type="datetime-local"
                value={form.fechaMaxRegreso}
                onChange={(e) => set('fechaMaxRegreso', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <AutocompleteInput
              label="Contacto CAU *"
              value={form.contactoCau}
              onChange={(val) => set('contactoCau', val)}
              options={people.map((p) => p.name)}
              placeholder="Nombre del socio de guardia"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Destinatarios adicionales (opcional)</label>
            <p className="text-xs text-gray-500">
              Este aviso no recolecta un correo de contacto propio — si no agregas al menos uno aquí, no se enviará ningún correo de confirmación ni de alerta.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRecipient(); } }}
                placeholder="correo@ejemplo.cl"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addRecipient}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                + Agregar
              </button>
            </div>
            {form.destinatariosAdicionales.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.destinatariosAdicionales.map((email) => (
                  <span key={email} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {email}
                    <button type="button" onClick={() => removeRecipient(email)} className="text-gray-400 hover:text-red-600">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
            <textarea
              value={form.comentarios}
              onChange={(e) => set('comentarios', e.target.value)}
              rows={3}
              placeholder="Observaciones, planes de contingencia, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            className="w-full py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Siguiente: Participantes →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Participantes *</h2>
              <button
                onClick={() => set('participantes', [...form.participantes, emptyParticipante()])}
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-3">
              {form.participantes.map((p, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={p.nombre}
                      onChange={(e) => {
                        setParticipante(idx, 'nombre', e.target.value);
                        fillFromPerson(idx, e.target.value);
                      }}
                      placeholder="Nombre completo *"
                      list="people-list"
                      className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {form.participantes.length > 1 && (
                      <button
                        onClick={() => set('participantes', form.participantes.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      value={p.rut}
                      onChange={(e) => setParticipante(idx, 'rut', e.target.value)}
                      placeholder="RUT"
                      className="border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      value={p.telefono}
                      onChange={(e) => setParticipante(idx, 'telefono', e.target.value)}
                      placeholder="Teléfono de contacto"
                      className="border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      value={p.email}
                      onChange={(e) => setParticipante(idx, 'email', e.target.value)}
                      placeholder="Email"
                      className="border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                  <textarea
                    value={p.vestimenta || ''}
                    onChange={(e) => setParticipante(idx, 'vestimenta', e.target.value)}
                    placeholder="Descripción de vestimenta (colores, tipo de ropa)"
                    rows={2}
                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Vehículos</h2>
              <button
                onClick={() => set('vehiculos', [...form.vehiculos, emptyVehiculo()])}
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                + Agregar vehículo
              </button>
            </div>
            {form.vehiculos.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Sin vehículos registrados</p>
            ) : (
              <div className="space-y-3">
                {form.vehiculos.map((v, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['marca', 'modelo', 'patente', 'color'] as const).map((field) => (
                        <input
                          key={field}
                          value={v[field]}
                          onChange={(e) => setVehiculo(idx, field, e.target.value)}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          className="border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => set('vehiculos', form.vehiculos.filter((_, i) => i !== idx))}
                      className="mt-2 text-xs text-red-400 hover:text-red-600"
                    >
                      Eliminar vehículo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transport details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de estacionamiento</label>
              <input
                value={form.lugarEstacionamiento}
                onChange={(e) => set('lugarEstacionamiento', e.target.value)}
                placeholder="Ej: Portillo kms 4, coordinadas, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Otro transporte</label>
              <input
                value={form.otroTransporte}
                onChange={(e) => set('otroTransporte', e.target.value)}
                placeholder="Bus, taxi, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Volver
            </button>
            <button
              onClick={() => setShowPrintView(true)}
              disabled={!step2Valid}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Previsualizar aviso para descargar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!step2Valid || submitting}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Enviando…' : 'Enviar Aviso'}
            </button>
          </div>
        </div>
      )}

      <datalist id="people-list">
        {people.map((p) => <option key={p.name} value={p.name} />)}
      </datalist>

      {showPrintView && <PrintViewRapido formData={form} onClose={() => setShowPrintView(false)} />}
    </div>
  );
}

export default function AvisoRapidoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <AvisoRapidoContent />
    </Suspense>
  );
}

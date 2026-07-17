'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Taller = {
  id: number;
  name: string;
  branch: string;
  level: string;
  description: string;
  objetivo: string | null;
  contenidos: string | null;
  habilidades: string | null;
  equipo_personal: string | null;
  equipo_recomendado: string | null;
  equipo_cau: string | null;
  evaluacion_metodo: string | null;
  lugar_tipico: string | null;
  condiciones_lugar: string | null;
  requisitos_personales: string | null;
  observaciones: string | null;
  rutas_posibles: string | null;
  bibliografia: string | null;
  prueba_convalidacion: string | null;
  horas_clases: number | null;
  horas_practica: number | null;
  horas_evaluacion: number | null;
  dias_terreno: number | null;
  dias_traslado: number | null;
};

type ProfileFull = {
  name: string;
  email: string;
  phone: string | null;
  rut: string | null;
  blood_type: string | null;
  allergies: string | null;
  medications: string | null;
  medical_conditions: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
};

type InscripcionFicha = {
  id: number;
  status: string;
  grupo_sanguineo: string | null;
  alergias: string | null;
  medicamentos: string | null;
  condiciones_especiales: string | null;
  tiene_primeros_auxilios: boolean;
  profile: ProfileFull;
};

type AyudantiaFicha = {
  id: number;
  seleccionado: boolean | null;
  asistio: boolean | null;
  profile: ProfileFull;
};

type Edicion = {
  id: number;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  max_ayudantes: number;
  price: string | null;
  price_student: string | null;
  required_points: number;
  profesor: string | null;
  fecha_clases: string | null;
  fecha_salida: string | null;
  taller: Taller;
  inscripciones: InscripcionFicha[];
  ayudantias: AyudantiaFicha[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function firstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const v of values) {
    if (v && v.trim()) return v.trim();
  }
  return '—';
}

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">{title}</h3>
      {children}
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white text-gray-900"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
      )}
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FichaEdicionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Edicion-level state (coordinador edits these)
  const [profesor, setProfesor] = useState('');
  const [fechaClases, setFechaClases] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [price, setPrice] = useState('');
  const [priceStudent, setPriceStudent] = useState('');

  // Taller curriculum state (admin edits these)
  const [t, setT] = useState<Partial<Taller>>({});

  useEffect(() => {
    fetch(`/api/coordinador/ediciones/${id}/ficha`)
      .then((r) => r.json())
      .then((data: Edicion) => {
        setEdicion(data);
        setProfesor(data.profesor ?? '');
        setFechaClases(data.fecha_clases ?? '');
        setFechaSalida(data.fecha_salida ?? '');
        setPrice(data.price ?? '');
        setPriceStudent(data.price_student ?? '');
        setT(data.taller);
        setLoading(false);
      });
  }, [id]);

  const saveEdicion = useCallback(async () => {
    setSaving(true);
    await fetch(`/api/coordinador/ediciones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profesor: profesor || null,
        fecha_clases: fechaClases || null,
        fecha_salida: fechaSalida || null,
        price: price ? Number(price) : null,
        price_student: priceStudent ? Number(priceStudent) : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [id, profesor, fechaClases, fechaSalida, price, priceStudent]);

  const saveTaller = useCallback(async () => {
    if (!edicion) return;
    setSaving(true);
    await fetch(`/api/admin/talleres/${edicion.taller.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objetivo: t.objetivo || null,
        contenidos: t.contenidos || null,
        habilidades: t.habilidades || null,
        equipo_personal: t.equipo_personal || null,
        equipo_recomendado: t.equipo_recomendado || null,
        equipo_cau: t.equipo_cau || null,
        evaluacion_metodo: t.evaluacion_metodo || null,
        lugar_tipico: t.lugar_tipico || null,
        condiciones_lugar: t.condiciones_lugar || null,
        requisitos_personales: t.requisitos_personales || null,
        observaciones: t.observaciones || null,
        rutas_posibles: t.rutas_posibles || null,
        bibliografia: t.bibliografia || null,
        prueba_convalidacion: t.prueba_convalidacion || null,
        horas_clases: t.horas_clases ?? null,
        horas_practica: t.horas_practica ?? null,
        horas_evaluacion: t.horas_evaluacion ?? null,
        dias_terreno: t.dias_terreno ?? null,
        dias_traslado: t.dias_traslado ?? null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [edicion, t]);

  // Suppress unused variable warning — router kept for potential future navigation
  void router;

  if (loading) return <div className="p-8 text-gray-400">Cargando ficha...</div>;
  if (!edicion) return <div className="p-8 text-red-500">Edición no encontrada.</div>;

  const taller = edicion.taller;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/coordinador" className="hover:text-blue-600">Coordinador</Link>
            <span>/</span>
            <span>{taller.name}</span>
            <span>/</span>
            <span className="font-medium text-gray-900">{edicion.name}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Ficha de Edición</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Guardado</span>}
          <Link
            href={`/coordinador/ediciones/${id}/ficha/imprimir`}
            target="_blank"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-700"
          >
            Ver / Imprimir PDF
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Taller template (admin) ────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Contenido del taller</h2>
            <button
              onClick={saveTaller}
              disabled={saving}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar contenido'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Estos datos definen el taller y se comparten entre todas sus ediciones. Solo admins pueden editarlos.
          </p>

          <Section title="Descripción general">
            <TextField label="Objetivo" value={t.objetivo ?? ''} onChange={(v) => setT((p) => ({ ...p, objetivo: v }))} multiline placeholder="¿Cuál es el objetivo del taller?" />
            <TextField label="Contenidos" value={t.contenidos ?? ''} onChange={(v) => setT((p) => ({ ...p, contenidos: v }))} multiline placeholder="Temas y contenidos de las clases..." />
            <TextField label="Habilidades" value={t.habilidades ?? ''} onChange={(v) => setT((p) => ({ ...p, habilidades: v }))} multiline placeholder="¿Qué debería poder hacer el alumno al terminar?" />
          </Section>

          <Section title="Equipamiento">
            <TextField label="Equipamiento personal (obligatorio)" value={t.equipo_personal ?? ''} onChange={(v) => setT((p) => ({ ...p, equipo_personal: v }))} multiline />
            <TextField label="Equipamiento recomendado" value={t.equipo_recomendado ?? ''} onChange={(v) => setT((p) => ({ ...p, equipo_recomendado: v }))} multiline />
            <TextField label="Equipamiento CAU" value={t.equipo_cau ?? ''} onChange={(v) => setT((p) => ({ ...p, equipo_cau: v }))} multiline />
          </Section>

          <Section title="Logística">
            <TextField label="Lugar típico" value={t.lugar_tipico ?? ''} onChange={(v) => setT((p) => ({ ...p, lugar_tipico: v }))} />
            <TextField label="Condiciones del lugar" value={t.condiciones_lugar ?? ''} onChange={(v) => setT((p) => ({ ...p, condiciones_lugar: v }))} multiline />
            <TextField label="Requisitos personales del alumno" value={t.requisitos_personales ?? ''} onChange={(v) => setT((p) => ({ ...p, requisitos_personales: v }))} multiline />
          </Section>

          <Section title="Evaluación y bibliografía">
            <TextField label="Método de evaluación" value={t.evaluacion_metodo ?? ''} onChange={(v) => setT((p) => ({ ...p, evaluacion_metodo: v }))} multiline />
            <TextField label="Prueba de convalidación" value={t.prueba_convalidacion ?? ''} onChange={(v) => setT((p) => ({ ...p, prueba_convalidacion: v }))} multiline />
            <TextField label="Rutas / cerros posibles" value={t.rutas_posibles ?? ''} onChange={(v) => setT((p) => ({ ...p, rutas_posibles: v }))} multiline />
            <TextField label="Bibliografía" value={t.bibliografia ?? ''} onChange={(v) => setT((p) => ({ ...p, bibliografia: v }))} multiline />
            <TextField label="Observaciones" value={t.observaciones ?? ''} onChange={(v) => setT((p) => ({ ...p, observaciones: v }))} multiline />
          </Section>

          <Section title="Horas y días">
            <div className="grid grid-cols-3 gap-3">
              <NumField label="Hrs. clases" value={String(t.horas_clases ?? '')} onChange={(v) => setT((p) => ({ ...p, horas_clases: v ? Number(v) : null }))} />
              <NumField label="Hrs. práctica" value={String(t.horas_practica ?? '')} onChange={(v) => setT((p) => ({ ...p, horas_practica: v ? Number(v) : null }))} />
              <NumField label="Hrs. evaluación" value={String(t.horas_evaluacion ?? '')} onChange={(v) => setT((p) => ({ ...p, horas_evaluacion: v ? Number(v) : null }))} />
              <NumField label="Días terreno" value={String(t.dias_terreno ?? '')} onChange={(v) => setT((p) => ({ ...p, dias_terreno: v ? Number(v) : null }))} />
              <NumField label="Días traslado" value={String(t.dias_traslado ?? '')} onChange={(v) => setT((p) => ({ ...p, dias_traslado: v ? Number(v) : null }))} />
            </div>
          </Section>
        </div>

        {/* ── Right: Edition-specific (coordinador) ────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Esta edición</h2>
              <button
                onClick={saveEdicion}
                disabled={saving}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar edición'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div><span className="text-gray-500">Inicio:</span> <strong className="text-gray-900">{fmtDate(edicion.start_date)}</strong></div>
              <div><span className="text-gray-500">Fin:</span> <strong className="text-gray-900">{fmtDate(edicion.end_date)}</strong></div>
              <div><span className="text-gray-500">Cupos:</span> <strong className="text-gray-900">{edicion.capacity}</strong></div>
              <div><span className="text-gray-500">Inscritos:</span> <strong className="text-gray-900">{edicion.inscripciones.length}</strong></div>
            </div>

            <TextField label="Profesor / instructor" value={profesor} onChange={setProfesor} placeholder="Nombre del profesor para esta edición" />
            <TextField label="Fechas clases teóricas" value={fechaClases} onChange={setFechaClases} placeholder="Ej: Lunes 17 presencial, miércoles 19 online" />
            <TextField label="Fechas salida práctica" value={fechaSalida} onChange={setFechaSalida} placeholder="Ej: 22 y 23 de noviembre" />

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Precio socio (CLP)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="40000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Precio estudiante (CLP)</label>
                <input type="number" value={priceStudent} onChange={(e) => setPriceStudent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="20000" />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-3">
              Participantes ({edicion.inscripciones.length})
            </h2>
            {edicion.inscripciones.length === 0 ? (
              <p className="text-sm text-gray-400">Sin inscritos aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left py-1.5 pr-3 font-medium">Nombre</th>
                      <th className="text-left py-1.5 pr-3 font-medium">Teléfono</th>
                      <th className="text-left py-1.5 pr-3 font-medium">G. Sang.</th>
                      <th className="text-left py-1.5 font-medium">Emergencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edicion.inscripciones.map((i) => {
                      const gs = firstNonEmpty(i.grupo_sanguineo, i.profile.blood_type);
                      const alergias = firstNonEmpty(i.alergias, i.profile.allergies);
                      const meds = firstNonEmpty(i.medicamentos, i.profile.medications);
                      const conds = firstNonEmpty(i.condiciones_especiales, i.profile.medical_conditions);
                      const emergContact = firstNonEmpty(i.profile.emergency_contact);
                      const emergPhone = firstNonEmpty(i.profile.emergency_phone);
                      const hasExtra = alergias !== '—' || meds !== '—' || conds !== '—';
                      return (
                        <React.Fragment key={i.id}>
                          <tr className="border-b border-gray-50">
                            <td className="py-1.5 pr-3">
                              <span className="font-medium text-gray-900">{i.profile.name}</span>
                              {i.tiene_primeros_auxilios && (
                                <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-1 rounded">PA</span>
                              )}
                              {i.profile.rut && (
                                <div className="text-gray-400 text-[10px]">{i.profile.rut}</div>
                              )}
                            </td>
                            <td className="py-1.5 pr-3 text-gray-600">{firstNonEmpty(i.profile.phone)}</td>
                            <td className="py-1.5 pr-3 text-gray-600">{gs}</td>
                            <td className="py-1.5 text-gray-600">
                              {emergContact !== '—' ? emergContact : '—'}
                              {emergPhone !== '—' && <div className="text-[10px] text-gray-400">{emergPhone}</div>}
                            </td>
                          </tr>
                          {hasExtra && (
                            <tr className="border-b border-gray-100">
                              <td colSpan={4} className="pb-2 text-[10px] text-gray-500">
                                {alergias !== '—' && <span className="mr-3">Alergias: {alergias}</span>}
                                {meds !== '—' && <span className="mr-3">Medicamentos: {meds}</span>}
                                {conds !== '—' && <span>Condiciones: {conds}</span>}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Ayudantes */}
          {edicion.ayudantias.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-3">Ayudantes ({edicion.ayudantias.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left py-1.5 pr-3 font-medium">Nombre</th>
                      <th className="text-left py-1.5 pr-3 font-medium">Seleccionado</th>
                      <th className="text-left py-1.5 pr-3 font-medium">Teléfono</th>
                      <th className="text-left py-1.5 pr-3 font-medium">G. Sang.</th>
                      <th className="text-left py-1.5 font-medium">Emergencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edicion.ayudantias.map((a) => {
                      const gs = firstNonEmpty(a.profile.blood_type);
                      const emergContact = firstNonEmpty(a.profile.emergency_contact);
                      const emergPhone = firstNonEmpty(a.profile.emergency_phone);
                      return (
                        <tr key={a.id} className="border-b border-gray-50">
                          <td className="py-1.5 pr-3">
                            <span className="font-medium text-gray-900">{a.profile.name}</span>
                            {a.profile.rut && (
                              <div className="text-gray-400 text-[10px]">{a.profile.rut}</div>
                            )}
                          </td>
                          <td className="py-1.5 pr-3">
                            {a.seleccionado === true ? (
                              <span className="text-green-600 font-medium">Sí</span>
                            ) : a.seleccionado === false ? (
                              <span className="text-red-500">No</span>
                            ) : (
                              <span className="text-gray-400">Pendiente</span>
                            )}
                          </td>
                          <td className="py-1.5 pr-3 text-gray-600">{firstNonEmpty(a.profile.phone)}</td>
                          <td className="py-1.5 pr-3 text-gray-600">{gs}</td>
                          <td className="py-1.5 text-gray-600">
                            {emergContact !== '—' ? emergContact : '—'}
                            {emergPhone !== '—' && <div className="text-[10px] text-gray-400">{emergPhone}</div>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

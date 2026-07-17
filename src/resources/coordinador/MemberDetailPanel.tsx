'use client';
import React, { useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberDetailPanelProps {
  userId: string | null;
  onClose: () => void;
}

type MemberDetail = {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    rut: string | null;
    role: string;
    created_at: string;
    blood_type: string | null;
    allergies: string | null;
    medications: string | null;
    medical_conditions: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
  };
  activePoints: number;
  inscripciones: {
    status: string;
    inscrito_at: string;
    aprobado_at: string | null;
    edicion: { name: string; taller: { name: string; branch: string } };
  }[];
  ayudantias: {
    seleccionado: boolean | null;
    asistio: boolean | null;
    signed_up_at: string;
    edicion: { name: string; taller: { name: string } };
  }[];
  avisos: {
    id: number;
    title: string;
    status: string;
    activity_date: string | null;
    created_at: string;
  }[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const statusLabel: Record<string, string> = {
  postulando: 'Postulando',
  aceptado: 'Aceptado',
  completado: 'Completado',
  reprobado: 'Reprobado',
  rechazado: 'Rechazado',
  retirado: 'Retirado',
  en_lista: 'En lista',
  no_asiste: 'No asiste',
  rezagado: 'Rezagado',
};

const statusColor: Record<string, string> = {
  completado: 'text-green-600',
  postulando: 'text-yellow-600',
  aceptado: 'text-blue-600',
  rechazado: 'text-red-500',
  reprobado: 'text-red-500',
  retirado: 'text-gray-400',
  en_lista: 'text-orange-600',
  no_asiste: 'text-gray-400',
  rezagado: 'text-purple-600',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemberDetailPanel({ userId, onClose }: MemberDetailPanelProps) {
  const [data, setData] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setData(null);
      return;
    }
    setLoading(true);
    setData(null);
    fetch(`/api/coordinador/members/${userId}`)
      .then((r) => r.json())
      .then((d: MemberDetail) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div className="min-w-0">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3.5 w-64 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : data ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 truncate">{data.profile.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{data.profile.email}</p>
                {data.profile.phone && (
                  <p className="text-xs text-gray-500">{data.profile.phone}</p>
                )}
                {data.profile.rut && (
                  <p className="text-xs text-gray-400">RUT: {data.profile.rut}</p>
                )}
              </>
            ) : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md ml-3 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {data && (
          <div className="p-5 space-y-5 text-sm flex-1">
            {/* Active points */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Puntos activos
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                {data.activePoints}
              </span>
            </div>

            {/* Medical info — only rendered when at least one field is present */}
            {(data.profile.blood_type ||
              data.profile.allergies ||
              data.profile.medications ||
              data.profile.medical_conditions) && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  Info médica
                </h3>
                <dl className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-28 flex-shrink-0">Grupo sanguíneo</dt>
                    <dd className="font-medium text-gray-900">{data.profile.blood_type ?? '—'}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-28 flex-shrink-0">Alergias</dt>
                    <dd className="text-gray-700">{data.profile.allergies ?? '—'}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-28 flex-shrink-0">Medicamentos</dt>
                    <dd className="text-gray-700">{data.profile.medications ?? '—'}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-28 flex-shrink-0">Condiciones</dt>
                    <dd className="text-gray-700">{data.profile.medical_conditions ?? '—'}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Emergency contact — only rendered when present */}
            {(data.profile.emergency_contact || data.profile.emergency_phone) && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <h3 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
                  Contacto de emergencia
                </h3>
                <p className="text-xs font-medium text-gray-900">
                  {data.profile.emergency_contact ?? '—'}
                </p>
                {data.profile.emergency_phone && (
                  <p className="text-xs text-gray-600">{data.profile.emergency_phone}</p>
                )}
              </div>
            )}

            {/* Course history */}
            {data.inscripciones.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Historial de talleres
                </h3>
                <ul className="space-y-1.5">
                  {data.inscripciones.map((insc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 text-xs ${statusColor[insc.status] ?? 'text-gray-500'}`}
                      >
                        ●
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {insc.edicion.taller.name}
                        </p>
                        <p className={`text-xs ${statusColor[insc.status] ?? 'text-gray-500'}`}>
                          {statusLabel[insc.status] ?? insc.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ayudantías */}
            {data.ayudantias.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Como ayudante
                </h3>
                <ul className="space-y-1.5">
                  {data.ayudantias.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 text-xs ${
                          a.seleccionado ? 'text-purple-600' : 'text-gray-400'
                        }`}
                      >
                        ●
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {a.edicion.taller.name} — {a.edicion.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {a.seleccionado ? 'Seleccionado' : 'Pendiente'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent avisos */}
            {data.avisos.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Avisos recientes
                </h3>
                <ul className="space-y-1">
                  {data.avisos.slice(0, 5).map((av) => (
                    <li key={av.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-700 truncate">
                        {av.title || `Aviso #${av.id}`}
                      </span>
                      <span
                        className={`text-xs flex-shrink-0 ${
                          av.status === 'submitted'
                            ? 'text-green-600'
                            : av.status === 'archived'
                            ? 'text-gray-400'
                            : 'text-yellow-600'
                        }`}
                      >
                        {av.status === 'submitted'
                          ? 'Enviado'
                          : av.status === 'archived'
                          ? 'Archivado'
                          : 'Borrador'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

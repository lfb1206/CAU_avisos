'use client';
import React, { useState } from 'react';

interface TallerInfo {
  id: number;
  name: string;
  branch: string;
}

interface EdicionInfo {
  id: number;
  taller_id: number;
  taller_name: string;
  branch: string;
  name: string;
  max_ayudantes: number;
  status: string;
  enrollment_open: boolean;
  enrollment_opens_at: string | null;
  capacity: number;
  totalInscripciones: number;
  postulaciones: number;
  aceptados: number;
  ayudantes: number;
  start_date: string | null;
}

interface MemberInfo {
  id: string;
  name: string;
  email: string;
  activePoints: number;
}

interface CompletedCourse {
  tallerName: string;
  branch: string;
  completedAt: string | null;
}

interface PostulacionRow {
  id: number;
  user_id: string;
  status: string;
  profile: { name: string; email: string; phone: string | null };
  activePoints: number;
  inscrito_at: string;
  completedCourses: CompletedCourse[];
}

interface AyudantiaRow {
  id: number;
  user_id: string;
  seleccionado: boolean | null;
  asistio: boolean | null;
  puntos_otorgados: boolean;
  profile: { name: string; email: string };
  signed_up_at: string;
}

interface Props {
  coordinadorId: string;
  talleres: TallerInfo[];
  ediciones: EdicionInfo[];
  members: MemberInfo[];
}

const branchLabel: Record<string, string> = {
  base: 'Base',
  nieve_hielo: 'Nieve / Hielo',
  roca: 'Roca',
};

const edicionStatusLabel: Record<string, string> = {
  planificada: 'Planificada',
  inscripciones_abiertas: 'Inscripciones abiertas',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

const edicionStatusColor: Record<string, string> = {
  planificada: 'bg-gray-100 text-gray-600',
  inscripciones_abiertas: 'bg-blue-100 text-blue-700',
  en_curso: 'bg-green-100 text-green-700',
  finalizada: 'bg-purple-100 text-purple-700',
  cancelada: 'bg-red-100 text-red-600',
};

const inscripcionStatusColors: Record<string, string> = {
  postulando: 'bg-yellow-100 text-yellow-700',
  aceptado: 'bg-green-100 text-green-700',
  en_lista: 'bg-blue-100 text-blue-700',
  rechazado: 'bg-red-100 text-red-700',
  completado: 'bg-green-100 text-green-800',
  reprobado: 'bg-red-100 text-red-800',
  no_asiste: 'bg-gray-100 text-gray-500',
  retirado: 'bg-gray-100 text-gray-500',
  rezagado: 'bg-purple-100 text-purple-700',
};

type Tab = 'ediciones' | 'postulaciones' | 'resultados' | 'ayudantes' | 'puntos';

export default function CoordinadorClient({
  coordinadorId,
  talleres,
  ediciones: initialEdiciones,
  members,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('ediciones');
  const [ediciones, setEdiciones] = useState(initialEdiciones);
  const [toggling, setToggling] = useState<number | null>(null);
  const [edicionStatusFilter, setEdicionStatusFilter] = useState<'activas' | 'historial' | 'todas'>('activas');

  // Postulaciones tab
  const [selectedEdicionId, setSelectedEdicionId] = useState('');
  const [postulaciones, setPostulaciones] = useState<PostulacionRow[]>([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);

  // Resultados tab
  const [selectedResultadoEdicionId, setSelectedResultadoEdicionId] = useState('');
  const [resultadosInscripciones, setResultadosInscripciones] = useState<PostulacionRow[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(false);

  // Ayudantes tab
  const [selectedAyudanteEdicionId, setSelectedAyudanteEdicionId] = useState('');
  const [ayudantias, setAyudantias] = useState<AyudantiaRow[]>([]);
  const [loadingAyudantias, setLoadingAyudantias] = useState(false);

  // Award points modal
  const [awardModal, setAwardModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedEdicionForPoints, setSelectedEdicionForPoints] = useState('');
  const [pointsAmount, setPointsAmount] = useState(1);
  const [description, setDescription] = useState('');
  const [awarding, setAwarding] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState('');
  const [awardError, setAwardError] = useState('');

  // Create edicion modal
  const [createModal, setCreateModal] = useState(false);
  const [newEdicion, setNewEdicion] = useState({
    taller_id: '',
    start_date: '',
    end_date: '',
    capacity: 20,
    max_ayudantes: 0,
    required_points: 0,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Member profile modal
  const [memberModal, setMemberModal] = useState<{
    name: string;
    email: string;
    phone: string | null;
    completedCourses: CompletedCourse[];
  } | null>(null);

  const toggleEnrollment = async (edicionId: number, currentOpen: boolean) => {
    setToggling(edicionId);
    try {
      const res = await fetch(`/api/coordinador/ediciones/${edicionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_open: !currentOpen }),
      });
      if (res.ok) {
        setEdiciones((prev) =>
          prev.map((e) =>
            e.id === edicionId
              ? {
                  ...e,
                  enrollment_open: !currentOpen,
                  enrollment_opens_at: !currentOpen ? new Date().toISOString() : null,
                }
              : e
          )
        );
      }
    } finally {
      setToggling(null);
    }
  };

  const handleStatusChange = async (edicionId: number, status: string) => {
    const res = await fetch(`/api/coordinador/ediciones/${edicionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setEdiciones((prev) => prev.map((e) => e.id === edicionId ? { ...e, status } : e));
    }
  };

  const loadPostulaciones = async (edicionId: string) => {
    setSelectedEdicionId(edicionId);
    if (!edicionId) { setPostulaciones([]); return; }
    setLoadingPostulaciones(true);
    try {
      const res = await fetch(`/api/coordinador/ediciones/${edicionId}/inscripciones`);
      if (res.ok) setPostulaciones(await res.json());
    } finally {
      setLoadingPostulaciones(false);
    }
  };

  const updateInscripcion = async (
    edicionId: string,
    userId: string,
    status: string,
    notas?: string
  ) => {
    const res = await fetch(`/api/coordinador/ediciones/${edicionId}/inscripciones`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, status, notas_coordinador: notas }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPostulaciones((prev) => prev.map((p) => (p.user_id === userId ? { ...p, status: updated.status } : p)));
      setResultadosInscripciones((prev) => prev.map((p) => (p.user_id === userId ? { ...p, status: updated.status } : p)));
    }
  };

  const loadResultados = async (edicionId: string) => {
    setSelectedResultadoEdicionId(edicionId);
    if (!edicionId) { setResultadosInscripciones([]); return; }
    setLoadingResultados(true);
    try {
      const res = await fetch(`/api/coordinador/ediciones/${edicionId}/inscripciones?status=aceptado`);
      if (res.ok) setResultadosInscripciones(await res.json());
    } finally {
      setLoadingResultados(false);
    }
  };

  const loadAyudantias = async (edicionId: string) => {
    setSelectedAyudanteEdicionId(edicionId);
    if (!edicionId) { setAyudantias([]); return; }
    setLoadingAyudantias(true);
    try {
      const res = await fetch(`/api/coordinador/ediciones/${edicionId}/ayudantias`);
      if (res.ok) setAyudantias(await res.json());
    } finally {
      setLoadingAyudantias(false);
    }
  };

  const updateAyudantia = async (edicionId: string, userId: string, patch: object) => {
    const res = await fetch(`/api/coordinador/ediciones/${edicionId}/ayudantias`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...patch }),
    });
    if (res.ok) {
      const updated = await res.json();
      setAyudantias((prev) => prev.map((a) => (a.user_id === userId ? { ...a, ...updated } : a)));
    }
  };

  const awardPoints = async () => {
    if (!selectedMember || pointsAmount < 1) return;
    setAwarding(true);
    setAwardError('');
    setAwardSuccess('');
    try {
      const res = await fetch('/api/coordinador/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedMember,
          edicion_id: selectedEdicionForPoints ? Number(selectedEdicionForPoints) : null,
          points: pointsAmount,
          description: description || null,
          awarded_by: coordinadorId,
        }),
      });
      if (res.ok) {
        const member = members.find((m) => m.id === selectedMember);
        setAwardSuccess(
          `${pointsAmount} punto${pointsAmount !== 1 ? 's' : ''} otorgado${pointsAmount !== 1 ? 's' : ''} a ${member?.name}.`
        );
        setSelectedMember('');
        setSelectedEdicionForPoints('');
        setPointsAmount(1);
        setDescription('');
      } else {
        const data = await res.json();
        setAwardError(data.error ?? 'Error al otorgar puntos');
      }
    } catch {
      setAwardError('Error de conexión');
    } finally {
      setAwarding(false);
    }
  };

  const createEdicion = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/coordinador/ediciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taller_id: Number(newEdicion.taller_id),
          start_date: newEdicion.start_date || null,
          end_date: newEdicion.end_date || null,
          capacity: newEdicion.capacity,
          max_ayudantes: newEdicion.max_ayudantes,
          required_points: newEdicion.required_points,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        const taller = talleres.find((t) => t.id === Number(newEdicion.taller_id));
        setEdiciones((prev) => [
          ...prev,
          {
            ...created,
            taller_name: taller?.name ?? '',
            branch: taller?.branch ?? '',
            postulaciones: 0,
            aceptados: 0,
            totalInscripciones: 0,
            ayudantes: 0,
            enrollment_open: false,
            enrollment_opens_at: null,
            start_date: created.start_date ?? null,
          },
        ]);
        setCreateModal(false);
        setNewEdicion({
          taller_id: '', start_date: '', end_date: '',
          capacity: 20, max_ayudantes: 0, required_points: 0,
        });
      } else {
        const data = await res.json();
        setCreateError(data.error ?? 'Error al crear edición');
      }
    } catch {
      setCreateError('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ediciones', label: 'Ediciones' },
    { key: 'postulaciones', label: 'Postulaciones' },
    { key: 'resultados', label: 'Resultados' },
    { key: 'ayudantes', label: 'Ayudantes' },
    { key: 'puntos', label: 'Puntos' },
  ];

  const finalizedEdiciones = ediciones.filter(
    (e) => e.status === 'finalizada' || e.status === 'en_curso'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Panel del Coordinador</h1>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Tab: Ediciones ── */}
      {activeTab === 'ediciones' && (() => {
        const visibleEdiciones = ediciones.filter((e) => {
          if (edicionStatusFilter === 'activas') return !['finalizada', 'cancelada'].includes(e.status);
          if (edicionStatusFilter === 'historial') return ['finalizada', 'cancelada'].includes(e.status);
          return true;
        });

        return (
          <div className="space-y-4">
            {/* Controls row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['activas', 'historial', 'todas'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setEdicionStatusFilter(f)}
                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors capitalize ${
                      edicionStatusFilter === f
                        ? 'bg-white shadow text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f === 'activas' ? 'Activas' : f === 'historial' ? 'Historial' : 'Todas'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCreateModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                + Nueva edición
              </button>
            </div>

            {visibleEdiciones.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">Sin ediciones en esta vista.</p>
            )}

            {(['base', 'nieve_hielo', 'roca'] as const).map((branch) => {
              const branchEdiciones = visibleEdiciones.filter((e) => e.branch === branch);
              if (branchEdiciones.length === 0) return null;
              return (
                <section key={branch}>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {branchLabel[branch]}
                  </h2>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
                    {branchEdiciones.map((edicion) => {
                      const isDone = ['finalizada', 'cancelada'].includes(edicion.status);
                      return (
                        <div key={edicion.id} className="flex items-center justify-between gap-4 px-5 py-4">
                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-gray-900">{edicion.taller_name}</p>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${edicionStatusColor[edicion.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                {edicionStatusLabel[edicion.status] ?? edicion.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {edicion.name}
                              {edicion.start_date && ` · ${new Date(edicion.start_date).toLocaleDateString('es-CL')}`}
                              {' · '}{edicion.postulaciones} postulando · {edicion.aceptados} aceptados / {edicion.capacity} cupos
                              {edicion.max_ayudantes > 0 && ` · ${edicion.ayudantes}/${edicion.max_ayudantes} ayudantes`}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <a
                              href={`/coordinador/ediciones/${edicion.id}/ficha`}
                              className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
                            >
                              Ficha →
                            </a>
                            {!isDone && (
                              <>
                                {/* Status progression */}
                                {(edicion.status === 'planificada' || edicion.status === 'inscripciones_abiertas') && (
                                  <button
                                    onClick={() => handleStatusChange(edicion.id, 'en_curso')}
                                    className="text-xs px-2 py-1 border border-green-300 text-green-700 rounded hover:bg-green-50"
                                  >
                                    → En curso
                                  </button>
                                )}
                                {edicion.status === 'en_curso' && (
                                  <button
                                    onClick={() => handleStatusChange(edicion.id, 'finalizada')}
                                    className="text-xs px-2 py-1 border border-purple-300 text-purple-700 rounded hover:bg-purple-50"
                                  >
                                    → Finalizar
                                  </button>
                                )}

                                {/* Enrollment toggle — hidden once course is running */}
                                {edicion.status !== 'en_curso' && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                      {edicion.enrollment_open ? 'Inscripciones abiertas' : 'Inscripciones cerradas'}
                                    </span>
                                    <button
                                      onClick={() => toggleEnrollment(edicion.id, edicion.enrollment_open)}
                                      disabled={toggling === edicion.id}
                                      aria-label={edicion.enrollment_open ? 'Cerrar inscripciones' : 'Abrir inscripciones'}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                        edicion.enrollment_open ? 'bg-green-500' : 'bg-gray-300'
                                      }`}
                                    >
                                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        edicion.enrollment_open ? 'translate-x-6' : 'translate-x-1'
                                      }`} />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        );
      })()}

      {/* ── Tab: Postulaciones ── */}
      {activeTab === 'postulaciones' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar edición
            </label>
            <select
              value={selectedEdicionId}
              onChange={(e) => loadPostulaciones(e.target.value)}
              className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
            >
              <option value="">-- Selecciona una edición --</option>
              {ediciones.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.taller_name} — {e.name} ({e.postulaciones} postulando)
                </option>
              ))}
            </select>
          </div>

          {loadingPostulaciones && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loadingPostulaciones && postulaciones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Talleres aprobados</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Puntos</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {postulaciones.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setMemberModal({ name: p.profile.name, email: p.profile.email, phone: p.profile.phone, completedCourses: p.completedCourses })}
                          className="text-left"
                        >
                          <p className="font-medium text-gray-900 hover:text-blue-600">{p.profile.name}</p>
                          <p className="text-xs text-gray-400">{p.profile.email}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {p.completedCourses.length === 0 ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="space-y-0.5">
                            {p.completedCourses.map((c, i) => (
                              <div key={i} className="text-xs text-gray-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                {c.tallerName}
                                {c.completedAt && (
                                  <span className="text-gray-400">
                                    ({new Date(c.completedAt).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-purple-700">
                        {p.activePoints}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColors[p.status] ?? 'bg-gray-100 text-gray-500'}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-center">
                          {p.status === 'postulando' && (
                            <>
                              <button
                                onClick={() => updateInscripcion(selectedEdicionId, p.user_id, 'aceptado')}
                                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() => updateInscripcion(selectedEdicionId, p.user_id, 'en_lista')}
                                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Lista
                              </button>
                              <button
                                onClick={() => updateInscripcion(selectedEdicionId, p.user_id, 'rechazado')}
                                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                          {p.status !== 'postulando' && (
                            <button
                              onClick={() => updateInscripcion(selectedEdicionId, p.user_id, 'postulando')}
                              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Revertir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingPostulaciones && selectedEdicionId && postulaciones.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No hay postulaciones para esta edición.</p>
          )}
        </div>
      )}

      {/* ── Tab: Resultados ── */}
      {activeTab === 'resultados' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar edición (en curso o finalizada)
            </label>
            <select
              value={selectedResultadoEdicionId}
              onChange={(e) => loadResultados(e.target.value)}
              className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
            >
              <option value="">-- Selecciona una edición --</option>
              {finalizedEdiciones.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.taller_name} — {e.name}
                </option>
              ))}
            </select>
          </div>

          {loadingResultados && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loadingResultados && resultadosInscripciones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Participante</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado actual</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resultadosInscripciones.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.profile.name}</p>
                        <p className="text-xs text-gray-400">{p.profile.email}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${inscripcionStatusColors[p.status] ?? 'bg-gray-100 text-gray-500'}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => updateInscripcion(selectedResultadoEdicionId, p.user_id, 'completado')}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Completado
                          </button>
                          <button
                            onClick={() => updateInscripcion(selectedResultadoEdicionId, p.user_id, 'reprobado')}
                            className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            Reprobado
                          </button>
                          <button
                            onClick={() => updateInscripcion(selectedResultadoEdicionId, p.user_id, 'no_asiste')}
                            className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            No asistió
                          </button>
                          <button
                            onClick={() => updateInscripcion(selectedResultadoEdicionId, p.user_id, 'rezagado')}
                            className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Rezagado
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingResultados && selectedResultadoEdicionId && resultadosInscripciones.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No hay participantes aceptados en esta edición.</p>
          )}
        </div>
      )}

      {/* ── Tab: Ayudantes ── */}
      {activeTab === 'ayudantes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar edición
            </label>
            <select
              value={selectedAyudanteEdicionId}
              onChange={(e) => loadAyudantias(e.target.value)}
              className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
            >
              <option value="">-- Selecciona una edición --</option>
              {ediciones.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.taller_name} — {e.name} ({e.ayudantes} ayudantes)
                </option>
              ))}
            </select>
          </div>

          {loadingAyudantias && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loadingAyudantias && ayudantias.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ayudante</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Seleccionado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Punto otorgado</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ayudantias.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.profile.name}</p>
                        <p className="text-xs text-gray-400">{a.profile.email}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {a.seleccionado === null || a.seleccionado === undefined
                          ? <span className="text-gray-400">Pendiente</span>
                          : a.seleccionado
                            ? <span className="text-green-600 font-medium">Seleccionado ✓</span>
                            : <span className="text-red-500">No seleccionado</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {a.puntos_otorgados
                          ? <span className="text-green-600 font-medium">Sí</span>
                          : <span className="text-gray-400">No</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => updateAyudantia(selectedAyudanteEdicionId, a.user_id, { seleccionado: true })}
                            disabled={a.seleccionado === true}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                          >
                            Seleccionar
                          </button>
                          <button
                            onClick={() => updateAyudantia(selectedAyudanteEdicionId, a.user_id, { seleccionado: false })}
                            disabled={a.seleccionado === false}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                          {a.seleccionado && !a.puntos_otorgados && (
                            <button
                              onClick={() => updateAyudantia(selectedAyudanteEdicionId, a.user_id, { puntos_otorgados: true })}
                              className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              Otorgar punto
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingAyudantias && selectedAyudanteEdicionId && ayudantias.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No hay ayudantes registrados.</p>
          )}
        </div>
      )}

      {/* ── Tab: Puntos ── */}
      {activeTab === 'puntos' && (
        <div className="space-y-6">
          {/* Members overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Puntos por Socio</h2>
                <p className="text-xs text-gray-500 mt-0.5">Solo se muestran puntos activos (no vencidos).</p>
              </div>
              <button
                onClick={() => { setAwardModal(true); setAwardSuccess(''); setAwardError(''); }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Otorgar Puntos
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${member.activePoints > 0 ? 'text-purple-700' : 'text-gray-400'}`}
                  >
                    {member.activePoints} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Award points modal ── */}
      {awardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Otorgar Puntos</h3>

            {awardSuccess && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {awardSuccess}
              </div>
            )}
            {awardError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {awardError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Socio *</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                >
                  <option value="">Seleccionar socio…</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Edición (opcional)</label>
                <select
                  value={selectedEdicionForPoints}
                  onChange={(e) => setSelectedEdicionForPoints(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                >
                  <option value="">Sin edición específica</option>
                  {ediciones.map((e) => (
                    <option key={e.id} value={e.id}>{e.taller_name} — {e.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Puntos *</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Ayudante en M1 octubre 2025"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={awardPoints}
                disabled={!selectedMember || pointsAmount < 1 || awarding}
                className="flex-1 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {awarding ? 'Otorgando…' : 'Confirmar'}
              </button>
              <button
                onClick={() => setAwardModal(false)}
                className="flex-1 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create edicion modal ── */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 max-h-screen overflow-y-auto">
            <h3 className="font-bold text-gray-900 text-lg">Nueva Edición de Taller</h3>

            {createError && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {createError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Taller *</label>
                <select
                  value={newEdicion.taller_id}
                  onChange={(e) => setNewEdicion({ ...newEdicion, taller_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                >
                  <option value="">Seleccionar taller…</option>
                  {talleres.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{branchLabel[t.branch]}] {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fecha inicio</label>
                <input
                  type="date"
                  value={newEdicion.start_date}
                  onChange={(e) => setNewEdicion({ ...newEdicion, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fecha fin</label>
                <input
                  type="date"
                  value={newEdicion.end_date}
                  onChange={(e) => setNewEdicion({ ...newEdicion, end_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Capacidad</label>
                <input
                  type="number"
                  min={1}
                  value={newEdicion.capacity}
                  onChange={(e) => setNewEdicion({ ...newEdicion, capacity: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Máx. ayudantes</label>
                <input
                  type="number"
                  min={0}
                  value={newEdicion.max_ayudantes}
                  onChange={(e) => setNewEdicion({ ...newEdicion, max_ayudantes: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Puntos requeridos</label>
                <input
                  type="number"
                  min={0}
                  value={newEdicion.required_points}
                  onChange={(e) => setNewEdicion({ ...newEdicion, required_points: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={createEdicion}
                disabled={!newEdicion.taller_id || creating}
                className="flex-1 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {creating ? 'Creando…' : 'Crear edición'}
              </button>
              <button
                onClick={() => setCreateModal(false)}
                className="flex-1 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Member profile modal ── */}
      {memberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{memberModal.name || 'Sin nombre'}</h3>
                <p className="text-sm text-gray-500">{memberModal.email}</p>
                {memberModal.phone && <p className="text-sm text-gray-500">{memberModal.phone}</p>}
              </div>
              <button onClick={() => setMemberModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Talleres aprobados ({memberModal.completedCourses.length})
              </p>
              {memberModal.completedCourses.length === 0 ? (
                <p className="text-sm text-gray-400">Sin talleres aprobados.</p>
              ) : (
                <div className="space-y-2">
                  {memberModal.completedCourses.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-gray-800">{c.tallerName}</span>
                        <span className="text-xs text-gray-400 capitalize">{c.branch.replace('_', '/')}</span>
                      </div>
                      {c.completedAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(c.completedAt).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMemberModal(null)}
              className="w-full py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

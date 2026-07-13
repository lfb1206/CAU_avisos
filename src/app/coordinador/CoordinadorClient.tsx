'use client';
import React, { useState } from 'react';

interface CourseInfo {
  id: number;
  name: string;
  branch: string;
  enrollment_open: boolean;
  enrollment_opens_at: string | null;
  enrollmentCount: number;
}

interface MemberInfo {
  id: string;
  name: string;
  email: string;
  activePoints: number;
}

interface Props {
  coordinadorId: string;
  courses: CourseInfo[];
  members: MemberInfo[];
}

const branchLabel: Record<string, string> = {
  base:        'Base',
  nieve_hielo: 'Nieve / Hielo',
  roca:        'Roca',
};

export default function CoordinadorClient({ coordinadorId, courses: initialCourses, members }: Props) {
  const [courses, setCourses] = useState(initialCourses);
  const [toggling, setToggling] = useState<number | null>(null);

  // Points modal state
  const [awardModal, setAwardModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [pointsAmount, setPointsAmount] = useState(1);
  const [description, setDescription] = useState('');
  const [awarding, setAwarding] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState('');
  const [awardError, setAwardError] = useState('');

  const toggleEnrollment = async (courseId: number, currentOpen: boolean) => {
    setToggling(courseId);
    try {
      const res = await fetch(`/api/coordinador/courses/${courseId}/enrollment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment_open: !currentOpen }),
      });
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, enrollment_open: !currentOpen, enrollment_opens_at: !currentOpen ? new Date().toISOString() : null }
              : c
          )
        );
      }
    } finally {
      setToggling(null);
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
          course_id: selectedCourse ? Number(selectedCourse) : null,
          points: pointsAmount,
          description: description || null,
          awarded_by: coordinadorId,
        }),
      });
      if (res.ok) {
        const member = members.find((m) => m.id === selectedMember);
        setAwardSuccess(`${pointsAmount} punto${pointsAmount !== 1 ? 's' : ''} otorgado${pointsAmount !== 1 ? 's' : ''} a ${member?.name}.`);
        setSelectedMember('');
        setSelectedCourse('');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Panel del Coordinador</h1>
        <button
          onClick={() => { setAwardModal(true); setAwardSuccess(''); setAwardError(''); }}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Otorgar Puntos
        </button>
      </div>

      {/* Courses enrollment toggle */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Estado de Inscripciones</h2>
          <p className="text-xs text-gray-500 mt-0.5">Abre o cierra las inscripciones para cada curso.</p>
        </div>
        <div className="divide-y divide-gray-100">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{course.name}</p>
                <p className="text-xs text-gray-400">
                  {branchLabel[course.branch] ?? course.branch} · {course.enrollmentCount} inscritos
                  {course.enrollment_opens_at && (
                    <> · Abierto desde {new Date(course.enrollment_opens_at).toLocaleDateString('es-CL')}</>
                  )}
                </p>
              </div>
              <button
                onClick={() => toggleEnrollment(course.id, course.enrollment_open)}
                disabled={toggling === course.id}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                  course.enrollment_open ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    course.enrollment_open ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Members points overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Puntos por Socio</h2>
          <p className="text-xs text-gray-500 mt-0.5">Solo se muestran puntos activos (no vencidos).</p>
        </div>
        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-400">{member.email}</p>
              </div>
              <span className={`text-sm font-bold ${member.activePoints > 0 ? 'text-purple-700' : 'text-gray-400'}`}>
                {member.activePoints} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Award points modal */}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar socio…</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Curso (opcional)</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Sin curso específico</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Ayudante en M1 octubre 2025"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface EdicionInfo {
  id: number;
  name: string;
  taller: { name: string; branch: string };
  start_date: string | null;
  end_date: string | null;
  capacity: number;
  price: number | null;
  required_points: number;
  _count: { inscripciones: number };
}

const grupoOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PostularPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [edicion, setEdicion] = useState<EdicionInfo | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [grupoSanguineo, setGrupoSanguineo] = useState('');
  const [alergias, setAlergias] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [condicionesEspeciales, setCondicionesEspeciales] = useState('');
  const [tienePrimerosAuxilios, setTienePrimerosAuxilios] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/ediciones/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setLoadError(data.error ?? 'No se pudo cargar la edición');
        } else {
          setEdicion(await res.json());
        }
      })
      .catch(() => setLoadError('Error de conexión'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`/api/ediciones/${id}/postular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grupo_sanguineo: grupoSanguineo || null,
          alergias: alergias || null,
          medicamentos: medicamentos || null,
          condiciones_especiales: condicionesEspeciales || null,
          tiene_primeros_auxilios: tienePrimerosAuxilios,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? 'Error al postular');
      } else {
        setSuccess(true);
      }
    } catch {
      setSubmitError('Error de conexión. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-red-600">{loadError}</p>
        <Link href="/cursos" className="text-blue-600 hover:underline text-sm">
          Volver a talleres
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Postulación enviada</h2>
          <p className="text-gray-600">
            Tu postulación para <strong>{edicion?.name}</strong> fue recibida. El coordinador
            revisará tu solicitud y te notificará el resultado.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Panel
            </Link>
            <Link
              href="/cursos"
              className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver talleres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const spotsLeft = edicion ? edicion.capacity - edicion._count.inscripciones : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link
        href={`/cursos/${edicion?.taller ? '' : ''}`}
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </Link>

      <div className="space-y-6">
        {/* Edition info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{edicion?.name}</h1>
          <p className="text-sm text-blue-700 font-medium">{edicion?.taller.name}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
            {edicion?.start_date && (
              <span>
                Fecha:{' '}
                {new Date(edicion.start_date).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
            <span>Cupos: {spotsLeft > 0 ? `${spotsLeft} disponibles` : 'Lista de espera'}</span>
            {edicion?.price !== null && edicion?.price !== undefined && (
              <span>Arancel: ${Number(edicion.price).toLocaleString('es-CL')} CLP</span>
            )}
            {edicion && edicion.required_points > 0 && (
              <span>Puntos requeridos: {edicion.required_points}</span>
            )}
          </div>
        </div>

        {/* Health form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Información de salud</h2>
          <p className="text-xs text-gray-500">
            Esta información es confidencial y solo será vista por el coordinador.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo sanguíneo
            </label>
            <select
              value={grupoSanguineo}
              onChange={(e) => setGrupoSanguineo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar…</option>
              {grupoOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
            <textarea
              value={alergias}
              onChange={(e) => setAlergias(e.target.value)}
              placeholder="Ej: mariscos, penicilina, látex…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicamentos (uso regular)
            </label>
            <textarea
              value={medicamentos}
              onChange={(e) => setMedicamentos(e.target.value)}
              placeholder="Ej: insulina, antihipertensivos…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condiciones especiales
            </label>
            <textarea
              value={condicionesEspeciales}
              onChange={(e) => setCondicionesEspeciales(e.target.value)}
              placeholder="Otras condiciones de salud relevantes para la actividad…"
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="primeros-auxilios"
              checked={tienePrimerosAuxilios}
              onChange={(e) => setTienePrimerosAuxilios(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="primeros-auxilios" className="text-sm text-gray-700">
              Tengo formación en primeros auxilios
            </label>
          </div>

          {submitError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando postulación…' : 'Enviar postulación'}
          </button>
        </form>
      </div>
    </div>
  );
}

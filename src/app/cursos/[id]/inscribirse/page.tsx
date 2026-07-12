'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InscribirseePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ course_name: string; status: string } | null>(null);

  useEffect(() => {
    fetch(`/api/cursos/${id}/inscribirse`, { method: 'POST' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Error al inscribirse');
        } else {
          setResult({ course_name: data.course_name, status: data.enrollment.status });
        }
      })
      .catch(() => setError('Error de conexión. Intenta nuevamente.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Procesando inscripción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">No se pudo inscribir</h2>
          <p className="text-gray-600">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href={`/cursos/${id}`} className="text-blue-600 hover:underline text-sm font-medium">
              Volver al curso
            </Link>
            <Link href="/cursos" className="text-gray-600 hover:underline text-sm">
              Ver todos los cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {result?.status === 'waitlisted' ? '¡En lista de espera!' : '¡Inscripción exitosa!'}
        </h2>
        <p className="text-gray-600">
          {result?.status === 'waitlisted'
            ? `Te has unido a la lista de espera para ${result.course_name}. Te contactaremos si se libera un cupo.`
            : `Te has inscrito correctamente en ${result?.course_name}. Recibirás un correo con los detalles.`
          }
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
            Ver más cursos
          </Link>
        </div>
      </div>
    </div>
  );
}

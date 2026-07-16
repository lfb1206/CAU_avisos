'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password/confirm`;
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), { redirectTo });

    if (authError) {
      setError('No se pudo enviar el correo. Intenta nuevamente.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Revisa tu correo</h2>
          <p className="text-gray-600">
            Si <strong>{email}</strong> tiene una cuenta, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/Logo.png" alt="CAU" className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Restablecer contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@correo.cl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

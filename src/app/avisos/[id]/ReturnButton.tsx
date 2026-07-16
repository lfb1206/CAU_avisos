'use client';
import React, { useState } from 'react';

export default function ReturnButton({ avisoId }: { avisoId: number }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/avisos/${avisoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      if (res.ok) {
        setDone(true);
      }
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg whitespace-nowrap">
        Regreso notificado ✓
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? 'Notificando…' : 'Notificar Regreso'}
    </button>
  );
}

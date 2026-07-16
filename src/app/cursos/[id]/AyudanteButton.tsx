'use client';

import React, { useState } from 'react';

export default function AyudanteButton({ edicionId }: { edicionId: number }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handle = async () => {
    setState('loading');
    try {
      const res = await fetch(`/api/ediciones/${edicionId}/ayudante`, { method: 'POST' });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg">
        Postulación de ayudante enviada ✓
      </span>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={state === 'loading'}
      className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {state === 'loading' ? 'Registrando…' : state === 'error' ? 'Error — reintentar' : 'Postular como ayudante'}
    </button>
  );
}

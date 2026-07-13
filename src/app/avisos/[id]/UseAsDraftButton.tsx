'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UseAsDraftButton({ avisoId, tipo }: { avisoId: number; tipo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/avisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id: avisoId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(tipo === 'rapido' ? `/aviso/rapido?id=${data.id}` : `/?aviso=${data.id}`);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? 'Creando borrador…' : 'Usar como borrador'}
    </button>
  );
}

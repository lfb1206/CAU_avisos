'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoanCartLine } from '@/types';

interface AvisoOption {
  id: number;
  title: string;
  status: string;
  tipo: string;
}

const MAX_LOAN_DURATION_DAYS = 14;

function todayPlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

interface LoanRequestFormProps {
  cartLines: LoanCartLine[];
  onChangeQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

/**
 * The Resumen tab's content: full cart review, Aviso picker, return date, and submit.
 * This is the one unambiguous "finish here" step the old form's per-section flow lacked.
 */
export default function LoanRequestForm({ cartLines, onChangeQuantity, onRemove }: LoanRequestFormProps) {
  const router = useRouter();
  const [avisos, setAvisos] = useState<AvisoOption[]>([]);
  const [avisosLoading, setAvisosLoading] = useState(true);
  const [avisoId, setAvisoId] = useState<number | ''>('');
  const [returnDueDate, setReturnDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/avisos')
      .then((res) => res.json())
      .then((data: AvisoOption[]) => setAvisos(Array.isArray(data) ? data.filter((a) => a.status !== 'draft') : []))
      .catch(() => setAvisos([]))
      .finally(() => setAvisosLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cartLines.length === 0) {
      setError('Agrega al menos un ítem en las pestañas de equipo antes de enviar.');
      return;
    }
    if (!avisoId) {
      setError('Debes seleccionar un aviso de salida enviado para esta solicitud.');
      return;
    }
    if (!returnDueDate) {
      setError('Indica la fecha de devolución.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/prestamos/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aviso_id: avisoId,
          return_due_date: new Date(returnDueDate).toISOString(),
          items: cartLines.map((line) => ({ inventory_item_id: line.inventory_item_id, quantity: line.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'No se pudo enviar la solicitud.');
        return;
      }
      setSuccess(data.id);
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold mb-1">Solicitud #{success} enviada</p>
        <p className="text-sm text-green-700 mb-4">
          El Custodio la revisará y te avisaremos por correo cuando sea aprobada o rechazada.
        </p>
        <button
          onClick={() => router.push(`/prestamos/${success}`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Ver mi solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Resumen de tu solicitud</h3>
        {cartLines.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
            Todavía no has agregado equipo. Ve a las pestañas de categorías arriba para elegir.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {cartLines.map((line) => (
              <div key={line.inventory_item_id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{line.descripcion}</p>
                  <p className="text-xs text-gray-400">{line.uso}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={line.disponible}
                    value={line.quantity}
                    onChange={(e) => onChangeQuantity(line.inventory_item_id, Math.max(1, Number(e.target.value)))}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-center"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(line.inventory_item_id)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aviso de salida *</label>
          {avisosLoading ? (
            <p className="text-sm text-gray-400">Cargando tus avisos…</p>
          ) : avisos.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              No tienes ningún aviso de salida enviado. Debes crear y enviar un aviso antes de solicitar equipo del Equipo Club.
            </p>
          ) : (
            <select
              required
              value={avisoId}
              onChange={(e) => setAvisoId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Selecciona un aviso</option>
              {avisos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title || `Aviso #${a.id}`} ({a.tipo === 'rapido' ? 'Rápido' : 'Largo'})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de devolución *</label>
          <input
            type="date"
            required
            min={todayPlusDays(1)}
            max={todayPlusDays(MAX_LOAN_DURATION_DAYS)}
            value={returnDueDate}
            onChange={(e) => setReturnDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Máximo {MAX_LOAN_DURATION_DAYS} días desde hoy.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || cartLines.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}

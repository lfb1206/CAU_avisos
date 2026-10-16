'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoanCartLine } from '@/types';

export interface AvisoOption {
  id: number;
  title: string;
  status: string;
  tipo: string;
  activity_date: string | null;
}

const MAX_LOAN_DURATION_DAYS = 14;

function todayPlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

interface LoanRequestFormProps {
  cartLines: LoanCartLine[];
  onChangeQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  avisos: AvisoOption[];
  avisosLoading: boolean;
  avisoId: number | '';
  onChangeAvisoId: (id: number | '') => void;
  pickupDueDate: string;
  onChangePickupDueDate: (date: string) => void;
  returnDueDate: string;
  onChangeReturnDueDate: (date: string) => void;
}

/**
 * The Resumen panel's content: cart review, optional Aviso link, dates, and submit.
 * Dates/aviso selection are lifted into PrestamosCatalog so they survive switching
 * between category tabs and back — this component only renders them.
 */
export default function LoanRequestForm({
  cartLines,
  onChangeQuantity,
  onRemove,
  avisos,
  avisosLoading,
  avisoId,
  onChangeAvisoId,
  pickupDueDate,
  onChangePickupDueDate,
  returnDueDate,
  onChangeReturnDueDate,
}: LoanRequestFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<number | null>(null);

  const selectedAviso = avisoId ? avisos.find((a) => a.id === avisoId) ?? null : null;
  const avisoOutOfRange =
    !!selectedAviso?.activity_date &&
    !!pickupDueDate &&
    !!returnDueDate &&
    (selectedAviso.activity_date.split('T')[0] < pickupDueDate ||
      selectedAviso.activity_date.split('T')[0] > returnDueDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cartLines.length === 0) {
      setError('Agrega al menos un ítem en las pestañas de equipo antes de enviar.');
      return;
    }
    if (!pickupDueDate) {
      setError('Indica la fecha de retiro.');
      return;
    }
    if (!returnDueDate) {
      setError('Indica la fecha de devolución.');
      return;
    }
    if (returnDueDate < pickupDueDate) {
      setError('La fecha de devolución no puede ser anterior a la fecha de retiro.');
      return;
    }
    // Not blocking: linking an aviso isn't required yet. avisoOutOfRange only
    // drives the informational note below, kept ready for when it does become one.

    setSubmitting(true);
    try {
      const res = await fetch('/api/prestamos/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aviso_id: avisoId || null,
          pickup_due_date: new Date(pickupDueDate).toISOString(),
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de retiro *</label>
          <input
            type="date"
            required
            min={todayPlusDays(0)}
            value={pickupDueDate}
            onChange={(e) => {
              const value = e.target.value;
              onChangePickupDueDate(value);
              // Keep return date valid relative to the new pickup date instead of
              // silently submitting a stale, now-invalid combination.
              if (returnDueDate && returnDueDate < value) onChangeReturnDueDate(value);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de devolución *</label>
          <input
            type="date"
            required
            disabled={!pickupDueDate}
            min={pickupDueDate || todayPlusDays(0)}
            max={pickupDueDate ? addDays(pickupDueDate, MAX_LOAN_DURATION_DAYS) : undefined}
            value={returnDueDate}
            onChange={(e) => onChangeReturnDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            {pickupDueDate ? 'Máximo' : 'Elige primero la fecha de retiro. Máximo'} {MAX_LOAN_DURATION_DAYS} días entre retiro y devolución.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aviso de salida (opcional)</label>
          {avisosLoading ? (
            <p className="text-sm text-gray-400">Cargando tus avisos…</p>
          ) : avisos.length === 0 ? (
            <p className="text-xs text-gray-400">No tienes avisos enviados todavía. Puedes vincular uno más tarde o dejar esto en blanco.</p>
          ) : (
            <select
              value={avisoId}
              onChange={(e) => onChangeAvisoId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Sin vincular</option>
              {avisos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title || `Aviso #${a.id}`} ({a.tipo === 'rapido' ? 'Rápido' : 'Largo'})
                  {a.activity_date ? ` · ${new Date(a.activity_date).toLocaleDateString('es-CL')}` : ''}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Si vinculas un aviso, su fecha debe caer entre el retiro y la devolución del equipo.
          </p>
          {avisoOutOfRange && (
            <p className="text-xs text-amber-600 mt-1">
              Nota: la fecha de este aviso no está dentro del rango de retiro/devolución elegido. Esto no te impide enviar la solicitud.
            </p>
          )}
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

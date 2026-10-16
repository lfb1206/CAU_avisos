'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { LoanRequest } from '@/types';

const statusLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  entregado: 'Entregado',
  devuelto: 'Devuelto',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

export default function LoanReviewPanel({ id }: { id: number }) {
  const [loan, setLoan] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/prestamos/solicitudes/${id}`);
      if (!res.ok) { setError('No se pudo cargar la solicitud.'); return; }
      setLoan(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const runAction = async (action: string, body?: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/custodio/solicitudes/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'No se pudo completar la acción.');
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = () => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;
    runAction('reject', { cancel_reason: reason });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (error || !loan) return <div className="p-8 text-center text-red-600">{error || 'No encontrado'}</div>;

  const overdue = loan.status === 'entregado' && new Date(loan.return_due_date) < new Date();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Link href="/custodio" className="text-sm text-blue-600 hover:underline">← Volver al panel</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Solicitud #{loan.id}</h1>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {overdue ? 'Atrasado' : statusLabel[loan.status] ?? loan.status}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-1">
        <p className="text-sm font-medium text-gray-900">{loan.user?.name || loan.user?.email}</p>
        <p className="text-xs text-gray-500">{loan.user?.email} {loan.user?.phone ? `· ${loan.user.phone}` : ''} {loan.user?.rut ? `· RUT ${loan.user.rut}` : ''}</p>
      </div>

      {loan.aviso && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-1">
          <h2 className="text-sm font-semibold text-blue-900">Aviso de salida vinculado</h2>
          <p className="text-sm text-blue-800">{loan.aviso.activity_type ?? '—'} · {loan.aviso.location ?? 'Sin sector'}</p>
          {loan.aviso.activity_date && (
            <p className="text-xs text-blue-700">Fecha: {new Date(loan.aviso.activity_date).toLocaleDateString('es-CL')}</p>
          )}
          {loan.aviso.participant_names_text && (
            <p className="text-xs text-blue-700">Participantes: {loan.aviso.participant_names_text}</p>
          )}
          <Link href={`/avisos/${loan.aviso.id}`} className="text-xs text-blue-600 hover:underline inline-block mt-1">
            Ver aviso completo →
          </Link>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {(loan.items ?? []).map((item) => (
          <div key={item.id} className="px-4 py-3 flex justify-between text-sm">
            <span>{item.inventory_item?.descripcion}</span>
            <span className="text-gray-500">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600 space-y-0.5">
        <p>Fecha de retiro: {new Date(loan.pickup_due_date).toLocaleDateString('es-CL')}</p>
        <p>Fecha de devolución: {new Date(loan.return_due_date).toLocaleDateString('es-CL')}</p>
      </div>

      {loan.cancel_reason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <strong>Motivo:</strong> {loan.cancel_reason}
        </div>
      )}

      {loan.notas_custodio && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
          <strong>Notas del custodio:</strong> {loan.notas_custodio}
        </div>
      )}

      {loan.return_photo_base64 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Foto de devolución (último estado del equipo)</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={loan.return_photo_base64} alt="Foto de devolución" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
        </div>
      )}

      {loan.status === 'pendiente' && (
        <div className="flex gap-3">
          <button
            onClick={() => runAction('approve')}
            disabled={busy}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={handleReject}
            disabled={busy}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      )}

      {loan.status === 'aprobado' && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Entregar equipo</h2>
          <p className="text-xs text-gray-500 mb-3">Confirma cuando el socio haya retirado el equipo.</p>
          <button
            onClick={() => runAction('deliver')}
            disabled={busy}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Marcar como entregado
          </button>
        </div>
      )}

      {loan.status === 'entregado' && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Confirmar devolución</h2>
          {loan.return_photo_base64 ? (
            <button
              onClick={() => runAction('return')}
              disabled={busy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-sm font-semibold disabled:opacity-50"
            >
              Confirmar devolución
            </button>
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              El solicitante todavía no sube la foto de devolución. No puedes confirmar hasta que la suba desde su solicitud.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

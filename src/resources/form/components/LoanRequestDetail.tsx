'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { LoanRequest } from '@/types';
import LoanPhotoCapture from './LoanPhotoCapture';

const statusLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  entregado: 'Entregado',
  devuelto: 'Devuelto',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

const statusColor: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  aprobado: 'bg-blue-100 text-blue-700',
  entregado: 'bg-green-100 text-green-800',
  devuelto: 'bg-gray-100 text-gray-500',
  rechazado: 'bg-red-100 text-red-700',
  cancelado: 'bg-gray-100 text-gray-500',
};

export default function LoanRequestDetail({ id }: { id: number }) {
  const [loan, setLoan] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const handleUploadReturnPhoto = async (base64: string) => {
    setUploading(true);
    try {
      const res = await fetch(`/api/prestamos/solicitudes/${id}/foto-devolucion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_photo_base64: base64 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'No se pudo subir la foto.');
        return;
      }
      await load();
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('¿Cancelar esta solicitud?')) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/prestamos/solicitudes/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'No se pudo cancelar.');
        return;
      }
      await load();
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (error || !loan) return <div className="p-8 text-center text-red-600">{error || 'No encontrado'}</div>;

  const overdue = loan.status === 'entregado' && new Date(loan.return_due_date) < new Date();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Volver</Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Solicitud #{loan.id}</h1>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${overdue ? 'bg-red-100 text-red-700' : statusColor[loan.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {overdue ? 'Atrasado' : statusLabel[loan.status] ?? loan.status}
        </span>
      </div>

      {loan.cancel_reason && (loan.status === 'rechazado' || loan.status === 'cancelado') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <strong>Motivo:</strong> {loan.cancel_reason}
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

      {(loan.status === 'pendiente' || loan.status === 'aprobado') && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
        >
          {cancelling ? 'Cancelando...' : 'Cancelar solicitud'}
        </button>
      )}

      {loan.status === 'entregado' && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Foto de devolución</h2>
          <p className="text-xs text-gray-500 mb-3">
            Antes de devolver el equipo, sube una foto de su estado. El Custodio no puede confirmar la devolución hasta que la subas.
          </p>
          <LoanPhotoCapture
            label="Subir foto de devolución"
            initialPreview={loan.return_photo_base64}
            onCapture={handleUploadReturnPhoto}
          />
          {uploading && <p className="text-xs text-gray-400 mt-2">Subiendo...</p>}
          {loan.return_photo_uploaded_at && (
            <p className="text-xs text-green-600 mt-2">Foto subida. Ya puedes devolver el equipo al Custodio.</p>
          )}
        </div>
      )}
    </div>
  );
}

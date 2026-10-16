'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { LoanRequest } from '@/types';

const TABS = [
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'activos', label: 'Activos' },
  { key: 'historial', label: 'Historial' },
] as const;

export default function CustodioDashboard() {
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('pendiente');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/custodio/solicitudes');
      if (res.status === 403) { setError('Se requieren permisos de custodio.'); return; }
      if (!res.ok) { setError('Error al cargar solicitudes.'); return; }
      setLoans(await res.json());
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (loan: LoanRequest) => {
    setBusyId(loan.id);
    try {
      const res = await fetch(`/api/custodio/solicitudes/${loan.id}/approve`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'No se pudo aprobar.');
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (loan: LoanRequest) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;
    setBusyId(loan.id);
    try {
      const res = await fetch(`/api/custodio/solicitudes/${loan.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancel_reason: reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'No se pudo rechazar.');
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const pendientes = loans.filter((l) => l.status === 'pendiente');
  const activos = loans.filter((l) => l.status === 'aprobado' || l.status === 'entregado');
  const historial = loans.filter((l) => l.status === 'devuelto' || l.status === 'rechazado' || l.status === 'cancelado');

  const visible = tab === 'pendiente' ? pendientes : tab === 'activos' ? activos : historial;

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando solicitudes...</div>;
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custodio de Equipo</h1>
          <p className="text-sm text-gray-500">Equipo Club</p>
        </div>
        <Link href="/custodio/catalogo" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Gestionar catálogo →
        </Link>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => {
          const count = t.key === 'pendiente' ? pendientes.length : t.key === 'activos' ? activos.length : historial.length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">Sin solicitudes en esta pestaña.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((loan) => {
            const overdue = loan.status === 'entregado' && new Date(loan.return_due_date) < new Date();
            const itemsSummary = (loan.items ?? []).map((i) => `${i.quantity}x ${i.inventory_item?.descripcion}`).join(', ');
            return (
              <div key={loan.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{loan.user?.name || loan.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{itemsSummary}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Devolución: {new Date(loan.return_due_date).toLocaleDateString('es-CL')}
                      {overdue && <span className="ml-2 text-red-600 font-medium">Atrasado</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {loan.status === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handleApprove(loan)}
                          disabled={busyId === loan.id}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium disabled:opacity-50"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(loan)}
                          disabled={busyId === loan.id}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-md font-medium disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    <Link href={`/custodio/solicitudes/${loan.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Ver →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

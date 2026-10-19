'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { InventoryItem, LoanCartLine } from '@/types';
import LoanRequestForm, { type AvisoOption } from './LoanRequestForm';

const RESUMEN_TAB = '__resumen__';

/**
 * Single tabbed page: one tab per equipment category. "Resumen" lives as its own
 * button above the tabs rather than as one of them, and its dates/aviso selection
 * are lifted up here (instead of living inside LoanRequestForm) so switching to a
 * category tab and back never resets them.
 */
export default function PrestamosCatalog() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [photoItem, setPhotoItem] = useState<InventoryItem | null>(null);

  const [avisos, setAvisos] = useState<AvisoOption[]>([]);
  const [avisosLoading, setAvisosLoading] = useState(true);
  const [avisoId, setAvisoId] = useState<number | ''>('');
  const [pickupDueDate, setPickupDueDate] = useState('');
  const [returnDueDate, setReturnDueDate] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/prestamos/items');
      if (!res.ok) { setError('Error al cargar el catálogo de equipo.'); return; }
      const data: InventoryItem[] = await res.json();
      setItems(data);
      const firstCategory = Array.from(new Set(data.map((i) => i.uso))).sort()[0];
      if (firstCategory) setActiveTab(firstCategory);
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch('/api/avisos')
      .then((res) => res.json())
      .then((data: AvisoOption[]) => setAvisos(Array.isArray(data) ? data.filter((a) => a.status !== 'draft') : []))
      .catch(() => setAvisos([]))
      .finally(() => setAvisosLoading(false));
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.uso))).sort(), [items]);

  const cartLines: LoanCartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, quantity]) => {
          const item = items.find((i) => i.id === Number(itemId));
          return item
            ? { inventory_item_id: item.id, descripcion: item.descripcion, uso: item.uso, disponible: item.disponible ?? 0, quantity }
            : null;
        })
        .filter((line): line is LoanCartLine => line !== null),
    [cart, items]
  );

  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);

  const setQuantity = (itemId: number, quantity: number) => {
    setCart((prev) => ({ ...prev, [itemId]: Math.max(0, quantity) }));
  };

  const addOne = (item: InventoryItem) => {
    const current = cart[item.id] ?? 0;
    if (current >= (item.disponible ?? 0)) return;
    setQuantity(item.id, current + 1);
  };

  const removeOne = (item: InventoryItem) => {
    setQuantity(item.id, (cart[item.id] ?? 0) - 1);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando catálogo de Equipo Club...</div>;
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={load} className="text-blue-600 hover:underline text-sm">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Equipo Club</h1>
          <p className="text-sm text-gray-500">
            Elige el equipo que necesitas en cada categoría y luego revisa y envía tu solicitud en Resumen.
          </p>
        </div>
        <button
          onClick={() => setActiveTab(RESUMEN_TAB)}
          className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            activeTab === RESUMEN_TAB
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Resumen{cartCount > 0 ? ` (${cartCount})` : ''}
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === cat
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeTab === RESUMEN_TAB ? (
        <LoanRequestForm
          cartLines={cartLines}
          onChangeQuantity={(itemId, qty) => setQuantity(itemId, qty)}
          onRemove={(itemId) => setQuantity(itemId, 0)}
          avisos={avisos}
          avisosLoading={avisosLoading}
          avisoId={avisoId}
          onChangeAvisoId={setAvisoId}
          pickupDueDate={pickupDueDate}
          onChangePickupDueDate={setPickupDueDate}
          returnDueDate={returnDueDate}
          onChangeReturnDueDate={setReturnDueDate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items
            .filter((item) => item.uso === activeTab)
            .map((item) => {
              const inCart = cart[item.id] ?? 0;
              const disponible = item.disponible ?? 0;
              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.descripcion}</p>
                      {item.tiene_foto && (
                        <button
                          type="button"
                          onClick={() => setPhotoItem(item)}
                          className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                        >
                          Ver foto
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {disponible > 0 ? `${disponible} disponible${disponible === 1 ? '' : 's'}` : 'Sin disponibilidad'}
                    </p>
                    {item.instrucciones_uso && (
                      <p className="text-xs text-amber-700 mt-0.5 font-medium">{item.instrucciones_uso}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeOne(item)}
                      disabled={inCart === 0}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{inCart}</span>
                    <button
                      type="button"
                      onClick={() => addOne(item)}
                      disabled={inCart >= disponible}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          {items.filter((item) => item.uso === activeTab).length === 0 && (
            <p className="text-sm text-gray-400 col-span-2 text-center py-8">Sin equipo en esta categoría.</p>
          )}
        </div>
      )}

      {/* Persistent cart indicator — visible on every category tab, never a dead end */}
      {activeTab !== RESUMEN_TAB && cartCount > 0 && (
        <button
          onClick={() => setActiveTab(RESUMEN_TAB)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg text-sm font-semibold"
        >
          {cartCount} ítem{cartCount === 1 ? '' : 's'} seleccionado{cartCount === 1 ? '' : 's'} · Ir al resumen
        </button>
      )}

      {photoItem && <ItemPhotoPreview item={photoItem} onClose={() => setPhotoItem(null)} />}
    </div>
  );
}

function ItemPhotoPreview({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prestamos/items/${item.id}/foto`)
      .then((res) => res.json())
      .then((data: { foto?: string | null }) => setFoto(data.foto ?? null))
      .finally(() => setLoading(false));
  }, [item.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{item.descripcion}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Cargando...</p>
          ) : foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={item.descripcion} className="w-full rounded-lg border border-gray-200" />
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">Foto no disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}

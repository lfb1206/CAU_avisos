'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { InventoryItem, LoanCartLine } from '@/types';
import LoanRequestForm from './LoanRequestForm';

const RESUMEN_TAB = '__resumen__';

/**
 * Single tabbed page: one tab per equipment category, plus a final "Resumen" tab.
 * Switching tabs never navigates away or "finishes" anything — the cart is shared
 * local state across every tab, so there's no equivalent of the old Google Form's
 * per-category "terminé" dead end (the #1 source of "is this broken?" reports).
 */
export default function PrestamosCatalog() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>('');

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Equipo Club</h1>
        <p className="text-sm text-gray-500">
          Elige el equipo que necesitas en cada categoría y luego revisa y envía tu solicitud en la pestaña Resumen.
        </p>
      </div>

      {/* Category tabs + Resumen */}
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
        <button
          onClick={() => setActiveTab(RESUMEN_TAB)}
          className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
            activeTab === RESUMEN_TAB
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Resumen{cartCount > 0 ? ` (${cartCount})` : ''}
        </button>
      </div>

      {activeTab === RESUMEN_TAB ? (
        <LoanRequestForm
          cartLines={cartLines}
          onChangeQuantity={(itemId, qty) => setQuantity(itemId, qty)}
          onRemove={(itemId) => setQuantity(itemId, 0)}
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
                    <p className="text-sm font-medium text-gray-900 truncate">{item.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {disponible > 0 ? `${disponible} disponible${disponible === 1 ? '' : 's'}` : 'Sin disponibilidad'}
                    </p>
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
    </div>
  );
}

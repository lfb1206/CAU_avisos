'use client';
import React, { useEffect, useState } from 'react';
import type { InventoryItem } from '@/types';
import AutocompleteInput from './AutocompleteInput';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface ItemRow {
  inventory_item_id: number | '';
  quantity: number;
}

interface ManualLoanModalProps {
  items: InventoryItem[];
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Lets the custodio register gear that's already out — e.g. migrated from the old
 * system, or an in-person/phone request — without the member going through the
 * self-service flow. This is the supported way to correct availability for gear
 * that's physically lent out but has no LoanRequest yet; there's deliberately no
 * raw "available" number to hand-edit on an item, since availability is always
 * computed from real loan records.
 */
export default function ManualLoanModal({ items, onClose, onSaved }: ManualLoanModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [pickupDueDate, setPickupDueDate] = useState('');
  const [returnDueDate, setReturnDueDate] = useState('');
  const [notas, setNotas] = useState('');
  const [rows, setRows] = useState<ItemRow[]>([{ inventory_item_id: '', quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data: { members?: Member[] }) => setMembers(data.members ?? []))
      .catch(() => setMembers([]));
  }, []);

  const memberOptionLabel = (m: Member) => `${m.name} (${m.email})`;
  const memberOptions = members.map(memberOptionLabel);
  const selectedMember = members.find((m) => memberOptionLabel(m) === memberInput);

  const activeItems = items.filter((i) => i.active);

  const updateRow = (index: number, updates: Partial<ItemRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...updates } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, { inventory_item_id: '', quantity: 1 }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMember) {
      setError('Selecciona un socio registrado de la lista.');
      return;
    }
    if (!pickupDueDate || !returnDueDate) {
      setError('Indica fecha de retiro y de devolución.');
      return;
    }
    const validRows = rows.filter((r) => r.inventory_item_id !== '' && r.quantity > 0);
    if (validRows.length === 0) {
      setError('Agrega al menos un ítem.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/custodio/solicitudes/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_email: selectedMember.email,
          pickup_due_date: new Date(pickupDueDate).toISOString(),
          return_due_date: new Date(returnDueDate).toISOString(),
          notas_custodio: notas || undefined,
          items: validRows.map((r) => ({ inventory_item_id: r.inventory_item_id, quantity: r.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'No se pudo registrar el préstamo.');
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError('Error de conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Registrar préstamo existente</h3>
          <p className="text-xs text-gray-500 mt-1">
            Para equipo que ya está en manos de un socio (migrado del sistema anterior, o una solicitud en persona/por teléfono).
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <AutocompleteInput
            label="Socio"
            required
            value={memberInput}
            onChange={setMemberInput}
            options={memberOptions}
            placeholder="Buscar por nombre..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ítems *</label>
            <div className="space-y-2">
              {rows.map((row, index) => {
                const selected = typeof row.inventory_item_id === 'number'
                  ? activeItems.find((i) => i.id === row.inventory_item_id)
                  : undefined;
                return (
                  <div key={index} className="flex gap-2 items-start">
                    <select
                      value={row.inventory_item_id}
                      onChange={(e) => updateRow(index, { inventory_item_id: e.target.value ? Number(e.target.value) : '' })}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm min-w-0"
                    >
                      <option value="">Seleccionar ítem...</option>
                      {activeItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.descripcion} ({item.disponible ?? 0} disponibles)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={selected?.disponible ?? undefined}
                      value={row.quantity}
                      onChange={(e) => updateRow(index, { quantity: Math.max(1, Number(e.target.value)) })}
                      className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center flex-shrink-0"
                    />
                    {rows.length > 1 && (
                      <button type="button" onClick={() => removeRow(index)} className="text-gray-400 hover:text-red-600 px-1 flex-shrink-0">
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={addRow} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              + Agregar ítem
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de retiro *</label>
              <input
                type="date"
                required
                value={pickupDueDate}
                onChange={(e) => setPickupDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de devolución *</label>
              <input
                type="date"
                required
                min={pickupDueDate || undefined}
                value={returnDueDate}
                onChange={(e) => setReturnDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              placeholder="Ej: migrado del sistema anterior, solicitado por WhatsApp..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Registrando...' : 'Registrar préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

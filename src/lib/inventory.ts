import type { LoanStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** v1 has exactly one pool; new pools just need a new key, not a schema change. */
export const EQUIPO_CLUB_POOL_KEY = 'equipo_club';

/** Loan statuses that still count against an item's available quantity. */
export const RESERVED_LOAN_STATUSES: LoanStatus[] = ['pendiente', 'aprobado', 'entregado'];

/** Maximum days between pickup and return-due date, enforced at request creation. */
export const MAX_LOAN_DURATION_DAYS = 14;

/** Creates the Equipo Club pool row on first use if it doesn't exist yet. */
export async function ensureEquipoClubPool() {
  return prisma.inventoryPool.upsert({
    where: { key: EQUIPO_CLUB_POOL_KEY },
    update: {},
    create: { key: EQUIPO_CLUB_POOL_KEY, name: 'Equipo Club', requisitos: 'Adjuntar aviso de salida' },
  });
}

/**
 * Validates the actual loan duration (pickup → return), not time-since-request —
 * a request made today for pickup in three weeks and return a week after that is a
 * one-week loan, not a four-week one.
 */
export function isLoanDurationWithinCap(pickupDueDate: Date, returnDueDate: Date): boolean {
  const maxMs = MAX_LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000;
  return returnDueDate.getTime() - pickupDueDate.getTime() <= maxMs;
}

/**
 * Computes live availability for a set of inventory items in one batched query:
 * available = cantidad - en_inspeccion - sum(quantity across reserved-status LoanItems).
 * Never store this — always derive it, so it can't drift from reality like the old
 * spreadsheet's manually-edited "Disponibles" column did.
 */
export async function getAvailability(
  items: { id: number; cantidad: number; en_inspeccion: number }[]
): Promise<Map<number, number>> {
  if (items.length === 0) return new Map();

  const reserved = await prisma.loanItem.groupBy({
    by: ['inventory_item_id'],
    where: {
      inventory_item_id: { in: items.map((item) => item.id) },
      loan_request: { status: { in: RESERVED_LOAN_STATUSES } },
    },
    _sum: { quantity: true },
  });

  const reservedByItem = new Map(reserved.map((row) => [row.inventory_item_id, row._sum.quantity ?? 0]));

  return new Map(
    items.map((item) => [item.id, item.cantidad - item.en_inspeccion - (reservedByItem.get(item.id) ?? 0)])
  );
}

/**
 * Which of the given items have at least one returned loan with a return photo on
 * file. Deliberately cheap — only existence, never the base64 payload itself — so
 * catalog-list responses stay light regardless of how many items have photos. The
 * actual photo is fetched separately, on demand, only when someone wants to view it.
 */
export async function getLatestReturnPhotoIds(itemIds: number[]): Promise<Set<number>> {
  if (itemIds.length === 0) return new Set();

  const rows = await prisma.loanItem.findMany({
    where: {
      inventory_item_id: { in: itemIds },
      loan_request: { status: 'devuelto', return_photo_base64: { not: null } },
    },
    select: { inventory_item_id: true },
    distinct: ['inventory_item_id'],
  });

  return new Set(rows.map((row) => row.inventory_item_id));
}

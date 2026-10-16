import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    loanItem: {
      groupBy: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { getAvailability, isLoanDurationWithinCap, MAX_LOAN_DURATION_DAYS } from './inventory';

describe('isLoanDurationWithinCap', () => {
  const pickup = new Date('2026-01-01T00:00:00Z');

  it('allows exactly MAX_LOAN_DURATION_DAYS days between pickup and return', () => {
    const exact = new Date(pickup);
    exact.setDate(exact.getDate() + MAX_LOAN_DURATION_DAYS);
    expect(isLoanDurationWithinCap(pickup, exact)).toBe(true);
  });

  it('rejects one day beyond the cap', () => {
    const tooFar = new Date(pickup);
    tooFar.setDate(tooFar.getDate() + MAX_LOAN_DURATION_DAYS + 1);
    expect(isLoanDurationWithinCap(pickup, tooFar)).toBe(false);
  });

  it('allows a short loan', () => {
    const soon = new Date(pickup);
    soon.setDate(soon.getDate() + 1);
    expect(isLoanDurationWithinCap(pickup, soon)).toBe(true);
  });

  it('is based on pickup-to-return, not request-time-to-return — a far-future pickup with a short loan after it is still valid', () => {
    const farPickup = new Date(pickup);
    farPickup.setDate(farPickup.getDate() + 60); // request made today, pickup in 2 months
    const returnSoonAfter = new Date(farPickup);
    returnSoonAfter.setDate(returnSoonAfter.getDate() + 3); // only a 3-day loan once picked up
    expect(isLoanDurationWithinCap(farPickup, returnSoonAfter)).toBe(true);
  });
});

describe('getAvailability', () => {
  it('returns the full cantidad when nothing is reserved', async () => {
    vi.mocked(prisma.loanItem.groupBy).mockResolvedValue([] as never);

    const result = await getAvailability([{ id: 1, cantidad: 5, en_inspeccion: 0 }]);

    expect(result.get(1)).toBe(5);
  });

  it('subtracts en_inspeccion and reserved quantities', async () => {
    vi.mocked(prisma.loanItem.groupBy).mockResolvedValue([
      { inventory_item_id: 1, _sum: { quantity: 2 } },
    ] as never);

    const result = await getAvailability([{ id: 1, cantidad: 5, en_inspeccion: 1 }]);

    expect(result.get(1)).toBe(2); // 5 - 1 (inspección) - 2 (reservado)
  });

  it('handles multiple items independently', async () => {
    vi.mocked(prisma.loanItem.groupBy).mockResolvedValue([
      { inventory_item_id: 2, _sum: { quantity: 3 } },
    ] as never);

    const result = await getAvailability([
      { id: 1, cantidad: 5, en_inspeccion: 0 },
      { id: 2, cantidad: 10, en_inspeccion: 0 },
    ]);

    expect(result.get(1)).toBe(5);
    expect(result.get(2)).toBe(7);
  });

  it('returns an empty map for an empty item list without querying the database', async () => {
    const groupBySpy = vi.mocked(prisma.loanItem.groupBy);
    groupBySpy.mockClear();

    const result = await getAvailability([]);

    expect(result.size).toBe(0);
    expect(groupBySpy).not.toHaveBeenCalled();
  });
});

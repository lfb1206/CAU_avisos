import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    taller: { findUnique: vi.fn() },
    edicionTaller: { upsert: vi.fn() },
    inscripcion: { upsert: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { POST } from './route';

describe('POST /api/coordinador/members/[id]/inscripciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(({ where }: { where: { id: string } }) =>
      Promise.resolve(where.id === 'coord-1' ? { id: 'coord-1', role: authState.role } : { id: where.id })
    );
    prismaMock.taller.findUnique.mockResolvedValue({ id: 1, name: 'Hielo' });
    prismaMock.edicionTaller.upsert.mockResolvedValue({ id: 10, taller_id: 1, name: 'Hielo — Histórico' });
    prismaMock.inscripcion.upsert.mockImplementation(({ create }) => Promise.resolve({ id: 99, ...create }));
  });

  it('rejects a plain member', async () => {
    authState.role = 'member';
    const res = await POST(mockRequest({ taller_id: 1 }), routeParams('member-1'));
    expect(res.status).toBe(403);
  });

  it('requires taller_id', async () => {
    const res = await POST(mockRequest({}), routeParams('member-1'));
    expect(res.status).toBe(400);
  });

  it('404s when the member does not exist', async () => {
    prismaMock.profile.findUnique.mockImplementation(({ where }: { where: { id: string } }) =>
      Promise.resolve(where.id === 'coord-1' ? { id: 'coord-1', role: authState.role } : null)
    );
    const res = await POST(mockRequest({ taller_id: 1 }), routeParams('member-1'));
    expect(res.status).toBe(404);
  });

  it('404s when the taller does not exist', async () => {
    prismaMock.taller.findUnique.mockResolvedValue(null);
    const res = await POST(mockRequest({ taller_id: 999 }), routeParams('member-1'));
    expect(res.status).toBe(404);
  });

  it('finds-or-creates a single "— Histórico" edicion per taller', async () => {
    await POST(mockRequest({ taller_id: 1 }), routeParams('member-1'));

    const [[upsertArgs]] = prismaMock.edicionTaller.upsert.mock.calls;
    expect(upsertArgs.where).toEqual({ taller_id_name: { taller_id: 1, name: 'Hielo — Histórico' } });
    expect(upsertArgs.create).toMatchObject({ taller_id: 1, name: 'Hielo — Histórico', enrollment_open: false });
  });

  it('creates the inscripcion as completado, defaulting aprobado_at to today when no date is given', async () => {
    const before = Date.now();
    const res = await POST(mockRequest({ taller_id: 1 }), routeParams('member-1'));
    expect(res.status).toBe(201);

    const [[upsertArgs]] = prismaMock.inscripcion.upsert.mock.calls;
    expect(upsertArgs.where).toEqual({ edicion_id_user_id: { edicion_id: 10, user_id: 'member-1' } });
    expect(upsertArgs.create).toMatchObject({ edicion_id: 10, user_id: 'member-1', status: 'completado', aprobado: true });
    expect(upsertArgs.create.aprobado_at.getTime()).toBeGreaterThanOrEqual(before);
  });

  it('uses the given completed_at date instead of today when provided', async () => {
    await POST(mockRequest({ taller_id: 1, completed_at: '2019-03-15T00:00:00.000Z' }), routeParams('member-1'));

    const [[upsertArgs]] = prismaMock.inscripcion.upsert.mock.calls;
    expect(upsertArgs.create.aprobado_at.toISOString()).toBe('2019-03-15T00:00:00.000Z');
  });

  it('is idempotent — re-running for the same member+taller updates rather than failing', async () => {
    await POST(mockRequest({ taller_id: 1, completed_at: '2019-03-15T00:00:00.000Z' }), routeParams('member-1'));
    await POST(mockRequest({ taller_id: 1, completed_at: '2020-01-01T00:00:00.000Z' }), routeParams('member-1'));

    expect(prismaMock.inscripcion.upsert).toHaveBeenCalledTimes(2);
    const [, [secondCallArgs]] = prismaMock.inscripcion.upsert.mock.calls;
    expect(secondCallArgs.update.aprobado_at.toISOString()).toBe('2020-01-01T00:00:00.000Z');
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    ayudantia: { findMany: vi.fn(), update: vi.fn() },
    coursePoints: { findFirst: vi.fn(), create: vi.fn() },
    edicionTaller: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, PATCH } from './route';

describe('/api/coordinador/ediciones/[id]/ayudantias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
    prismaMock.ayudantia.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: 1, user_id: 'u1', seleccionado: null, asistio: null, puntos_otorgados: false, ...data })
    );
    prismaMock.edicionTaller.findUnique.mockResolvedValue({ id: 10, name: 'Edición 2026', taller: { name: 'Taller' } });
  });

  describe('GET', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await GET(mockRequest(), routeParams(10));
      expect(res.status).toBe(403);
    });

    it('lists ayudantias for the edicion', async () => {
      prismaMock.ayudantia.findMany.mockResolvedValue([
        { id: 1, user_id: 'u1', seleccionado: true, asistio: null, puntos_otorgados: false, signed_up_at: new Date(), profile: { name: 'A', email: 'a@x.com' } },
      ]);
      const res = await GET(mockRequest(), routeParams(10));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(1);
    });
  });

  describe('PATCH', () => {
    it('requires user_id', async () => {
      const res = await PATCH(mockRequest({ asistio: true }), routeParams(10));
      expect(res.status).toBe(400);
    });

    it('updates seleccionado/asistio without touching points when puntos_otorgados is not set', async () => {
      await PATCH(mockRequest({ user_id: 'u1', seleccionado: true, asistio: true }), routeParams(10));

      const [[updateArgs]] = prismaMock.ayudantia.update.mock.calls;
      expect(updateArgs.data).toEqual({ seleccionado: true, asistio: true });
      expect(prismaMock.coursePoints.create).not.toHaveBeenCalled();
    });

    it('awards a point and records it once when puntos_otorgados is first set to true', async () => {
      prismaMock.coursePoints.findFirst.mockResolvedValue(null); // no prior award on file

      await PATCH(mockRequest({ user_id: 'u1', puntos_otorgados: true }), routeParams(10));

      expect(prismaMock.coursePoints.create).toHaveBeenCalledTimes(1);
      const [[createArgs]] = prismaMock.coursePoints.create.mock.calls;
      expect(createArgs.data).toMatchObject({ user_id: 'u1', edicion_id: 10, points: 1, awarded_by: 'coord-1' });
      expect(createArgs.data.expires_at.getFullYear()).toBe(new Date().getFullYear() + 1);
    });

    it('does not double-award points on a second puntos_otorgados=true call (idempotency guard)', async () => {
      // Regression test: the route can't rely on the just-updated ayudantia row to detect
      // "already awarded" (its own update already flipped the flag to true), so it must
      // check coursePoints directly — this simulates that an award already exists.
      prismaMock.coursePoints.findFirst.mockResolvedValue({ id: 1 });

      await PATCH(mockRequest({ user_id: 'u1', puntos_otorgados: true }), routeParams(10));

      expect(prismaMock.coursePoints.create).not.toHaveBeenCalled();
    });
  });
});

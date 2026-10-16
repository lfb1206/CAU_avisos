import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    edicionTaller: { update: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { PATCH, DELETE } from './route';

describe('/api/coordinador/ediciones/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
    prismaMock.edicionTaller.update.mockImplementation(({ data }) => Promise.resolve({ id: 10, ...data }));
  });

  describe('PATCH', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await PATCH(mockRequest({ capacity: 30 }), routeParams(10));
      expect(res.status).toBe(403);
    });

    it('opening enrollment auto-sets status to inscripciones_abiertas and stamps enrollment_opens_at', async () => {
      const res = await PATCH(mockRequest({ enrollment_open: true }), routeParams(10));
      expect(res.status).toBe(200);

      const [[updateArgs]] = prismaMock.edicionTaller.update.mock.calls;
      expect(updateArgs.data.enrollment_open).toBe(true);
      expect(updateArgs.data.status).toBe('inscripciones_abiertas');
      expect(updateArgs.data.enrollment_opens_at).toBeInstanceOf(Date);
    });

    it('closing enrollment clears enrollment_opens_at and keeps any explicitly-given status', async () => {
      const res = await PATCH(mockRequest({ enrollment_open: false, status: 'en_curso' }), routeParams(10));
      expect(res.status).toBe(200);

      const [[updateArgs]] = prismaMock.edicionTaller.update.mock.calls;
      expect(updateArgs.data.enrollment_open).toBe(false);
      expect(updateArgs.data.enrollment_opens_at).toBeNull();
      expect(updateArgs.data.status).toBe('en_curso');
    });

    it('leaves status untouched when enrollment_open is not part of the patch', async () => {
      await PATCH(mockRequest({ capacity: 25 }), routeParams(10));

      const [[updateArgs]] = prismaMock.edicionTaller.update.mock.calls;
      expect(updateArgs.data.capacity).toBe(25);
      expect(updateArgs.data).not.toHaveProperty('enrollment_open');
      expect(updateArgs.data).not.toHaveProperty('status');
    });

    it('rejects an invalid status value', async () => {
      const res = await PATCH(mockRequest({ status: 'not-a-real-status' }), routeParams(10));
      expect(res.status).toBe(400);
      expect(prismaMock.edicionTaller.update).not.toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await DELETE(mockRequest(), routeParams(10));
      expect(res.status).toBe(403);
    });

    it('soft-cancels the edicion and closes enrollment', async () => {
      const res = await DELETE(mockRequest(), routeParams(10));
      expect(res.status).toBe(204);
      expect(prismaMock.edicionTaller.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { status: 'cancelada', enrollment_open: false },
      });
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string } },
  prismaMock: {
    edicionTaller: { findUnique: vi.fn() },
    inscripcion: { findFirst: vi.fn() },
    ayudantia: { findUnique: vi.fn(), create: vi.fn(), deleteMany: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { POST, DELETE } from './route';

const openEdicion = (overrides: Record<string, unknown> = {}) => ({
  id: 10,
  status: 'inscripciones_abiertas',
  enrollment_open: true,
  taller: { id: 1, branch: 'base', name: 'Taller Base' },
  ...overrides,
});

describe('/api/ediciones/[id]/ayudante', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'user-1' };
    prismaMock.ayudantia.findUnique.mockResolvedValue(null);
    prismaMock.ayudantia.create.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));
  });

  describe('POST', () => {
    it('rejects an unauthenticated caller', async () => {
      authState.user = null;
      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(401);
    });

    it('404s for a non-existent edicion', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(null);
      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(404);
    });

    it('rejects when enrollment is closed', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ enrollment_open: false }));
      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(409);
    });

    it.each(['cancelada', 'finalizada'])('rejects signing up as ayudante for a %s edicion', async (status) => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ status }));
      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(409);
    });

    it('requires having completed a non-base taller before helping teach it', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(
        openEdicion({ taller: { id: 2, branch: 'nieve_hielo', name: 'Hielo' } })
      );
      prismaMock.inscripcion.findFirst.mockResolvedValue(null);

      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(422);
      expect(prismaMock.ayudantia.create).not.toHaveBeenCalled();
    });

    it('skips the completion check entirely for base-branch talleres', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion()); // branch: 'base'
      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(201);
      expect(prismaMock.inscripcion.findFirst).not.toHaveBeenCalled();
    });

    it('allows a non-base ayudante application once the taller has actually been completed', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(
        openEdicion({ taller: { id: 2, branch: 'nieve_hielo', name: 'Hielo' } })
      );
      prismaMock.inscripcion.findFirst.mockResolvedValue({ id: 1, status: 'completado' });

      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(201);
    });

    it('blocks signing up twice as ayudante for the same edicion', async () => {
      prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion());
      prismaMock.ayudantia.findUnique.mockResolvedValue({ id: 5 });

      const res = await POST(mockRequest(), routeParams(10));
      expect(res.status).toBe(409);
      expect(prismaMock.ayudantia.create).not.toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    it('rejects an unauthenticated caller', async () => {
      authState.user = null;
      const res = await DELETE(mockRequest(), routeParams(10));
      expect(res.status).toBe(401);
    });

    it("removes the caller's own ayudantia for the edicion", async () => {
      prismaMock.ayudantia.deleteMany.mockResolvedValue({ count: 1 });
      const res = await DELETE(mockRequest(), routeParams(10));
      expect(res.status).toBe(204);
      expect(prismaMock.ayudantia.deleteMany).toHaveBeenCalledWith({
        where: { edicion_id: 10, user_id: 'user-1' },
      });
    });
  });
});

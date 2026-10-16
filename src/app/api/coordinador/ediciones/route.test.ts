import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'member' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    edicionTaller: { findMany: vi.fn(), create: vi.fn() },
    taller: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, POST } from './route';

describe('/api/coordinador/ediciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
  });

  describe('GET', () => {
    it('rejects an unauthenticated caller', async () => {
      authState.user = null;
      const res = await GET(mockRequest());
      expect(res.status).toBe(401);
    });

    it('rejects a plain member (not coordinador or admin)', async () => {
      authState.role = 'member';
      const res = await GET(mockRequest());
      expect(res.status).toBe(403);
    });

    it('allows an admin even without the coordinador role', async () => {
      authState.role = 'admin';
      prismaMock.edicionTaller.findMany.mockResolvedValue([]);
      const res = await GET(mockRequest());
      expect(res.status).toBe(200);
    });

    it('lists ediciones for a coordinador', async () => {
      prismaMock.edicionTaller.findMany.mockResolvedValue([{ id: 1 }]);
      const res = await GET(mockRequest());
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([{ id: 1 }]);
    });
  });

  describe('POST', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await POST(mockRequest({ taller_id: 1 }));
      expect(res.status).toBe(403);
    });

    it('rejects a malformed body', async () => {
      const res = await POST(mockRequest({ taller_id: 'not-a-number' }));
      expect(res.status).toBe(400);
    });

    it('404s when the taller does not exist', async () => {
      prismaMock.taller.findUnique.mockResolvedValue(null);
      const res = await POST(mockRequest({ taller_id: 99 }));
      expect(res.status).toBe(404);
    });

    it('names the new edicion "<taller> <year>" from start_date', async () => {
      prismaMock.taller.findUnique.mockResolvedValue({ name: 'Nieve y Hielo' });
      prismaMock.edicionTaller.create.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

      const res = await POST(mockRequest({ taller_id: 1, start_date: '2027-06-15' }));
      expect(res.status).toBe(201);

      const [[createArgs]] = prismaMock.edicionTaller.create.mock.calls;
      expect(createArgs.data.name).toBe('Nieve y Hielo 2027');
    });

    it('falls back to the current year when no start_date is given', async () => {
      prismaMock.taller.findUnique.mockResolvedValue({ name: 'Roca' });
      prismaMock.edicionTaller.create.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

      await POST(mockRequest({ taller_id: 1 }));

      const [[createArgs]] = prismaMock.edicionTaller.create.mock.calls;
      expect(createArgs.data.name).toBe(`Roca ${new Date().getFullYear()}`);
    });
  });
});

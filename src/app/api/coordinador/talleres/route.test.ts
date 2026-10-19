import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    taller: { findMany: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET } from './route';

describe('GET /api/coordinador/talleres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
  });

  it('rejects a plain member', async () => {
    authState.role = 'member';
    const res = await GET(mockRequest());
    expect(res.status).toBe(403);
  });

  it('returns a lightweight taller list', async () => {
    prismaMock.taller.findMany.mockResolvedValue([{ id: 1, name: 'Hielo', branch: 'nieve_hielo' }]);
    const res = await GET(mockRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 1, name: 'Hielo', branch: 'nieve_hielo' }]);
  });
});

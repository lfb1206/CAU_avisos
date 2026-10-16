import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    edicionTaller: { findUnique: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET } from './route';

describe('GET /api/coordinador/ediciones/[id]/ficha', () => {
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
    const res = await GET(mockRequest(), routeParams(10));
    expect(res.status).toBe(403);
  });

  it('404s for a non-existent edicion', async () => {
    prismaMock.edicionTaller.findUnique.mockResolvedValue(null);
    const res = await GET(mockRequest(), routeParams(10));
    expect(res.status).toBe(404);
  });

  it('returns the ficha payload for an existing edicion', async () => {
    prismaMock.edicionTaller.findUnique.mockResolvedValue({
      id: 10,
      taller: { name: 'Taller' },
      inscripciones: [],
      ayudantias: [],
    });
    const res = await GET(mockRequest(), routeParams(10));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: 10 });
  });
});

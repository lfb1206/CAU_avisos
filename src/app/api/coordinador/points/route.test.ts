import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    coursePoints: { create: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { POST } from './route';

describe('POST /api/coordinador/points', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
    prismaMock.coursePoints.create.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));
  });

  it('rejects a plain member', async () => {
    authState.role = 'member';
    const res = await POST(mockRequest({ user_id: 'u1', points: 1 }));
    expect(res.status).toBe(403);
  });

  it('requires user_id', async () => {
    const res = await POST(mockRequest({ points: 1 }));
    expect(res.status).toBe(400);
  });

  it('rejects zero or negative points', async () => {
    const res = await POST(mockRequest({ user_id: 'u1', points: 0 }));
    expect(res.status).toBe(400);
    expect(prismaMock.coursePoints.create).not.toHaveBeenCalled();
  });

  it('awards points with a one-year expiry and records who awarded them', async () => {
    const res = await POST(mockRequest({ user_id: 'u1', points: 2, description: 'Manual bonus' }));
    expect(res.status).toBe(201);

    const [[createArgs]] = prismaMock.coursePoints.create.mock.calls;
    expect(createArgs.data.user_id).toBe('u1');
    expect(createArgs.data.points).toBe(2);
    expect(createArgs.data.awarded_by).toBe('coord-1');
    expect(createArgs.data.description).toBe('Manual bonus');
    expect(createArgs.data.expires_at.getFullYear()).toBe(new Date().getFullYear() + 1);
  });

  it('defaults edicion_id to null for a standalone award not tied to a course', async () => {
    await POST(mockRequest({ user_id: 'u1', points: 1 }));
    const [[createArgs]] = prismaMock.coursePoints.create.mock.calls;
    expect(createArgs.data.edicion_id).toBeNull();
  });
});

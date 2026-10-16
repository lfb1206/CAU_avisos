import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string } },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    edicionTaller: { findUnique: vi.fn() },
    inscripcion: { findUnique: vi.fn(), findMany: vi.fn(), upsert: vi.fn() },
    taller: { findMany: vi.fn() },
    coursePoints: { aggregate: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { POST } from './route';

const activeMembership = () => ({ membership_expires_at: new Date(Date.now() + 86_400_000) });
const lapsedMembership = () => ({ membership_expires_at: new Date(Date.now() - 86_400_000) });

const openEdicion = (overrides: Record<string, unknown> = {}) => ({
  id: 10,
  status: 'inscripciones_abiertas',
  enrollment_open: true,
  required_points: 0,
  taller: { id: 1, branch: 'base', prerequisite_taller_ids: [], name: 'Taller Base' },
  ...overrides,
});

describe('POST /api/ediciones/[id]/postular', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'user-1' };
    prismaMock.inscripcion.findUnique.mockResolvedValue(null);
    prismaMock.inscripcion.findMany.mockResolvedValue([]);
    prismaMock.taller.findMany.mockResolvedValue([]);
    prismaMock.coursePoints.aggregate.mockResolvedValue({ _sum: { points: 0 } });
    prismaMock.inscripcion.upsert.mockImplementation(({ create }) =>
      Promise.resolve({ id: 99, ...create })
    );
  });

  it('rejects an unauthenticated caller', async () => {
    authState.user = null;
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(401);
  });

  it('blocks a postulación when membership has lapsed', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(lapsedMembership());
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(403);
    expect(prismaMock.edicionTaller.findUnique).not.toHaveBeenCalled();
  });

  it('404s for a non-existent edicion', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(null);
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(404);
  });

  it.each(['cancelada', 'finalizada'])('rejects postulating to a %s edicion', async (status) => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ status }));
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(409);
  });

  it('rejects postulating while enrollment is closed', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ enrollment_open: false }));
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(409);
  });

  it('blocks a second postulación while one is already active', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion());
    prismaMock.inscripcion.findUnique.mockResolvedValue({ status: 'postulando' });
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(409);
    expect(prismaMock.inscripcion.upsert).not.toHaveBeenCalled();
  });

  it.each(['rechazado', 'retirado'])('allows re-postulating after a prior %s postulación', async (status) => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion());
    prismaMock.inscripcion.findUnique.mockResolvedValue({ status });
    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(201);
    expect(prismaMock.inscripcion.upsert).toHaveBeenCalled();
  });

  it('blocks postulating when a non-base taller has unmet prerequisites', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(
      openEdicion({ taller: { id: 2, branch: 'nieve_hielo', prerequisite_taller_ids: [1], name: 'Hielo' } })
    );
    prismaMock.inscripcion.findMany.mockResolvedValue([]); // nothing completed
    prismaMock.taller.findMany.mockResolvedValue([]); // no base talleres to auto-satisfy it

    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.missing_prerequisites).toEqual([1]);
  });

  it('treats base-branch talleres as an automatically satisfied prerequisite', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(
      openEdicion({ taller: { id: 2, branch: 'nieve_hielo', prerequisite_taller_ids: [1], name: 'Hielo' } })
    );
    prismaMock.inscripcion.findMany.mockResolvedValue([]); // user hasn't explicitly completed taller 1...
    prismaMock.taller.findMany.mockResolvedValue([{ id: 1 }]); // ...but it's a base taller, so it counts anyway

    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(201);
  });

  it('blocks postulating when the edicion requires more active points than the member has', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ required_points: 3 }));
    prismaMock.coursePoints.aggregate.mockResolvedValue({ _sum: { points: 1 } });

    const res = await POST(mockRequest({}), routeParams(10));
    expect(res.status).toBe(422);
    expect(prismaMock.inscripcion.upsert).not.toHaveBeenCalled();
  });

  it('succeeds and creates a postulando inscripción when every condition is met', async () => {
    prismaMock.profile.findUnique.mockResolvedValue(activeMembership());
    prismaMock.edicionTaller.findUnique.mockResolvedValue(openEdicion({ required_points: 2 }));
    prismaMock.coursePoints.aggregate.mockResolvedValue({ _sum: { points: 2 } });

    const res = await POST(
      mockRequest({ grupo_sanguineo: 'O+', tiene_primeros_auxilios: true }),
      routeParams(10)
    );
    expect(res.status).toBe(201);

    const [[upsertArgs]] = prismaMock.inscripcion.upsert.mock.calls;
    expect(upsertArgs.create).toMatchObject({
      edicion_id: 10,
      user_id: 'user-1',
      status: 'postulando',
      grupo_sanguineo: 'O+',
      tiene_primeros_auxilios: true,
    });
  });
});

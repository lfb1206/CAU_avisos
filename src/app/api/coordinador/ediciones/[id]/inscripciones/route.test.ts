import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string }, role: 'coordinador' as string },
  prismaMock: {
    profile: { findUnique: vi.fn() },
    inscripcion: { findMany: vi.fn(), update: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, PATCH } from './route';

describe('/api/coordinador/ediciones/[id]/inscripciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'coord-1' };
    authState.role = 'coordinador';
    prismaMock.profile.findUnique.mockImplementation(() =>
      Promise.resolve({ id: authState.user?.id, role: authState.role })
    );
    prismaMock.inscripcion.findMany.mockResolvedValue([]);
  });

  describe('GET', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await GET(mockRequest(), routeParams(10));
      expect(res.status).toBe(403);
    });

    it('ranks applicants by active points, highest first', async () => {
      prismaMock.inscripcion.findMany.mockImplementation(({ where }: { where?: { status?: string } }) => {
        // Second call (completed-courses lookup) filters by status: 'completado'; return [] for that one.
        if (where?.status === 'completado') return Promise.resolve([]);
        return Promise.resolve([
          {
            id: 1,
            user_id: 'low',
            status: 'postulando',
            aprobado: null,
            grupo_sanguineo: null,
            alergias: null,
            medicamentos: null,
            condiciones_especiales: null,
            tiene_primeros_auxilios: false,
            notas_coordinador: null,
            inscrito_at: new Date(),
            profile: { name: 'Low', email: 'low@x.com', phone: null, rut: null, blood_type: null, allergies: null, medications: null, medical_conditions: null, emergency_contact: null, emergency_phone: null, received_points: [{ points: 1 }] },
          },
          {
            id: 2,
            user_id: 'high',
            status: 'postulando',
            aprobado: null,
            grupo_sanguineo: null,
            alergias: null,
            medicamentos: null,
            condiciones_especiales: null,
            tiene_primeros_auxilios: false,
            notas_coordinador: null,
            inscrito_at: new Date(),
            profile: { name: 'High', email: 'high@x.com', phone: null, rut: null, blood_type: null, allergies: null, medications: null, medical_conditions: null, emergency_contact: null, emergency_phone: null, received_points: [{ points: 3 }, { points: 2 }] },
          },
        ]);
      });

      const res = await GET(mockRequest(), routeParams(10));
      const body = (await res.json()) as { user_id: string; activePoints: number }[];
      expect(body.map((r) => r.user_id)).toEqual(['high', 'low']);
      expect(body[0].activePoints).toBe(5);
    });
  });

  describe('PATCH', () => {
    it('rejects a plain member', async () => {
      authState.role = 'member';
      const res = await PATCH(mockRequest({ user_id: 'u1', status: 'aceptado' }), routeParams(10));
      expect(res.status).toBe(403);
    });

    it('requires user_id and status', async () => {
      const res = await PATCH(mockRequest({ user_id: 'u1' }), routeParams(10));
      expect(res.status).toBe(400);
      expect(prismaMock.inscripcion.update).not.toHaveBeenCalled();
    });

    it('accepting an applicant stamps aprobado_at and sets aprobado true', async () => {
      prismaMock.inscripcion.update.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

      await PATCH(mockRequest({ user_id: 'u1', status: 'aceptado' }), routeParams(10));

      const [[updateArgs]] = prismaMock.inscripcion.update.mock.calls;
      expect(updateArgs.where).toEqual({ edicion_id_user_id: { edicion_id: 10, user_id: 'u1' } });
      expect(updateArgs.data.status).toBe('aceptado');
      expect(updateArgs.data.aprobado).toBe(true);
      expect(updateArgs.data.aprobado_at).toBeInstanceOf(Date);
    });

    it('rejecting an applicant does not stamp aprobado/aprobado_at', async () => {
      prismaMock.inscripcion.update.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

      await PATCH(mockRequest({ user_id: 'u1', status: 'rechazado' }), routeParams(10));

      const [[updateArgs]] = prismaMock.inscripcion.update.mock.calls;
      expect(updateArgs.data.status).toBe('rechazado');
      expect(updateArgs.data.aprobado_at).toBeUndefined();
    });
  });
});

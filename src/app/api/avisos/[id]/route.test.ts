import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string } },
  prismaMock: {
    aviso: { findFirst: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, PATCH, DELETE } from './route';

describe('/api/avisos/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'user-1' };
  });

  describe('GET', () => {
    it('rejects an unauthenticated caller', async () => {
      authState.user = null;
      const res = await GET(mockRequest(), routeParams(1));
      expect(res.status).toBe(401);
    });

    it("404s for an aviso that isn't the caller's own", async () => {
      prismaMock.aviso.findFirst.mockResolvedValue(null);
      const res = await GET(mockRequest(), routeParams(1));
      expect(res.status).toBe(404);
      expect(prismaMock.aviso.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1, created_by: 'user-1' } })
      );
    });
  });

  describe('PATCH', () => {
    it('blocks edits once the aviso has been submitted', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'submitted', form_data: {}, title: 'x' });
      const res = await PATCH(mockRequest({ title: 'Nuevo título' }), routeParams(1));
      expect(res.status).toBe(409);
      expect(prismaMock.aviso.update).not.toHaveBeenCalled();
    });

    it('allows the submitted → archived transition even though the aviso is locked otherwise', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'submitted', form_data: {}, title: 'x' });
      prismaMock.aviso.update.mockResolvedValue({ id: 1, status: 'archived' });

      const res = await PATCH(mockRequest({ status: 'archived' }), routeParams(1));
      expect(res.status).toBe(200);
      expect(prismaMock.aviso.update).toHaveBeenCalled();
    });

    it('rejects a submitted → archived request bundled with other edits (not a pure archive transition)', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'submitted', form_data: {}, title: 'x' });
      const res = await PATCH(mockRequest({ status: 'archived', title: 'Also changing this' }), routeParams(1));
      expect(res.status).toBe(409);
      expect(prismaMock.aviso.update).not.toHaveBeenCalled();
    });

    it('auto-generates a title from actividad + cerroOSector when none is supplied', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'draft', form_data: {}, title: 'Borrador' });
      prismaMock.aviso.update.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

      await PATCH(
        mockRequest({ form_data: { basicInfo: { actividad: 'Trekking', cerroOSector: 'Cerro Provincia' } } }),
        routeParams(1)
      );

      const [[updateArgs]] = prismaMock.aviso.update.mock.calls;
      expect(updateArgs.data.title).toBe('Trekking — Cerro Provincia');
    });

    it('404s when updating an aviso that is not the caller\'s own', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue(null);
      const res = await PATCH(mockRequest({ title: 'x' }), routeParams(1));
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE', () => {
    it("404s instead of deleting when the aviso isn't the caller's own", async () => {
      prismaMock.aviso.findFirst.mockResolvedValue(null);
      const res = await DELETE(mockRequest(), routeParams(1));
      expect(res.status).toBe(404);
      expect(prismaMock.aviso.delete).not.toHaveBeenCalled();
    });

    it('deletes an owned aviso', async () => {
      prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'draft' });
      prismaMock.aviso.delete.mockResolvedValue({});
      const res = await DELETE(mockRequest(), routeParams(1));
      expect(res.status).toBe(204);
      expect(prismaMock.aviso.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});

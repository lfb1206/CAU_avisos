import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { authState, prismaMock } = vi.hoisted(() => ({
  authState: { user: null as null | { id: string } },
  prismaMock: {
    aviso: { findFirst: vi.fn(), update: vi.fn() },
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: authState.user } })) },
  })),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { POST } from './route';

describe('POST /api/avisos/[id]/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'user-1' };
  });

  it('rejects an unauthenticated caller', async () => {
    authState.user = null;
    const res = await POST(mockRequest(), routeParams(1));
    expect(res.status).toBe(401);
  });

  it('404s when the aviso does not exist or belongs to someone else', async () => {
    prismaMock.aviso.findFirst.mockResolvedValue(null);
    const res = await POST(mockRequest(), routeParams(1));
    expect(res.status).toBe(404);
  });

  it('rejects re-submitting an already-submitted aviso', async () => {
    prismaMock.aviso.findFirst.mockResolvedValue({ id: 1, status: 'submitted', tipo: 'rapido', form_data: {} });
    const res = await POST(mockRequest(), routeParams(1));
    expect(res.status).toBe(409);
    expect(prismaMock.aviso.update).not.toHaveBeenCalled();
  });

  it('submits a draft aviso and derives its search fields from form_data', async () => {
    prismaMock.aviso.findFirst.mockResolvedValue({
      id: 1,
      status: 'draft',
      tipo: 'rapido',
      form_data: { categoria: 'Trekking', cerro: 'Cerro Provincia', fechaInicio: '2026-03-01', participantes: [] },
    });
    prismaMock.aviso.update.mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data }));

    const res = await POST(mockRequest(), routeParams(1));
    expect(res.status).toBe(200);

    const [[updateArgs]] = prismaMock.aviso.update.mock.calls;
    expect(updateArgs.data.status).toBe('submitted');
    expect(updateArgs.data.location).toBe('Cerro Provincia');
    expect(updateArgs.data.activity_type).toBe('Trekking');
    expect(updateArgs.data.submitted_at).toBeInstanceOf(Date);
  });
});

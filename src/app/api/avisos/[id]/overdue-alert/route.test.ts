import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockRequest, routeParams } from '@/lib/test/routeTestUtils';

const { prismaMock, verifyMock, sendEmailMock } = vi.hoisted(() => ({
  prismaMock: {
    aviso: { findUnique: vi.fn(), update: vi.fn() },
  },
  verifyMock: vi.fn(),
  sendEmailMock: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('@/lib/email', () => ({ AVISOS_FROM: 'CAU Avisos <avisos@cau.cl>', sendEmail: sendEmailMock }));
vi.mock('@upstash/qstash', () => ({
  Receiver: vi.fn().mockImplementation(() => ({ verify: verifyMock })),
}));

import { POST } from './route';

const largoAviso = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  tipo: 'largo',
  status: 'submitted',
  overdue_alert_sent_at: null,
  form_data: { basicInfo: { emailContacto: 'juan@example.com', destinatariosAdicionales: ['ana@example.com'] } },
  ...overrides,
});

describe('POST /api/avisos/[id]/overdue-alert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.QSTASH_CURRENT_SIGNING_KEY = 'current-key';
    process.env.QSTASH_NEXT_SIGNING_KEY = 'next-key';
    verifyMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue(undefined);
    prismaMock.aviso.update.mockResolvedValue({});
  });

  it('500s when signing keys are not configured', async () => {
    delete process.env.QSTASH_CURRENT_SIGNING_KEY;
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(500);
    expect(prismaMock.aviso.findUnique).not.toHaveBeenCalled();
  });

  it('rejects a request with an invalid QStash signature', async () => {
    verifyMock.mockResolvedValue(false);
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(401);
    expect(prismaMock.aviso.findUnique).not.toHaveBeenCalled();
  });

  it('no-ops when the aviso was deleted before the deadline', async () => {
    prismaMock.aviso.findUnique.mockResolvedValue(null);
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('no-ops when the aviso is no longer submitted (regreso already notified)', async () => {
    prismaMock.aviso.findUnique.mockResolvedValue(largoAviso({ status: 'archived' }));
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('no-ops when the alert was already sent (QStash redelivery guard)', async () => {
    prismaMock.aviso.findUnique.mockResolvedValue(largoAviso({ overdue_alert_sent_at: new Date() }));
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('sends the alert to emailContacto + destinatariosAdicionales and marks it sent', async () => {
    prismaMock.aviso.findUnique.mockResolvedValue(largoAviso());
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(200);

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['juan@example.com'], cc: ['ana@example.com'] })
    );
    const [[updateArgs]] = prismaMock.aviso.update.mock.calls;
    expect(updateArgs.where).toEqual({ id: 1 });
    expect(updateArgs.data.overdue_alert_sent_at).toBeInstanceOf(Date);
  });

  it('sends the email before marking it sent — never the other way around', async () => {
    const callOrder: string[] = [];
    sendEmailMock.mockImplementation(async () => { callOrder.push('send'); });
    prismaMock.aviso.update.mockImplementation(async () => { callOrder.push('mark'); return {}; });
    prismaMock.aviso.findUnique.mockResolvedValue(largoAviso());

    await POST(mockRequest({ avisoId: 1 }), routeParams(1));

    expect(callOrder).toEqual(['send', 'mark']);
  });

  it('marks as sent without emailing when no recipients can be resolved', async () => {
    prismaMock.aviso.findUnique.mockResolvedValue(largoAviso({ form_data: { basicInfo: {} } }));
    const res = await POST(mockRequest({ avisoId: 1 }), routeParams(1));
    expect(res.status).toBe(200);
    expect(sendEmailMock).not.toHaveBeenCalled();
    expect(prismaMock.aviso.update).toHaveBeenCalled();
  });
});

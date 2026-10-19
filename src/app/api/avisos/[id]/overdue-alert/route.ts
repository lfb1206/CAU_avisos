import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AVISOS_FROM, sendEmail } from '@/lib/email';
import { resolveAvisoRecipients } from '@/lib/avisoRecipients';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/avisos/[id]/overdue-alert — webhook QStash calls at the exact moment
 * an aviso's "must be back by" deadline passes (scheduled from the submit route).
 * Unauthenticated by design (QStash can't carry a user session) — instead verified
 * by signature, same as any webhook from an external provider.
 *
 * Sends the alert *before* marking it sent: if the process crashes in between, the
 * worst case is a duplicate alert on QStash's retry, not a silently lost one — an
 * explicit, deliberate choice for a safety-relevant notification.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!currentKey || !nextKey) {
    console.error('[overdue-alert] QSTASH_CURRENT_SIGNING_KEY/QSTASH_NEXT_SIGNING_KEY not configured');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.text();
  const signature = request.headers.get('Upstash-Signature') ?? '';

  const { Receiver } = await import('@upstash/qstash');
  const receiver = new Receiver({ currentSigningKey: currentKey, nextSigningKey: nextKey });
  const isValid = await receiver.verify({ signature, body }).catch(() => false);
  if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const avisoId = Number(id);

  try {
    const aviso = await prisma.aviso.findUnique({ where: { id: avisoId } });
    if (!aviso) return NextResponse.json({ ok: true }); // deleted before the deadline
    if (aviso.status !== 'submitted') return NextResponse.json({ ok: true }); // regreso ya notificado
    if (aviso.overdue_alert_sent_at) return NextResponse.json({ ok: true }); // already sent

    const { to, cc } = resolveAvisoRecipients(aviso.tipo, aviso.form_data as Record<string, unknown>);
    if (to.length === 0) {
      console.error(`[overdue-alert] aviso #${avisoId}: no recipients resolved, nothing to send`);
      await prisma.aviso.update({ where: { id: avisoId }, data: { overdue_alert_sent_at: new Date() } });
      return NextResponse.json({ ok: true });
    }

    await sendEmail({
      from: AVISOS_FROM,
      to,
      cc: cc.length > 0 ? cc : undefined,
      subject: `⚠️ Aviso de Salida CAU #${avisoId} — regreso no notificado`,
      html: `
        <h2>⚠️ Regreso no notificado</h2>
        <p>El aviso de salida CAU #${avisoId} llegó a su plazo máximo de regreso y no se ha notificado el regreso.</p>
        <p>Si no tienes noticias de los participantes, considera iniciar el protocolo de emergencia del club.</p>
        <p>— Club Andino Universitario</p>
      `,
    }).catch((err) => console.error(`[overdue-alert email] aviso #${avisoId}:`, err));

    await prisma.aviso.update({ where: { id: avisoId }, data: { overdue_alert_sent_at: new Date() } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[overdue-alert POST]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

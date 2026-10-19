/**
 * Schedules/cancels the one-time overdue-return alert webhook via Upstash QStash —
 * the first scheduled job in this project (everything else is computed on read).
 * Chosen over Vercel Cron because this app is on Vercel's free Hobby plan, which
 * limits Cron Jobs to a 24h minimum interval — far too coarse for a timely safety
 * alert. QStash's free tier schedules a one-off message for an exact timestamp
 * instead, independent of the Vercel plan.
 *
 * Same lazy-env-read pattern as src/lib/email.ts: no-ops loudly (console.error)
 * if the token isn't set, instead of throwing — so a missing/misconfigured
 * QSTASH_TOKEN never breaks a build, CI (which doesn't set it, same as
 * RESEND_API_KEY today), or aviso submission itself.
 */
export async function scheduleOverdueAlert(avisoId: number, notBefore: Date): Promise<string | null> {
  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    console.error('[qstash] QSTASH_TOKEN not set — skipping overdue-alert scheduling', { avisoId });
    return null;
  }

  const { Client } = await import('@upstash/qstash');
  const client = new Client({ token });

  const res = await client.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/avisos/${avisoId}/overdue-alert`,
    body: { avisoId },
    notBefore: Math.floor(notBefore.getTime() / 1000),
  });

  return res.messageId;
}

export async function cancelOverdueAlert(messageId: string): Promise<void> {
  const token = process.env.QSTASH_TOKEN;
  if (!token) return;

  try {
    const { Client } = await import('@upstash/qstash');
    const client = new Client({ token });
    await client.messages.delete(messageId);
  } catch (err) {
    // Likely already delivered or expired — not worth failing the caller's own
    // action (e.g. deleting the aviso) over a best-effort cleanup step.
    console.error('[qstash] failed to cancel overdue alert:', err);
  }
}

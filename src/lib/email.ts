/** Sender address for préstamos (Equipo Club) notifications — override via env in production. */
export const PRESTAMOS_FROM = process.env.RESEND_FROM_PRESTAMOS ?? 'CAU Préstamos <prestamos@cau.cl>';

/** Sender address for aviso notifications — override via env in production. */
export const AVISOS_FROM = process.env.RESEND_FROM_AVISOS ?? 'CAU Avisos <avisos@cau.cl>';

/**
 * Fire-and-forget email send. No-ops if RESEND_API_KEY isn't set — but loudly,
 * via console.error, instead of silently: a misconfigured/missing key used to be
 * indistinguishable from "everything is fine," so nobody noticed until a member
 * reported never getting a confirmation email.
 */
export async function sendEmail({
  from,
  to,
  cc,
  subject,
  html,
}: {
  from: string;
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY not set — skipping send', { to, subject });
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    ...(cc ? { cc: Array.isArray(cc) ? cc : [cc] } : {}),
    subject,
    html,
  });
}

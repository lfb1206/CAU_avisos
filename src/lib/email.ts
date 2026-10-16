/** Sender address for préstamos (Equipo Club) notifications — override via env in production. */
export const PRESTAMOS_FROM = process.env.RESEND_FROM_PRESTAMOS ?? 'CAU Préstamos <prestamos@cau.cl>';

/** Sender address for aviso notifications — override via env in production. */
export const AVISOS_FROM = process.env.RESEND_FROM_AVISOS ?? 'CAU Avisos <avisos@cau.cl>';

/**
 * Fire-and-forget email send. Silently no-ops if RESEND_API_KEY isn't set, same as
 * the original single-site usage this was extracted from (avisos submit).
 */
export async function sendEmail({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });
}

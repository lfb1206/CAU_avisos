/**
 * Resolves who should receive an aviso's notification emails (submission
 * confirmation, and the overdue-return alert) from its raw form_data.
 *
 * 'rapido' avisos never collect a contact email of their own — only
 * `destinatariosAdicionales` exists for them, so it's the sole `to` list
 * rather than a `cc` on top of something else. If a rapido aviso has none,
 * there's genuinely nobody to notify; that's a known, accepted gap, not a
 * bug — callers should log it rather than silently swallow it.
 */
export function resolveAvisoRecipients(
  tipo: string,
  formData: Record<string, unknown>
): { to: string[]; cc: string[] } {
  if (tipo === 'rapido') {
    const d = formData as { destinatariosAdicionales?: string[] };
    return { to: Array.isArray(d.destinatariosAdicionales) ? d.destinatariosAdicionales : [], cc: [] };
  }

  const d = formData as {
    basicInfo?: { emailContacto?: string; destinatariosAdicionales?: string[] };
  };
  const emailContacto = d.basicInfo?.emailContacto;
  const destinatariosAdicionales = Array.isArray(d.basicInfo?.destinatariosAdicionales)
    ? d.basicInfo!.destinatariosAdicionales
    : [];

  return {
    to: emailContacto ? [emailContacto] : [],
    cc: destinatariosAdicionales,
  };
}

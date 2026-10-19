/**
 * Extracts an aviso's "must be back by" deadline from its raw form_data.
 * Not the same as `activity_date` (the denormalized search column): for
 * 'rapido' that column holds the trip's *start* date, not the return deadline.
 */
export function getOverdueDeadline(tipo: string, formData: Record<string, unknown> | null | undefined): Date | null {
  if (!formData) return null;

  if (tipo === 'rapido') {
    const d = formData as { fechaMaxRegreso?: string };
    return d.fechaMaxRegreso ? new Date(d.fechaMaxRegreso) : null;
  }

  const d = formData as { basicInfo?: { fechaHoraReporteRegreso?: string } };
  return d.basicInfo?.fechaHoraReporteRegreso ? new Date(d.basicInfo.fechaHoraReporteRegreso) : null;
}

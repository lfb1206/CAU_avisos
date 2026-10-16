// Derives the Aviso's denormalized, searchable columns (location, activity_type,
// activity_date, participant_names_text) from the raw form_data JSON blob, at
// submit time. Pulled out of the submit route into its own module so it's
// independently testable without needing to exercise the whole route.
export function extractSearchFields(tipo: string, formData: Record<string, unknown>) {
  if (tipo === 'rapido') {
    const d = formData as {
      categoria?: string;
      cerro?: string;
      fechaInicio?: string;
      participantes?: { nombre?: string }[];
    };
    return {
      location:              d.cerro ?? null,
      activity_type:         d.categoria ?? null,
      activity_date:         d.fechaInicio ? new Date(d.fechaInicio) : null,
      participant_names_text: (d.participantes ?? []).map((p) => p.nombre ?? '').join(' '),
    };
  }
  // largo
  const d = formData as {
    basicInfo?: {
      cerroOSector?: string;
      actividad?: string;
      fechaHoraReporteRegreso?: string;
    };
    participantes?: { nombre?: string }[];
  };
  return {
    location:              d.basicInfo?.cerroOSector ?? null,
    activity_type:         d.basicInfo?.actividad ?? null,
    activity_date:         d.basicInfo?.fechaHoraReporteRegreso
      ? new Date(d.basicInfo.fechaHoraReporteRegreso)
      : null,
    participant_names_text: (d.participantes ?? []).map((p) => p.nombre ?? '').join(' '),
  };
}

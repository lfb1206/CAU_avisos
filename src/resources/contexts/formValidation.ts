// Pure, exported validation predicates for the aviso largo form — extracted out of
// FormContext.tsx's component closure so they're testable on their own and so
// `isStepValid`/`checkFormCompletion` can't silently diverge from each other again
// (see isTransportValid: both used to reimplement the `conductor`/`distancia`
// checks slightly differently, which let a non-driving transport pass step 5 and
// then block final submission for a reason the user was never shown).
import { ASSUMPTION_ACTIONS } from '@/resources/constants/formConstants';
import type { FormState, Participant, ItineraryDay, Transport } from '@/types';

export const isParticipantValid = (p: Participant): boolean =>
  Boolean(p.nombre && p.rut && p.telefono && p.contactoEmergencia && p.telefonoEmergencia);

export const isItineraryDayValid = (day: ItineraryDay, reporteDate: Date | null): boolean => {
  if (!day.tramo || !day.actividades || day.actividades.length === 0 || !day.horaInicio || !day.horaFin) {
    return false;
  }
  if (day.fecha) {
    const today = new Date(new Date().toISOString().split('T')[0]);
    const tramoDate = new Date(day.fecha);
    if (tramoDate < today) return false;
    if (reporteDate && tramoDate > reporteDate) return false;
  }
  return true;
};

/**
 * Single source of truth for "is this transport entry valid": requires `tipo` and
 * `distancia` always, and `conductor` only when `tipo` is "auto particular" (other
 * transport types — bus, a pie, etc. — don't have a CAU-arranged driver).
 */
export const isTransportValid = (t: Transport): boolean => {
  if (!t.tipo || !t.distancia) return false;
  if (t.tipo.toLowerCase() === 'auto particular') return Boolean(t.conductor);
  return true;
};

export const getRisksCompletionStatus = (itinerario: ItineraryDay[]): boolean => {
  let managed = 0;
  let incomplete = 0;

  itinerario.forEach((day) => {
    (day.supuestos ?? []).forEach((assumption) => {
      if (
        assumption.accion === ASSUMPTION_ACTIONS.GESTIONAR ||
        (assumption.accion === ASSUMPTION_ACTIONS.MONITOREO_INTENSO && assumption.incluir === true)
      ) {
        managed++;
        if (!assumption.causas || assumption.causas.length === 0) {
          incomplete++;
        } else {
          const hasIncompleteCausas = assumption.causas.some(
            (c) =>
              !c.peligros || c.peligros.length === 0 ||
              !c.riesgos || c.riesgos.length === 0 ||
              c.peligros.some((p) => !p.trim()) ||
              c.riesgos.some((r) => !r.trim())
          );
          if (hasIncompleteCausas) incomplete++;
        }
      }
    });
  });

  return managed === 0 || incomplete === 0;
};

export const isStepValid = (step: number, formData: FormState): boolean => {
  const participantes = formData.participantes ?? [];
  const equipo = formData.equipo ?? [];
  const transporte = formData.transporte ?? [];
  const itinerario = formData.itinerario ?? [];
  const reporteDate = formData.basicInfo.fechaHoraReporteRegreso
    ? new Date(formData.basicInfo.fechaHoraReporteRegreso)
    : null;

  switch (step) {
    case 1: {
      const basicValid =
        formData.basicInfo.contactoCAU &&
        formData.basicInfo.telefonoContacto &&
        formData.basicInfo.emailContacto &&
        formData.basicInfo.fechaHoraReporteRegreso &&
        formData.basicInfo.actividad &&
        formData.basicInfo.cerroOSector;
      const inReachValid =
        !formData.basicInfo.llevaInreach ||
        (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);
      return Boolean(basicValid && inReachValid);
    }
    case 2:
      return participantes.length > 0 && participantes.every(isParticipantValid);
    case 3:
      return itinerario.length > 0 && itinerario.every((day) => isItineraryDayValid(day, reporteDate));
    case 4:
      return getRisksCompletionStatus(itinerario);
    case 5: {
      if (equipo.length === 0 && transporte.length === 0) return true;
      const validEquipo = equipo.filter((e) => e.categoria && e.item && e.cantidad);
      const validTransporte = transporte.filter(isTransportValid);
      if (equipo.length > 0 && validEquipo.length !== equipo.length) return false;
      if (transporte.length > 0 && validTransporte.length !== transporte.length) return false;
      return true;
    }
    case 6:
      return checkFormCompletion(formData);
    case 7:
      return checkFormCompletion(formData);
    default:
      return false;
  }
};

export const checkFormCompletion = (formData: FormState): boolean => {
  const participantes = formData.participantes ?? [];
  const equipo = formData.equipo ?? [];
  const transporte = formData.transporte ?? [];
  const itinerario = formData.itinerario ?? [];
  const reporteDate = formData.basicInfo.fechaHoraReporteRegreso
    ? new Date(formData.basicInfo.fechaHoraReporteRegreso)
    : null;

  const basicInfoComplete =
    formData.basicInfo.contactoCAU &&
    formData.basicInfo.telefonoContacto &&
    formData.basicInfo.emailContacto &&
    formData.basicInfo.fechaHoraReporteRegreso &&
    formData.basicInfo.actividad &&
    formData.basicInfo.cerroOSector;

  const inReachComplete =
    !formData.basicInfo.llevaInreach ||
    (formData.basicInfo.numeroInreach && formData.basicInfo.codigoInreach);

  const validEquipo = equipo.filter((e) => e.categoria && e.item && e.cantidad);
  const validTransporte = transporte.filter(isTransportValid);

  return Boolean(
    basicInfoComplete &&
      inReachComplete &&
      participantes.length > 0 &&
      participantes.every(isParticipantValid) &&
      itinerario.length > 0 &&
      itinerario.every((day) => isItineraryDayValid(day, reporteDate)) &&
      getRisksCompletionStatus(itinerario) &&
      (equipo.length === 0 || validEquipo.length === equipo.length) &&
      (transporte.length === 0 || validTransporte.length === transporte.length)
  );
};

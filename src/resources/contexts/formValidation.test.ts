import { describe, it, expect } from 'vitest';
import { isParticipantValid, isTransportValid, isStepValid, checkFormCompletion } from './formValidation';
import type { FormState, Participant, Transport, ItineraryDay, BasicInfo } from '@/types';

const basicInfo: BasicInfo = {
  contactoCAU: 'Juan Perez',
  telefonoContacto: '+56912345678',
  emailContacto: 'juan@example.com',
  fechaHoraReporteRegreso: '2099-01-01T12:00',
  actividad: 'trekking',
  cerroOSector: 'Cerro Provincia',
  ruta: 'Ruta normal',
  linkPronostico: '',
  linkRuta: '',
  weatherImages: [],
};

const validParticipant: Participant = {
  nombre: 'Ana',
  rut: '11111111-1',
  telefono: '+56911111111',
  contactoEmergencia: 'Pedro',
  telefonoEmergencia: '+56922222222',
};

// No `fecha` set, so isItineraryDayValid's date-ordering checks are skipped —
// keeps this fixture independent of "today's date" at test-run time.
const validDay: ItineraryDay = {
  fecha: '',
  tramo: 'Aproximación',
  actividades: ['Caminata'],
  horaInicio: '08:00',
  horaFin: '12:00',
  supuestos: [],
};

const busTransport: Transport = { tipo: 'bus', conductor: '', distancia: '50' };
const autoParticularNoConductor: Transport = { tipo: 'auto particular', conductor: '', distancia: '50' };
const autoParticularWithConductor: Transport = { tipo: 'auto particular', conductor: 'Carlos', distancia: '50' };

function buildFormData(overrides: Partial<FormState> = {}): FormState {
  return {
    currentStep: 1,
    avisoId: null,
    basicInfo,
    participantes: [validParticipant],
    itinerario: [validDay],
    equipo: [],
    transporte: [],
    cuerposRescate: [],
    ...overrides,
  };
}

describe('isTransportValid', () => {
  it('requires a conductor only for auto particular', () => {
    expect(isTransportValid(autoParticularNoConductor)).toBe(false);
    expect(isTransportValid(autoParticularWithConductor)).toBe(true);
  });

  it('does not require a conductor for other transport types (e.g. bus)', () => {
    expect(isTransportValid(busTransport)).toBe(true);
  });

  it('always requires distancia, regardless of tipo', () => {
    expect(isTransportValid({ tipo: 'bus', conductor: '', distancia: '' })).toBe(false);
  });
});

describe('isParticipantValid', () => {
  it('requires nombre, rut, telefono, and emergency contact info', () => {
    expect(isParticipantValid(validParticipant)).toBe(true);
    expect(isParticipantValid({ ...validParticipant, contactoEmergencia: undefined })).toBe(false);
  });
});

// Regression coverage for the bug where isStepValid(5) and checkFormCompletion
// disagreed on whether a non-driving transport needed a conductor — a bus
// without a conductor used to pass step 5 and then silently block final
// submission. Both must now agree in every case, via the shared isTransportValid.
describe('isStepValid(5) and checkFormCompletion agreement', () => {
  it('a bus without a conductor is valid at step 5 and does not block completion', () => {
    const formData = buildFormData({ transporte: [busTransport] });
    expect(isStepValid(5, formData)).toBe(true);
    expect(checkFormCompletion(formData)).toBe(true);
  });

  it('an auto particular without a conductor is invalid at step 5 and blocks completion', () => {
    const formData = buildFormData({ transporte: [autoParticularNoConductor] });
    expect(isStepValid(5, formData)).toBe(false);
    expect(checkFormCompletion(formData)).toBe(false);
  });
});

describe('isStepValid(7)', () => {
  it('delegates to checkFormCompletion instead of always returning false', () => {
    const formData = buildFormData();
    expect(isStepValid(7, formData)).toBe(checkFormCompletion(formData));
    expect(isStepValid(7, formData)).toBe(true);
  });
});

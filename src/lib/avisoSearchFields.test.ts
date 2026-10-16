import { describe, it, expect } from 'vitest';
import { extractSearchFields } from './avisoSearchFields';

describe('extractSearchFields — rapido', () => {
  it('extracts location, activity type, date, and participant names', () => {
    const result = extractSearchFields('rapido', {
      categoria: 'Trekking',
      cerro: 'Cerro Provincia',
      fechaInicio: '2026-03-01',
      participantes: [{ nombre: 'Ana' }, { nombre: 'Luis' }],
    });

    expect(result.location).toBe('Cerro Provincia');
    expect(result.activity_type).toBe('Trekking');
    expect(result.activity_date).toEqual(new Date('2026-03-01'));
    expect(result.participant_names_text).toBe('Ana Luis');
  });

  it('falls back to null/empty values when fields are missing', () => {
    const result = extractSearchFields('rapido', {});

    expect(result.location).toBeNull();
    expect(result.activity_type).toBeNull();
    expect(result.activity_date).toBeNull();
    expect(result.participant_names_text).toBe('');
  });
});

describe('extractSearchFields — largo', () => {
  it('extracts fields from the nested basicInfo shape', () => {
    const result = extractSearchFields('largo', {
      basicInfo: {
        cerroOSector: 'Cerro El Plomo',
        actividad: 'Alpinismo clásico',
        fechaHoraReporteRegreso: '2026-04-10T18:00',
      },
      participantes: [{ nombre: 'Sofía' }],
    });

    expect(result.location).toBe('Cerro El Plomo');
    expect(result.activity_type).toBe('Alpinismo clásico');
    expect(result.activity_date).toEqual(new Date('2026-04-10T18:00'));
    expect(result.participant_names_text).toBe('Sofía');
  });

  it('falls back to null/empty values when basicInfo is missing entirely', () => {
    const result = extractSearchFields('largo', {});

    expect(result.location).toBeNull();
    expect(result.activity_type).toBeNull();
    expect(result.activity_date).toBeNull();
    expect(result.participant_names_text).toBe('');
  });
});

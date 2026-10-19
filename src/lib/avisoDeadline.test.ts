import { describe, it, expect } from 'vitest';
import { getOverdueDeadline } from './avisoDeadline';

describe('getOverdueDeadline', () => {
  it('uses fechaMaxRegreso for rapido avisos', () => {
    const result = getOverdueDeadline('rapido', { fechaMaxRegreso: '2026-03-01T18:00' });
    expect(result).toEqual(new Date('2026-03-01T18:00'));
  });

  it('uses basicInfo.fechaHoraReporteRegreso for largo avisos', () => {
    const result = getOverdueDeadline('largo', { basicInfo: { fechaHoraReporteRegreso: '2026-04-10T20:00' } });
    expect(result).toEqual(new Date('2026-04-10T20:00'));
  });

  it('is not fooled by activity_date-style fields — only the actual deadline field counts', () => {
    // Regression guard: for 'rapido', activity_date is derived from fechaInicio (the
    // trip's start), not the return deadline — this must never be used as a proxy.
    const result = getOverdueDeadline('rapido', { fechaInicio: '2026-03-01T08:00' });
    expect(result).toBeNull();
  });

  it('returns null when the deadline field is missing', () => {
    expect(getOverdueDeadline('largo', {})).toBeNull();
    expect(getOverdueDeadline('rapido', {})).toBeNull();
  });

  it('returns null instead of throwing when formData itself is nullish', () => {
    expect(getOverdueDeadline('largo', null)).toBeNull();
    expect(getOverdueDeadline('rapido', undefined)).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { resolveAvisoRecipients } from './avisoRecipients';

describe('resolveAvisoRecipients — largo', () => {
  it('uses emailContacto as "to" and destinatariosAdicionales as "cc"', () => {
    const result = resolveAvisoRecipients('largo', {
      basicInfo: { emailContacto: 'juan@example.com', destinatariosAdicionales: ['ana@example.com', 'luis@example.com'] },
    });
    expect(result.to).toEqual(['juan@example.com']);
    expect(result.cc).toEqual(['ana@example.com', 'luis@example.com']);
  });

  it('returns an empty "to" when emailContacto is missing, regardless of cc', () => {
    const result = resolveAvisoRecipients('largo', {
      basicInfo: { destinatariosAdicionales: ['ana@example.com'] },
    });
    expect(result.to).toEqual([]);
    expect(result.cc).toEqual(['ana@example.com']);
  });

  it('defaults cc to an empty array when destinatariosAdicionales is absent', () => {
    const result = resolveAvisoRecipients('largo', { basicInfo: { emailContacto: 'juan@example.com' } });
    expect(result.cc).toEqual([]);
  });
});

describe('resolveAvisoRecipients — rapido', () => {
  it('treats destinatariosAdicionales as the sole "to" list, with no cc', () => {
    const result = resolveAvisoRecipients('rapido', { destinatariosAdicionales: ['ana@example.com'] });
    expect(result.to).toEqual(['ana@example.com']);
    expect(result.cc).toEqual([]);
  });

  it('returns an empty "to" when no destinatariosAdicionales were added — nobody to notify', () => {
    const result = resolveAvisoRecipients('rapido', {});
    expect(result.to).toEqual([]);
    expect(result.cc).toEqual([]);
  });
});

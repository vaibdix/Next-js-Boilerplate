import { describe, expect, it } from 'vitest';

import {
  CONTACT_FORM_FIELD_LIMITS,
  contactFormSchema,
  parseContactFormJsonResponse,
} from '@/validations/contact-form';

const validSubmission = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  phone: '+1 (555) 123-4567',
  message: 'I would like to talk about a project.',
};

describe('contactFormSchema', () => {
  it('accepts a valid submission and defaults the honeypot', () => {
    const result = contactFormSchema.safeParse(validSubmission);

    expect(result.success).toBe(true);
    expect(result.data?.website).toBe('');
  });

  it('rejects a filled honeypot', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      website: 'http://spam.example',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unknown keys', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      isAdmin: true,
    });

    expect(result.success).toBe(false);
  });

  it.each([
    ['empty name', { name: '' }],
    ['whitespace-only name', { name: '   ' }],
    ['malformed email', { email: 'not-an-email' }],
    ['phone without enough digits', { phone: '123' }],
    ['message under ten characters', { message: 'too short' }],
  ])('rejects %s', (_label, override) => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      ...override,
    });

    expect(result.success).toBe(false);
  });

  it('rejects fields over their length limit', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      name: 'a'.repeat(CONTACT_FORM_FIELD_LIMITS.name + 1),
    });

    expect(result.success).toBe(false);
  });

  it('trims surrounding whitespace', () => {
    const result = contactFormSchema.safeParse({
      ...validSubmission,
      name: '  Ada Lovelace  ',
    });

    expect(result.data?.name).toBe('Ada Lovelace');
  });
});

describe('parseContactFormJsonResponse', () => {
  it('accepts a success payload', () => {
    expect(parseContactFormJsonResponse({ ok: true }).success).toBe(true);
  });

  it('accepts a known failure message', () => {
    expect(
      parseContactFormJsonResponse({ ok: false, message: 'forbidden' }).success
    ).toBe(true);
  });

  it('rejects an unknown failure message', () => {
    expect(
      parseContactFormJsonResponse({ ok: false, message: 'kaboom' }).success
    ).toBe(false);
  });

  it('rejects a failure payload with no message', () => {
    expect(parseContactFormJsonResponse({ ok: false }).success).toBe(false);
  });
});

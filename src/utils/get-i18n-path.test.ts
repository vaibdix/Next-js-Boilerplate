import { describe, expect, it } from 'vitest';

import { getI18nPath } from '@/utils/get-i18n-path';

describe('getI18nPath', () => {
  it('returns the path unchanged for the default locale', () => {
    expect(getI18nPath('/about', 'en')).toBe('/about');
  });

  it('prefixes a non-default locale', () => {
    expect(getI18nPath('/about', 'fr')).toBe('/fr/about');
  });

  it('prefixes the root path', () => {
    expect(getI18nPath('/', 'fr')).toBe('/fr/');
  });

  it('prefixes nested paths', () => {
    expect(getI18nPath('/dashboard/user-profile', 'fr')).toBe(
      '/fr/dashboard/user-profile'
    );
  });
});

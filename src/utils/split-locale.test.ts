import { describe, expect, it } from 'vitest';

import { splitLocale } from '@/utils/split-locale';

describe('splitLocale', () => {
  it('leaves an unprefixed path untouched', () => {
    expect(splitLocale('/contact')).toEqual({
      localePrefix: '',
      pathWithoutLocale: '/contact',
    });
  });

  it('strips a known locale prefix', () => {
    expect(splitLocale('/fr/contact')).toEqual({
      localePrefix: '/fr',
      pathWithoutLocale: '/contact',
    });
  });

  it('treats an unknown first segment as part of the path', () => {
    expect(splitLocale('/de/contact')).toEqual({
      localePrefix: '',
      pathWithoutLocale: '/de/contact',
    });
  });

  it('handles the bare locale root', () => {
    expect(splitLocale('/fr')).toEqual({
      localePrefix: '/fr',
      pathWithoutLocale: '/',
    });
  });

  it('handles the site root', () => {
    expect(splitLocale('/')).toEqual({
      localePrefix: '',
      pathWithoutLocale: '/',
    });
  });

  it('keeps nested segments after stripping the locale', () => {
    expect(splitLocale('/en/dashboard/user-profile')).toEqual({
      localePrefix: '/en',
      pathWithoutLocale: '/dashboard/user-profile',
    });
  });
});

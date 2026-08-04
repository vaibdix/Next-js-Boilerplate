import { describe, expect, it } from 'vitest';

import { isClerkPath } from '@/utils/is-clerk-path';
import { isProtectedPath } from '@/utils/is-protected-path';
import { splitLocale } from '@/utils/split-locale';

const clerkRunsFor = (pathname: string) =>
  isClerkPath(splitLocale(pathname).pathWithoutLocale);

describe('isProtectedPath', () => {
  it('protects the dashboard and everything under it', () => {
    expect(isProtectedPath('/dashboard')).toBe(true);
    expect(isProtectedPath('/dashboard/user-profile')).toBe(true);
  });

  it('leaves marketing paths unprotected', () => {
    expect(isProtectedPath('/')).toBe(false);
    expect(isProtectedPath('/about')).toBe(false);
    expect(isProtectedPath('/sign-in')).toBe(false);
  });
});

describe('isClerkPath', () => {
  it('covers protected and auth paths', () => {
    expect(isClerkPath('/dashboard')).toBe(true);
    expect(isClerkPath('/sign-in')).toBe(true);
    expect(isClerkPath('/sign-up')).toBe(true);
  });

  it('excludes marketing paths', () => {
    expect(isClerkPath('/')).toBe(false);
    expect(isClerkPath('/about')).toBe(false);
    expect(isClerkPath('/contact')).toBe(false);
  });
});

describe('clerk middleware routing decision', () => {
  it.each([
    ['/', false],
    ['/about', false],
    ['/contact', false],
    ['/fr', false],
    ['/fr/about', false],
    ['/fr/contact', false],
    ['/dashboard', true],
    ['/fr/dashboard', true],
    ['/en/dashboard/user-profile', true],
    ['/sign-in', true],
    ['/fr/sign-up', true],
  ])('%s runs Clerk: %s', (pathname, expected) => {
    expect(clerkRunsFor(pathname)).toBe(expected);
  });
});

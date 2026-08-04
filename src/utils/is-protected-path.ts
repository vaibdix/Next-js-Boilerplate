const PROTECTED_PREFIX = '/dashboard';

export const isProtectedPath = (pathWithoutLocale: string) =>
  pathWithoutLocale.startsWith(PROTECTED_PREFIX);

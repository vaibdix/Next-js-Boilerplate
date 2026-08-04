import { isProtectedPath } from '@/utils/is-protected-path';

const AUTH_PAGE_PREFIXES = ['/sign-in', '/sign-up'] as const;

export const isClerkPath = (pathWithoutLocale: string) =>
  isProtectedPath(pathWithoutLocale) ||
  AUTH_PAGE_PREFIXES.some((prefix) => pathWithoutLocale.startsWith(prefix));

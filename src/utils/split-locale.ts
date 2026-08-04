import { routing } from '@/libs/i18n-routing';

export const splitLocale = (pathname: string) => {
  const [, firstSegment = '', ...restSegments] = pathname.split('/');
  const hasLocalePrefix = routing.locales.some(
    (locale) => locale === firstSegment
  );

  return hasLocalePrefix
    ? {
        localePrefix: `/${firstSegment}`,
        pathWithoutLocale: `/${restSegments.join('/')}`,
      }
    : { localePrefix: '', pathWithoutLocale: pathname };
};

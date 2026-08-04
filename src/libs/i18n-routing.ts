import { defineRouting } from 'next-intl/routing';

import { AppConfig } from '@/utils/app-config';

export const routing = defineRouting({
  locales: AppConfig.i18n.locales,
  localePrefix: AppConfig.i18n.localePrefix,
  defaultLocale: AppConfig.i18n.defaultLocale,
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/contact': '/contact',
    '/sign-in': '/sign-in',
    '/sign-up': '/sign-up',
    '/dashboard': '/dashboard',
    '/dashboard/user-profile': '/dashboard/user-profile',
  },
});

import type { MetadataRoute } from 'next';

import { getPathname } from '@/libs/i18n-navigation';
import { routing } from '@/libs/i18n-routing';
import { getBaseUrl } from '@/utils/get-base-url';

const routes = ['/', '/about', '/contact'] as const;

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = getBaseUrl();

  return routes.map((route) => ({
    url: `${baseUrl}${getPathname({ href: route, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.flatMap((locale) =>
          locale === routing.defaultLocale
            ? []
            : [[locale, `${baseUrl}${getPathname({ href: route, locale })}`]]
        )
      ),
    },
  }));
};

export default sitemap;

import type { MetadataRoute } from 'next';
import { getPathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/Helpers';

const routes = ['/', '/about', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return routes.map((route) => ({
    url: `${baseUrl}${getPathname({ href: route, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales
          .filter((locale) => locale !== routing.defaultLocale)
          .map((locale) => [
            locale,
            `${baseUrl}${getPathname({ href: route, locale })}`,
          ])
      ),
    },
  }));
}

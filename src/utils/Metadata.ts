import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/libs/I18nRouting';
import type messages from '@/locales/en.json';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

type PageMetadataOptions = {
  locale: string;
  namespace: keyof typeof messages;
  path: string;
  params?: Record<string, string>;
};

/**
 * Generates page metadata with OpenGraph, Twitter, and alternate links.
 * @param options - The locale, namespace, path, and optional interpolation params.
 * @returns Fully populated metadata for the page.
 */
export const generatePageMetadata = async (
  options: PageMetadataOptions
): Promise<Metadata> => {
  const t = await getTranslations({
    locale: options.locale,
    namespace: options.namespace,
  });

  const title = t('meta_title', options.params);
  const description = t('meta_description', options.params);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${getI18nPath(options.path, options.locale)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: AppConfig.name,
      locale: options.locale,
      type: 'website',
      images: [
        {
          url: '/assets/images/nextjs-starter-banner.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/images/nextjs-starter-banner.png'],
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${baseUrl}${getI18nPath(options.path, l)}`,
        ])
      ),
    },
  };
};

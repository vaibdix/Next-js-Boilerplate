import Script from 'next/script';
import type { Organization, WithContext } from 'schema-dts';

import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';

/**
 * Renders an Organization JSON-LD block for search engines.
 * @returns A next/script tag with the Organization schema.
 */
export function OrganizationJsonLd() {
  const baseUrl = getBaseUrl();
  const data: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: AppConfig.name,
    url: baseUrl,
    logo: `${baseUrl}/apple-touch-icon.png`,
    sameAs: [],
  };

  return (
    <Script id="organization-jsonld" type="application/ld+json">
      {JSON.stringify(data).replaceAll('<', '\\u003c')}
    </Script>
  );
}

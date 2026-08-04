import type { MetadataRoute } from 'next';

import { getBaseUrl } from '@/utils/get-base-url';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard',
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
};

export default robots;

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import './src/libs/env';

const baseConfig: NextConfig = {
  output: 'standalone',
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    globalNotFound: true,
    useTypeScriptCli: true,
  },
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.efferd.com',
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  headers: () => {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
};

let configWithPlugins = createNextIntlPlugin('./src/libs/i18n.ts')(baseConfig);

if (process.env['ANALYZE'] === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}
if (
  process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === undefined ||
  process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === ''
) {
  configWithPlugins = withSentryConfig(configWithPlugins, {
    org: process.env['SENTRY_ORGANIZATION'] ?? '',
    project: process.env['SENTRY_PROJECT'] ?? '',
    silent: process.env['CI'] === undefined || process.env['CI'] === '',
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',

    webpack: {
      reactComponentAnnotation: {
        enabled: true,
      },

      treeshake: {
        removeDebugLogging: true,
      },
    },
    telemetry: false,
  });
}

const nextConfig = configWithPlugins;
export default nextConfig;

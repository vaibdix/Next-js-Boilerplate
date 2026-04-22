import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';

/**
 * Generates the web app manifest for PWA and Add to Home Screen support.
 * @returns The manifest configuration.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: AppConfig.name,
    short_name: AppConfig.name,
    description: 'Starter code for your Nextjs Boilerplate with Tailwind CSS',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

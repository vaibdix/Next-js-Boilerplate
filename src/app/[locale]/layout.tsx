import '@/styles/global.css';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';

import { AnnouncerProvider } from '@/components/announcer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { OrganizationJsonLd } from '@/components/json-ld';
import { QueryProvider } from '@/components/query-provider';
import { SkipToContent } from '@/components/skip-to-content';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WebVitals } from '@/components/web-vitals';
import { cn } from '@/lib/utils';
import { routing } from '@/libs/i18n-routing';
import { getBaseUrl } from '@/utils/get-base-url';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#252525' },
  ],
};

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const RootLayout = async (props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn('antialiased', manrope.variable)}
    >
      <head>
        <link
          rel="preconnect"
          href="https://storage.efferd.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://storage.efferd.com" />
        <OrganizationJsonLd />
        <GoogleAnalytics />
      </head>
      <body>
        <SkipToContent />
        <NextIntlClientProvider>
          <QueryProvider>
            <ThemeProvider>
              <AnnouncerProvider>
                <TooltipProvider>
                  <main id="main-content">{props.children}</main>
                </TooltipProvider>
              </AnnouncerProvider>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <WebVitals />
      </body>
    </html>
  );
};

export default RootLayout;

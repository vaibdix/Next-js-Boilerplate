import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Manrope } from 'next/font/google';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { AnnouncerProvider } from '@/components/announcer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { QueryProvider } from '@/components/query-provider';
import { SkipToContent } from '@/components/skip-to-content';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WebVitals } from '@/components/web-vitals';
import { isTheme, THEME_COOKIE_NAME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/utils/Helpers';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const initialTheme = isTheme(cookieTheme) ? cookieTheme : 'system';
  const resolvedTheme =
    initialTheme === 'light' || initialTheme === 'dark'
      ? initialTheme
      : undefined;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        'antialiased',
        manrope.variable,
        resolvedTheme === 'dark' && 'dark',
        resolvedTheme === 'light' && 'light'
      )}
      style={
        resolvedTheme === undefined ? undefined : { colorScheme: resolvedTheme }
      }
    >
      <body>
        <SkipToContent />
        <NextIntlClientProvider>
          <QueryProvider>
            <ThemeProvider initialTheme={initialTheme}>
              <AnnouncerProvider>
                <TooltipProvider>
                  <main id="main-content">{props.children}</main>
                </TooltipProvider>
              </AnnouncerProvider>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <WebVitals />
      </body>
    </html>
  );
}

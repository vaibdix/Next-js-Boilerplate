import Script from 'next/script';
import { Env } from '@/libs/Env';

/**
 * Renders Google Analytics gtag scripts when the measurement ID is configured.
 * @returns The gtag script elements or null if unconfigured.
 */
export function GoogleAnalytics() {
  const gaId = Env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (gaId === undefined || gaId === '') {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(gaId)});
        `}
      </Script>
    </>
  );
}

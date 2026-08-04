import Script from 'next/script';

import { Env } from '@/libs/env';

export const GoogleAnalytics = () => {
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
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
};

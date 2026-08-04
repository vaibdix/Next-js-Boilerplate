'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

import { routing } from '@/libs/i18n-routing';

const GlobalError = (props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <html lang={routing.defaultLocale}>
      <body>
        <NextError statusCode={0} />
        <button
          type="button"
          onClick={() => {
            props.unstable_retry();
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
};

export default GlobalError;

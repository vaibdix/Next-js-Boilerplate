'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

import { routing } from '@/libs/I18nRouting';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <html lang={routing.defaultLocale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
        {/* `global-error.tsx` replaces the next-intl provider tree, so this
        string is intentionally hard-coded English — see Next.js docs. */}
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
}

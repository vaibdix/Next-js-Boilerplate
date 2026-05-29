'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Error boundary for authenticated routes (dashboard, user profile).
 * @param props - Error and reset callback from Next.js.
 * @returns A friendly error UI with a retry button.
 */
export default function AuthError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');

  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">{t('heading')}</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {t('description')}
      </p>
      {props.error.digest !== undefined && (
        <p className="text-xs text-muted-foreground">
          {t('error_id', { id: props.error.digest })}
        </p>
      )}
      <Button onClick={props.reset}>{t('retry')}</Button>
    </div>
  );
}

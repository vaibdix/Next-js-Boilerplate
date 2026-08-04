'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export const ErrorState = (props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  const t = useTranslations('Error');

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
      <Button
        onClick={() => {
          props.unstable_retry();
        }}
      >
        {t('retry')}
      </Button>
    </div>
  );
};

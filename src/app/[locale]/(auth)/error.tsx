'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

import { ErrorState } from '@/components/error-state';

const AuthError = (props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return <ErrorState {...props} />;
};

export default AuthError;

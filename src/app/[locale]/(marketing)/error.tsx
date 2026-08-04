'use client';

import { ErrorState } from '@/components/error-state';

const MarketingError = (props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) => {
  return <ErrorState {...props} />;
};

export default MarketingError;

import { Env } from '@/libs/env';

const SENSITIVE_PATH_RE = /\/dashboard(\/|$)|\/user-profile(\/|$)/u;

const canTrackAnalytics = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (SENSITIVE_PATH_RE.test(window.location.pathname)) {
    return false;
  }

  return (
    Env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== undefined &&
    Env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== ''
  );
};

export const trackEvent = (
  event: string,
  params: Record<string, unknown> = {}
): void => {
  if (!canTrackAnalytics()) {
    return;
  }

  window.gtag?.('event', event, params);
};

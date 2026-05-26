import { Env } from '@/libs/Env';

const SENSITIVE_PATH_RE = /\/dashboard(\/|$)|\/user-profile(\/|$)/u;

/**
 * Sends a gtag event unless the current path matches a sensitive route.
 * @param event - The gtag event name.
 * @param params - Event parameters forwarded to gtag.
 */
export function trackEvent(
  event: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (SENSITIVE_PATH_RE.test(window.location.pathname)) {
    return;
  }

  if (
    Env.NEXT_PUBLIC_GA_MEASUREMENT_ID === undefined ||
    Env.NEXT_PUBLIC_GA_MEASUREMENT_ID === ''
  ) {
    return;
  }

  window.gtag?.('event', event, params);
}

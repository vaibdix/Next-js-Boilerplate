import * as Sentry from '@sentry/nextjs';

const sentryOptions: Sentry.NodeOptions | Sentry.EdgeOptions = {
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
  spotlight: process.env['NEXT_PUBLIC_SPOTLIGHT'] === '1',
  integrations: [Sentry.consoleLoggingIntegration()],
  dataCollection: { frameContextLines: 7 },
  tracesSampleRate: 1,
  enableLogs: true,
  debug: false,
};

const SENTRY_RUNTIMES = new Set(['edge', 'nodejs']);

const isSentryEnabled = () => {
  return (
    process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === undefined ||
    process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === ''
  );
};

export const register = () => {
  if (!isSentryEnabled()) {
    return;
  }

  if (SENTRY_RUNTIMES.has(process.env['NEXT_RUNTIME'] ?? '')) {
    Sentry.init(sentryOptions);
  }
};

const noopRequestError: typeof Sentry.captureRequestError = () => {};

export const onRequestError = isSentryEnabled()
  ? Sentry.captureRequestError
  : noopRequestError;

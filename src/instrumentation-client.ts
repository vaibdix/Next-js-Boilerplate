import * as Sentry from '@sentry/nextjs';

if (
  process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === undefined ||
  process.env['NEXT_PUBLIC_SENTRY_DISABLED'] === ''
) {
  Sentry.init({
    dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
      }),
      Sentry.consoleLoggingIntegration(),
      Sentry.browserTracingIntegration(),

      ...(process.env.NODE_ENV === 'development'
        ? [Sentry.spotlightBrowserIntegration()]
        : []),
    ],
    dataCollection: { frameContextLines: 7 },
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    enableLogs: true,
    debug: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

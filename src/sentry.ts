import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
  })
}

export { Sentry }

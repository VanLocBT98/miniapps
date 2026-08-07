import { initObservability } from '@repo/shared/observability'

/**
 * Bootstrap hooks for Sentry / OpenTelemetry.
 * Wire real SDKs here later — feature code should only use captureException / startSpan.
 */
export function bootstrapObservability() {
  const env =
    typeof import.meta !== 'undefined'
      ? (import.meta.env as Record<string, string | undefined>)
      : {}

  initObservability({
    appName: env.VITE_APP_NAME ?? 'MiniApps Platform',
    environment: env.VITE_APP_ENV ?? env.MODE ?? 'development',
    release: env.VITE_APP_RELEASE,
    dsn: env.VITE_SENTRY_DSN,
  })
}

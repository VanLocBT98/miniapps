/**
 * Observability hooks — prepare Sentry / OpenTelemetry without coupling features.
 * Wire real SDKs in host bootstrap; keep this module side-effect free until init.
 */

export type ObservabilityContext = {
  appName: string
  environment: string
  release?: string
  dsn?: string
}

export type TelemetrySpan = {
  name: string
  end: (error?: unknown) => void
}

type ObservabilityBackend = {
  captureException: (error: unknown, context?: Record<string, unknown>) => void
  captureMessage: (message: string, context?: Record<string, unknown>) => void
  startSpan: (name: string) => TelemetrySpan
}

const noopSpan = (name: string): TelemetrySpan => ({
  name,
  end: () => undefined,
})

const noopBackend: ObservabilityBackend = {
  captureException: () => undefined,
  captureMessage: () => undefined,
  startSpan: noopSpan,
}

let backend: ObservabilityBackend = noopBackend
let configured: ObservabilityContext | null = null

export function initObservability(
  context: ObservabilityContext,
  impl?: Partial<ObservabilityBackend>,
) {
  configured = context
  backend = {
    ...noopBackend,
    ...impl,
  }
}

export function getObservabilityContext() {
  return configured
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  backend.captureException(error, context)
}

export function captureMessage(message: string, context?: Record<string, unknown>) {
  backend.captureMessage(message, context)
}

export function startSpan(name: string): TelemetrySpan {
  return backend.startSpan(name)
}

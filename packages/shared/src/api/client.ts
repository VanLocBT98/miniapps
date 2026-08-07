import {
  createFetchClient,
  type FetchClient,
  type FetchClientOptions,
} from './fetch-client'

export type ApiEnvironment = 'development' | 'staging' | 'production'

/**
 * Resolve API base URL from public env — never hardcode hosts in features.
 *
 * Defaults when `VITE_API_URL` is unset:
 * - development → http://localhost:3001
 * - staging → https://staging-api-mini-apps.vercel.app
 * - production → https://api-mini-apps.vercel.app
 */
export function resolveApiBaseUrl(env: Record<string, string | undefined> = {}): string {
  const explicit = env.VITE_API_URL?.trim()
  if (explicit) return stripTrailingSlash(explicit)

  const mode = (env.VITE_APP_ENV ?? env.MODE ?? env.NODE_ENV ?? 'development')
    .toString()
    .toLowerCase()

  if (mode === 'production' || mode === 'prod') {
    return 'https://api-mini-apps.vercel.app'
  }
  if (mode === 'staging' || mode === 'sit' || mode === 'uat') {
    return 'https://staging-api-mini-apps.vercel.app'
  }
  return 'http://localhost:3001'
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

export type CreateApiClientOptions = Omit<FetchClientOptions, 'baseUrl'> & {
  env?: Record<string, string | undefined>
  baseUrl?: string
}

/** Typed client bound to `api-mini-apps` via environment variables. */
export function createApiClient(options: CreateApiClientOptions = {}): FetchClient {
  const { env = {}, baseUrl, ...rest } = options
  return createFetchClient({
    ...rest,
    baseUrl: baseUrl ?? resolveApiBaseUrl(env),
  })
}

let singleton: FetchClient | null = null

/** Lazy singleton for app code — call `resetApiClient()` in tests. */
export function getApiClient(options?: CreateApiClientOptions): FetchClient {
  if (!singleton || options) {
    singleton = createApiClient(options)
  }
  return singleton
}

export function resetApiClient() {
  singleton = null
}

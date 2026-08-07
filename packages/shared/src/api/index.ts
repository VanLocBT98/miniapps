import { z } from 'zod'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(message: string, options: { status: number; code: string; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().default('UNKNOWN'),
  details: z.unknown().optional(),
})

export type FetchClientOptions = {
  baseUrl?: string
  getAccessToken?: () => string | null | Promise<string | null>
  onUnauthorized?: () => void | Promise<void>
  retries?: number
  defaultHeaders?: HeadersInit
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  retries?: number
  parseJson?: boolean
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createFetchClient(options: FetchClientOptions = {}) {
  const {
    baseUrl = '',
    getAccessToken,
    onUnauthorized,
    retries: defaultRetries = 1,
    defaultHeaders,
  } = options

  async function request<T>(path: string, requestOptions: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers,
      signal,
      retries = defaultRetries,
      parseJson = true,
    } = requestOptions

    const url = path.startsWith('http') ? path : `${baseUrl}${path}`
    let attempt = 0
    let lastError: unknown

    while (attempt <= retries) {
      try {
        const token = getAccessToken ? await getAccessToken() : null
        const response = await fetch(url, {
          method,
          signal,
          headers: {
            Accept: 'application/json',
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...Object.fromEntries(new Headers(defaultHeaders).entries()),
            ...Object.fromEntries(new Headers(headers).entries()),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        })

        if (response.status === 401) {
          await onUnauthorized?.()
          throw new ApiError('Unauthorized', { status: 401, code: 'UNAUTHORIZED' })
        }

        if (!response.ok) {
          let payload: unknown
          try {
            payload = await response.json()
          } catch {
            payload = undefined
          }
          const parsed = apiErrorSchema.safeParse(payload)
          throw new ApiError(parsed.success ? parsed.data.message : response.statusText, {
            status: response.status,
            code: parsed.success ? parsed.data.code : 'HTTP_ERROR',
            details: parsed.success ? parsed.data.details : payload,
          })
        }

        if (!parseJson || response.status === 204) {
          return undefined as T
        }

        return (await response.json()) as T
      } catch (error) {
        lastError = error
        if (error instanceof ApiError && error.status < 500) {
          throw error
        }
        if (signal?.aborted) {
          throw error
        }
        attempt += 1
        if (attempt > retries) break
        await sleep(200 * attempt)
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Request failed')
  }

  return {
    request,
    get: <T>(path: string, init?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...init, method: 'GET' }),
    post: <T>(path: string, body?: unknown, init?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...init, method: 'POST', body }),
    put: <T>(path: string, body?: unknown, init?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...init, method: 'PUT', body }),
    patch: <T>(path: string, body?: unknown, init?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...init, method: 'PATCH', body }),
    delete: <T>(path: string, init?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...init, method: 'DELETE' }),
  }
}

export type FetchClient = ReturnType<typeof createFetchClient>

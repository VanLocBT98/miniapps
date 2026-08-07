/**
 * Ambient fallback when the IDE cannot resolve package "exports".
 * Runtime still uses the real `@tanstack/react-start` dependency.
 */
declare module '@tanstack/react-start' {
  type Method = 'GET' | 'POST'

  type ServerFnCallable<TData = any, TResult = any> = (
    opts?: { data?: TData },
  ) => Promise<TResult>

  type ServerFnBuilder<TData = any> = {
    validator: (schema: unknown) => ServerFnBuilder<TData>
    handler: <TResult>(
      fn: (ctx: { data: TData }) => TResult | Promise<TResult>,
    ) => ServerFnCallable<TData, Awaited<TResult>>
    middleware: (...args: unknown[]) => ServerFnBuilder<TData>
  }

  export function createServerFn(options?: {
    method?: Method
    strict?: boolean | { input?: boolean; output?: boolean }
  }): ServerFnBuilder
}

declare module '@tanstack/react-start/server' {
  export function getCookie(name: string): string | undefined
  export function setCookie(
    name: string,
    value: string,
    options?: Record<string, unknown>,
  ): void
  export function deleteCookie(name: string): void
}

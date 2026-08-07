import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import {
  detectRuntime,
  type ApplicationMode,
  type RuntimeContextValue,
} from './detect'

const RuntimeContext = createContext<RuntimeContextValue | null>(null)

export type RuntimeProviderProps = {
  children: ReactNode
  /** SSR / tests: pass a fully resolved value. */
  value?: RuntimeContextValue
  /** Partial overrides merged onto auto-detect. */
  href?: string
  currentHost?: string
  forcedMode?: ApplicationMode
  searchParams?: URLSearchParams | Record<string, string | undefined>
}

function resolveHost(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

function resolveHref(fallbackHost: string): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.href
  }
  return fallbackHost
}

export function RuntimeProvider({
  children,
  value,
  href,
  currentHost,
  forcedMode,
  searchParams,
}: RuntimeProviderProps) {
  const resolved = useMemo(() => {
    if (value) return value
    const host = currentHost ?? resolveHost()
    return detectRuntime({
      href: href ?? resolveHref(host),
      currentHost: host,
      forcedMode,
      searchParams,
    })
  }, [value, href, currentHost, forcedMode, searchParams])

  return createElement(RuntimeContext.Provider, { value: resolved }, children)
}

export function useRuntime(): RuntimeContextValue {
  const ctx = useContext(RuntimeContext)
  if (!ctx) {
    throw new Error('useRuntime must be used within RuntimeProvider')
  }
  return ctx
}

/** Safe hook when provider may be absent (defaults to STANDALONE). */
export function useRuntimeOptional(): RuntimeContextValue | null {
  return useContext(RuntimeContext)
}

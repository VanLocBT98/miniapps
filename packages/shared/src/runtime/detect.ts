import { z } from 'zod'

/** How the mini-app is currently being hosted. */
export const applicationModeSchema = z.enum(['STANDALONE', 'PORTAL'])
export type ApplicationMode = z.infer<typeof applicationModeSchema>

export const runtimeContextSchema = z.object({
  mode: applicationModeSchema,
  /** Origin of the Main App portal (when mode is PORTAL). */
  portalHost: z.string().nullable(),
  /** Active project id (registry id). */
  currentProject: z.string().nullable(),
  /** Origin of the current app (window / request host). */
  currentHost: z.string(),
})

export type RuntimeContextValue = z.infer<typeof runtimeContextSchema>

export type DetectRuntimeInput = {
  /** Full URL or path+search of the current request/page. */
  href: string
  /** Hostname origin of this app (e.g. https://project-a.vercel.app). */
  currentHost: string
  /** Optional forced mode (tests / SSR injection). */
  forcedMode?: ApplicationMode
  searchParams?: URLSearchParams | Record<string, string | undefined>
}

const PORTAL_PATH_RE = /^\/project\/([^/]+)/i

function readParam(
  search: URLSearchParams | Record<string, string | undefined> | undefined,
  key: string,
): string | undefined {
  if (!search) return undefined
  if (search instanceof URLSearchParams) {
    return search.get(key) ?? undefined
  }
  const v = search[key]
  return v == null || v === '' ? undefined : v
}

/**
 * Derive ApplicationMode + portal metadata without hardcoding hosts.
 *
 * Signals (first match wins for project id):
 * 1. `forcedMode` (tests)
 * 2. Path `/project/:projectId/...` → PORTAL
 * 3. Query `mode=portal` | `portal=1` → PORTAL
 * 4. Otherwise STANDALONE
 */
export function detectRuntime(input: DetectRuntimeInput): RuntimeContextValue {
  const url = safeUrl(input.href, input.currentHost)
  const search = input.searchParams ?? url.searchParams
  const path = url.pathname

  const pathMatch = path.match(PORTAL_PATH_RE)
  const projectFromPath = pathMatch?.[1] ?? null
  const projectFromQuery =
    readParam(search, 'project') ?? readParam(search, 'currentProject') ?? null
  const currentProject = projectFromPath ?? projectFromQuery

  const modeFlag = (readParam(search, 'mode') ?? '').toLowerCase()
  const portalFlag = readParam(search, 'portal')
  const portalHost =
    readParam(search, 'portalHost') ??
    readParam(search, 'portal_host') ??
    null

  let mode: ApplicationMode = 'STANDALONE'
  if (input.forcedMode) {
    mode = input.forcedMode
  } else if (projectFromPath || modeFlag === 'portal' || portalFlag === '1') {
    mode = 'PORTAL'
  }

  return {
    mode,
    portalHost: mode === 'PORTAL' ? portalHost ?? inferPortalFromReferrer() : null,
    currentProject,
    currentHost: stripTrailingSlash(input.currentHost),
  }
}

function safeUrl(href: string, base: string): URL {
  try {
    return new URL(href, base)
  } catch {
    return new URL('/', base)
  }
}

function stripTrailingSlash(origin: string): string {
  return origin.replace(/\/$/, '')
}

function inferPortalFromReferrer(): string | null {
  if (typeof document === 'undefined') return null
  try {
    if (!document.referrer) return null
    return new URL(document.referrer).origin
  } catch {
    return null
  }
}

export function portalHomePath(runtime: RuntimeContextValue): string {
  if (runtime.portalHost) return `${runtime.portalHost}/`
  return '/'
}

export function isPortalMode(runtime: RuntimeContextValue): boolean {
  return runtime.mode === 'PORTAL'
}

import { z } from 'zod'

/** Serializable project metadata for the portal registry (no business logic). */
export const registryRouteSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  title: z.string().min(1),
})

export const projectRegistryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
  icon: z.string().default('app'),
  /** Absolute origin of the independently deployed project, if known. */
  host: z.string().url().nullable().default(null),
  /** Local in-process base path when the package is installed in the host. */
  basePath: z.string().min(1),
  routes: z.array(registryRouteSchema).default([]),
  /** Env key used to resolve host (e.g. VITE_PROJECT_BOOKING_HOST). */
  hostEnvKey: z.string().optional(),
  /** Whether the project package is mounted inside the Main App today. */
  local: z.boolean().default(true),
})

export type RegistryRoute = z.infer<typeof registryRouteSchema>
export type ProjectRegistryEntry = z.infer<typeof projectRegistryEntrySchema>

export const projectRegistrySchema = z.object({
  version: z.string().default('1'),
  portalHost: z.string().url().optional(),
  projects: z.array(projectRegistryEntrySchema),
})

export type ProjectRegistry = z.infer<typeof projectRegistrySchema>

export type HostEnvMap = Record<string, string | undefined>

/**
 * Catalog without hosts — hosts are injected from environment.
 * Main App UI must load this via `loadProjectRegistry`, not hardcode cards.
 */
export const PROJECT_CATALOG: Omit<ProjectRegistryEntry, 'host'>[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Home, analytics, and profile for operators.',
    icon: 'layout-dashboard',
    basePath: '/dashboard',
    hostEnvKey: 'VITE_PROJECT_DASHBOARD_HOST',
    local: true,
    routes: [
      { id: 'home', path: '/', title: 'Dashboard' },
      { id: 'analytics', path: '/analytics', title: 'Analytics' },
    ],
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Users, roles, and permissions.',
    icon: 'shield',
    basePath: '/admin',
    hostEnvKey: 'VITE_PROJECT_ADMIN_HOST',
    local: true,
    routes: [
      { id: 'users', path: '/users', title: 'Users' },
      { id: 'roles', path: '/roles', title: 'Roles' },
    ],
  },
  {
    id: 'booking',
    name: 'Booking',
    description: 'Bookings, calendar, and customer management.',
    icon: 'plane',
    basePath: '/booking',
    hostEnvKey: 'VITE_PROJECT_BOOKING_HOST',
    local: true,
    routes: [
      { id: 'list', path: '/', title: 'Bookings' },
      { id: 'calendar', path: '/calendar', title: 'Calendar' },
      { id: 'customers', path: '/customer', title: 'Customers' },
    ],
  },
]

let cache: { key: string; registry: ProjectRegistry; at: number } | null = null
const CACHE_TTL_MS = 60_000

export function resolveHostFromEnv(
  hostEnvKey: string | undefined,
  env: HostEnvMap,
): string | null {
  if (!hostEnvKey) return null
  const raw = env[hostEnvKey]?.trim()
  if (!raw) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}

export type LoadRegistryOptions = {
  env?: HostEnvMap
  portalHost?: string
  /** Bypass in-memory cache. */
  bustCache?: boolean
  /** Extra / override catalog entries (remote manifest merge later). */
  catalog?: Omit<ProjectRegistryEntry, 'host'>[]
}

/**
 * Build the portal registry from catalog + env hosts.
 * Cached in-memory; safe for client + server.
 */
export function loadProjectRegistry(
  options: LoadRegistryOptions = {},
): ProjectRegistry {
  const env = options.env ?? {}
  const catalog = options.catalog ?? PROJECT_CATALOG
  const portalHost =
    options.portalHost ??
    env.VITE_PORTAL_HOST ??
    env.VITE_APP_URL ??
    undefined

  const cacheKey = JSON.stringify({
    portalHost,
    hosts: catalog.map((c) => [c.id, c.hostEnvKey ? env[c.hostEnvKey] : null]),
  })

  if (
    !options.bustCache &&
    cache &&
    cache.key === cacheKey &&
    Date.now() - cache.at < CACHE_TTL_MS
  ) {
    return cache.registry
  }

  const projects = catalog.map((entry) =>
    projectRegistryEntrySchema.parse({
      ...entry,
      host: resolveHostFromEnv(entry.hostEnvKey, env),
    }),
  )

  const registry = projectRegistrySchema.parse({
    version: '1',
    portalHost: portalHost ? String(portalHost).replace(/\/$/, '') : undefined,
    projects,
  })

  cache = { key: cacheKey, registry, at: Date.now() }
  return registry
}

export function getRegistryProject(
  registry: ProjectRegistry,
  id: string,
): ProjectRegistryEntry | undefined {
  return registry.projects.find((p) => p.id === id)
}

/** Portal entry path on Main App. */
export function portalProjectPath(projectId: string, subPath = ''): string {
  const suffix = subPath.replace(/^\//, '')
  return suffix ? `/project/${projectId}/${suffix}` : `/project/${projectId}`
}

/** Prefetch hint URL for a remote project origin (DNS + document). */
export function projectPrefetchUrls(entry: ProjectRegistryEntry): string[] {
  if (!entry.host) return []
  return [entry.host, `${entry.host}/`]
}

export function clearRegistryCache(): void {
  cache = null
}

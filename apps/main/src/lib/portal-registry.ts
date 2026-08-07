import {
  loadProjectRegistry,
  type HostEnvMap,
  type ProjectRegistry,
  type ProjectRegistryEntry,
} from '@repo/shared/registry'

/** Collect Vite public env for registry host resolution. */
export function portalEnvFromImportMeta(
  env: Record<string, string | boolean | undefined> = import.meta.env,
): HostEnvMap {
  const out: HostEnvMap = {}
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') out[key] = value
  }
  return out
}

let clientCache: ProjectRegistry | null = null

/** Lazy-load + cache registry for the Main App (client/SSR). */
export function getPortalRegistry(bust = false): ProjectRegistry {
  if (!bust && clientCache) return clientCache
  clientCache = loadProjectRegistry({
    env: portalEnvFromImportMeta(),
    bustCache: bust,
  })
  return clientCache
}

export function getPortalProject(id: string): ProjectRegistryEntry | undefined {
  return getPortalRegistry().projects.find((p) => p.id === id)
}

export type { ProjectRegistry, ProjectRegistryEntry }

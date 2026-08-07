/**
 * Map portal navigation paths (e.g. `/dashboard/analytics`) to standalone
 * router paths when the router uses `basepath: project.basePath`.
 */
export function toStandaloneHref(basePath: string, path: string): string {
  const base = basePath.replace(/\/$/, '') || ''
  if (!base) return path || '/'
  if (path === base || path === `${base}/`) return '/'
  if (path.startsWith(`${base}/`)) {
    const rest = path.slice(base.length)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return path.startsWith('/') ? path : `/${path}`
}

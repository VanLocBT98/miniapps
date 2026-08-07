import { project as dashboard } from '@repo/dashboard'
import { project as admin } from '@repo/admin'
import { project as booking } from '@repo/booking'
import { project as portfolio } from '@repo/portfolio'
import {
  clearProjectRegistry,
  getRegisteredProjects,
  registerProject,
  type MiniProjectDefinition,
  type NavigationItem,
} from '@repo/shared/project'
import type { ProjectMeta } from '~/lib/router-context'

/**
 * Workspace-installed mini apps.
 * Adding a project: depend on it in package.json and register here once.
 */
const installedProjects: MiniProjectDefinition[] = [
  portfolio,
  dashboard,
  admin,
  booking,
]

let initialized = false

export function ensureProjectsRegistered() {
  if (initialized) return getRegisteredProjects()
  clearProjectRegistry()
  for (const project of installedProjects) {
    registerProject(project)
  }
  initialized = true
  return getRegisteredProjects()
}

export function getInstalledProjects() {
  return ensureProjectsRegistered()
}

export function toProjectMeta(project: MiniProjectDefinition): ProjectMeta {
  return {
    id: project.id,
    name: project.name,
    version: project.version,
    basePath: project.basePath,
    navigation: project.navigation,
    permissions: project.permissions,
  }
}

export function getInstalledProjectMeta(): ProjectMeta[] {
  return getInstalledProjects().map(toProjectMeta)
}

export function getNavigationFromMeta(
  projects: ProjectMeta[],
  userPermissions: string[],
): NavigationItem[] {
  const can = (required: string[] = []) =>
    required.length === 0 || required.every((p) => userPermissions.includes(p))

  return projects
    .flatMap((project) =>
      project.navigation
        .filter((item) => can(item.permissions))
        .map((item) => ({
          ...item,
          path: item.path.startsWith('/')
            ? item.path
            : `${project.basePath}/${item.path}`.replace(/\/+/g, '/'),
        })),
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export { dashboard, admin, booking, portfolio }

import type { ComponentType, ReactNode } from 'react'
import { z } from 'zod'

export const permissionSchema = z.string().min(1)
export type Permission = z.infer<typeof permissionSchema>

export type NavigationItem = {
  id: string
  label: string
  path: string
  icon?: string
  order?: number
  permissions?: Permission[]
  children?: NavigationItem[]
}

export const navigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    path: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
    permissions: z.array(permissionSchema).default([]),
    children: z.array(navigationItemSchema).optional(),
  }),
)

export type ProjectLayoutProps = {
  children: ReactNode
}

export type ProjectProvidersProps = {
  children: ReactNode
}

export type MiniProjectDefinition = {
  id: string
  name: string
  version: string
  basePath: string
  navigation: NavigationItem[]
  permissions: Permission[]
  Layout?: ComponentType<ProjectLayoutProps>
  Providers?: ComponentType<ProjectProvidersProps>
  /** Host mounts these page modules under basePath */
  pages: ProjectPageDefinition[]
  translations?: Record<string, Record<string, string>>
}

export type ProjectPageDefinition = {
  id: string
  path: string
  title: string
  permissions?: Permission[]
  /**
   * Lazy page module. Host may inject route props (e.g. `{ bookingId }`);
   * use a wide component type so param pages type-check.
   */
  component: () => Promise<{ default: ComponentType<any> }>
}

export type CreateProjectInput = {
  id: string
  name: string
  version?: string
  basePath: string
  navigation: NavigationItem[]
  permissions: Permission[]
  Layout?: ComponentType<ProjectLayoutProps>
  Providers?: ComponentType<ProjectProvidersProps>
  pages: ProjectPageDefinition[]
  translations?: Record<string, Record<string, string>>
}

const registry = new Map<string, MiniProjectDefinition>()

export function createProject(input: CreateProjectInput): MiniProjectDefinition {
  const basePath = input.basePath.startsWith('/') ? input.basePath : `/${input.basePath}`

  const project: MiniProjectDefinition = {
    id: input.id,
    name: input.name,
    version: input.version ?? '0.0.0',
    basePath,
    navigation: input.navigation.map((item) => ({
      ...item,
      order: item.order ?? 0,
      permissions: item.permissions ?? [],
    })),
    permissions: input.permissions,
    Layout: input.Layout,
    Providers: input.Providers,
    pages: input.pages,
    translations: input.translations,
  }

  return project
}

export function registerProject(project: MiniProjectDefinition): void {
  if (registry.has(project.id)) {
    throw new Error(`Project already registered: ${project.id}`)
  }
  registry.set(project.id, project)
}

export function getRegisteredProjects(): MiniProjectDefinition[] {
  return [...registry.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function getProjectById(id: string): MiniProjectDefinition | undefined {
  return registry.get(id)
}

export function clearProjectRegistry(): void {
  registry.clear()
}

export function getNavigationForUser(
  projects: MiniProjectDefinition[],
  userPermissions: Permission[],
): NavigationItem[] {
  const can = (required: Permission[] = []) =>
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

import type { QueryClient } from '@tanstack/react-query'
import type { Session } from '@repo/shared/auth'
import type { NavigationItem, Permission } from '@repo/shared/project'

/** Serializable project metadata safe for SSR dehydration */
export type ProjectMeta = {
  id: string
  name: string
  version: string
  basePath: string
  navigation: NavigationItem[]
  permissions: Permission[]
}

export type RouterContext = {
  queryClient: QueryClient
  session: Session | null
  projects: ProjectMeta[]
}

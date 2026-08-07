import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  RouterProvider,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { project } from '../project'
import { ProjectLayout } from '../layouts/ProjectLayout'
import UsersPage from '../pages/UsersPage'
import RolesPage from '../pages/RolesPage'
import PermissionsPage from '../pages/PermissionsPage'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <header className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-800 pb-4">
        <strong>{project.name} (standalone)</strong>
        {project.navigation.map((item) => (
          <Link key={item.id} to={item.path} className="text-sm text-sky-400 hover:underline">
            {item.label}
          </Link>
        ))}
      </header>
      <ProjectLayout>
        <Outlet />
      </ProjectLayout>
    </div>
  ),
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
})

const rolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roles',
  component: RolesPage,
})

const permissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/permissions',
  component: PermissionsPage,
})

const routeTree = rootRoute.addChildren([usersRoute, rolesRoute, permissionsRoute])

const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function StandaloneApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

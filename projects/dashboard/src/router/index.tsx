import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  redirect,
  RouterProvider,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { project } from '../project'
import { ProjectLayout } from '../layouts/ProjectLayout'
import HomePage from '../pages/HomePage'
import AnalyticsPage from '../pages/AnalyticsPage'
import ProfilePage from '../pages/ProfilePage'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950/80 p-6 text-slate-100">
      <header className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-800 pb-4">
        <strong>{project.name} (standalone)</strong>
        {project.navigation.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="text-sm text-sky-400 hover:underline"
          >
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

/** Portal paths and standalone Vercel hosts share the same absolute routes. */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: HomePage,
})

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/analytics',
  component: AnalyticsPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/profile',
  component: ProfilePage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  homeRoute,
  analyticsRoute,
  profileRoute,
])

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

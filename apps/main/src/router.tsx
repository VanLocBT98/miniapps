import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { createQueryClient } from '@repo/shared/query'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { ensureProjectsRegistered, getInstalledProjectMeta } from './projects/installed'
import type { RouterContext } from './lib/router-context'

export type { QueryClient } from '@tanstack/react-query'

export function getRouter() {
  const queryClient = createQueryClient()
  ensureProjectsRegistered()
  const projects = getInstalledProjectMeta()

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      session: null,
      projects,
    } satisfies RouterContext,
    defaultPreload: 'intent',
    defaultPendingComponent: () => (
      <div className="p-8 text-sm text-slate-400">Loading route…</div>
    ),
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastViewport } from '@repo/ui'
import { RuntimeProvider } from '@repo/shared/runtime'
import type { RouterContext } from '~/lib/router-context'
import { getSessionFn } from '~/lib/auth'
import { ensureProjectsRegistered, getInstalledProjectMeta } from '~/projects/installed'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { bootstrapObservability } from '~/lib/observability'

bootstrapObservability()

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    ensureProjectsRegistered()
    const projects = getInstalledProjectMeta()
    const session = await getSessionFn()
    return { session, projects }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'MiniApps Platform',
      },
      {
        name: 'description',
        content: 'SSR Micro Frontend platform built with TanStack Start',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RuntimeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </RuntimeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const enableDevtools = import.meta.env.DEV

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <ToastViewport />
        {enableDevtools ? (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}

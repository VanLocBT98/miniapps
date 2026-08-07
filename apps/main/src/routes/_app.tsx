import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '~/shell/AppShell'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
    return {
      session: context.session,
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { session, projects } = Route.useRouteContext()
  if (!session) return null
  return <AppShell session={session} projects={projects} appName="MiniApps Platform" />
}

import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@repo/ui'
import { ProjectRegistryCards } from '~/components/ProjectRegistryCards'
import { getPortalRegistry } from '~/lib/portal-registry'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: () => ({ registry: getPortalRegistry() }),
  head: () => ({
    meta: [
      { title: 'MiniApps Platform · Portal' },
      {
        name: 'description',
        content:
          'Portal for independent SSR mini-apps. Open Dashboard, Admin, or Booking.',
      },
      { property: 'og:title', content: 'MiniApps Platform · Portal' },
      {
        property: 'og:description',
        content: 'Enter projects through the portal or open them on their own host.',
      },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  const { registry } = Route.useLoaderData()

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
        MiniApps Platform
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
        Portal for independent SSR projects
      </h1>
      <p className="max-w-2xl text-lg text-slate-400">
        Each project can run standalone or open through this portal. Metadata comes from the
        project registry — hosts are configured per environment.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/login">
          <Button size="lg">Sign in</Button>
        </Link>
      </div>
      <ProjectRegistryCards projects={registry.projects} />
      <p className="text-sm text-slate-500">
        Demo accounts: admin@example.com / admin · manager@example.com / manager ·
        viewer@example.com / viewer
      </p>
    </div>
  )
}

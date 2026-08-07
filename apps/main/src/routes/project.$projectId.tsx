import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProjectUnavailable } from '~/components/ProjectUnavailable'
import { getPortalProject, getPortalRegistry } from '~/lib/portal-registry'
import { ensureProjectsRegistered } from '~/projects/installed'

export const Route = createFileRoute('/project/$projectId')({
  loader: ({ params }) => {
    const registry = getPortalRegistry()
    const entry = getPortalProject(params.projectId)
    return { registry, entry, projectId: params.projectId }
  },
  head: ({ loaderData }) => {
    const name = loaderData?.entry?.name ?? loaderData?.projectId ?? 'Project'
    const description =
      loaderData?.entry?.description ||
      `${name} — opened through the MiniApps portal.`
    return {
      meta: [
        { title: `${name} · Portal` },
        { name: 'description', content: description },
        { property: 'og:title', content: `${name} · Portal` },
        { property: 'og:description', content: description },
        { name: 'twitter:card', content: 'summary' },
        { name: 'robots', content: 'index,follow' },
      ],
      links: [
        {
          rel: 'canonical',
          href: `/project/${loaderData?.projectId ?? ''}`,
        },
      ],
    }
  },
  component: PortalProjectEntry,
})

function buildPortalEntryUrl(
  basePath: string,
  projectId: string,
  portalHost: string,
): string {
  const params = new URLSearchParams({
    mode: 'portal',
    portal: '1',
    project: projectId,
  })
  if (portalHost) params.set('portalHost', portalHost)
  return `${basePath}?${params.toString()}`
}

function PortalProjectEntry() {
  const { entry, projectId } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  if (!entry) {
    return (
      <ProjectUnavailable
        projectId={projectId}
        onRetry={() => {
          getPortalRegistry(true)
          void navigate({
            to: '/project/$projectId',
            params: { projectId },
            replace: true,
          })
        }}
      />
    )
  }

  const installed = ensureProjectsRegistered().some((p) => p.id === entry.id)
  if (installed || entry.local) {
    const portalHost =
      typeof window !== 'undefined' ? window.location.origin : ''
    throw redirect({
      href: buildPortalEntryUrl(entry.basePath, entry.id, portalHost),
    })
  }

  if (entry.host && typeof window !== 'undefined') {
    const target = new URL(entry.host)
    target.searchParams.set('mode', 'portal')
    target.searchParams.set('portal', '1')
    target.searchParams.set('project', entry.id)
    target.searchParams.set('portalHost', window.location.origin)
    window.location.assign(target.toString())
    return (
      <div className="p-8 text-sm text-slate-400">Opening remote project…</div>
    )
  }

  return (
    <ProjectUnavailable
      projectId={projectId}
      onRetry={() => {
        getPortalRegistry(true)
        void navigate({
          to: '/project/$projectId',
          params: { projectId },
          replace: true,
        })
      }}
    />
  )
}

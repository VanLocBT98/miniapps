import { Link } from '@tanstack/react-router'
import { Button, Card } from '@repo/ui'
import {
  portalProjectPath,
  projectPrefetchUrls,
  type ProjectRegistryEntry,
} from '@repo/shared/registry'

function prefetchProject(entry: ProjectRegistryEntry) {
  if (typeof document === 'undefined') return
  for (const href of projectPrefetchUrls(entry)) {
    const existing = document.head.querySelector(
      `link[data-portal-prefetch="${href}"]`,
    )
    if (existing) continue
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    link.setAttribute('data-portal-prefetch', href)
    document.head.appendChild(link)
  }
  // Warm local portal entry as well
  const portalHref = portalProjectPath(entry.id)
  const local = document.createElement('link')
  local.rel = 'prefetch'
  local.href = portalHref
  local.setAttribute('data-portal-prefetch', portalHref)
  if (!document.head.querySelector(`link[data-portal-prefetch="${portalHref}"]`)) {
    document.head.appendChild(local)
  }
}

export function ProjectRegistryCards({
  projects,
}: {
  projects: ProjectRegistryEntry[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <Card
          key={project.id}
          title={project.name}
          description={project.description || undefined}
          className="flex flex-col gap-4"
        >
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Link
              to="/project/$projectId"
              params={{ projectId: project.id }}
              onMouseEnter={() => prefetchProject(project)}
              onFocus={() => prefetchProject(project)}
            >
              <Button size="sm">Open</Button>
            </Link>
            {project.host ? (
              <a
                href={`${project.host}/?mode=portal&portalHost=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&project=${project.id}`}
                className="text-xs text-slate-500 underline-offset-2 hover:text-sky-400 hover:underline"
                onMouseEnter={() => prefetchProject(project)}
              >
                Remote host
              </a>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  )
}

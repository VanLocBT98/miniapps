import { lazy, Suspense, type ComponentType } from 'react'
import { Loading } from '@repo/ui'
import { getProjectById } from '@repo/shared/project'
import { ProjectPage } from '~/components/ProjectPage'
import { ensureProjectsRegistered } from '~/projects/installed'

export function createLazyRouteComponent(projectId: string, pageId: string) {
  ensureProjectsRegistered()
  const project = getProjectById(projectId)
  if (!project) {
    throw new Error(`Unknown project: ${projectId}`)
  }
  const page = project.pages.find((item) => item.id === pageId)
  if (!page) {
    throw new Error(`Unknown page ${pageId} in project ${projectId}`)
  }

  const LazyPage = lazy(async () => {
    const mod = await page.component()
    return { default: mod.default as ComponentType }
  })

  return function LazyProjectRoutePage() {
    return (
      <ProjectPage
        project={project}
        Page={() => (
          <Suspense fallback={<Loading />}>
            <LazyPage />
          </Suspense>
        )}
      />
    )
  }
}

import { Suspense, type ComponentType } from 'react'
import { Loading } from '@repo/ui'
import type { MiniProjectDefinition } from '@repo/shared/project'

export function ProjectPage({
  project,
  Page,
}: {
  project: MiniProjectDefinition
  Page: ComponentType
}) {
  const Providers = project.Providers
  const Layout = project.Layout
  let content = (
    <Suspense fallback={<Loading label={`Loading ${project.name}…`} />}>
      <Page />
    </Suspense>
  )
  if (Layout) {
    content = <Layout>{content}</Layout>
  }
  if (Providers) {
    content = <Providers>{content}</Providers>
  }
  return content
}

import { Suspense, lazy, type ComponentType } from 'react'
import { Loading } from '@repo/ui'
import { getProjectById } from '@repo/shared/project'
import { ProjectPage } from '~/components/ProjectPage'
import { ensureProjectsRegistered } from '~/projects/installed'

/** Bind a booking project page that expects `{ bookingId }`. */
export function createBookingScopedPage(pageId: string, bookingId: string) {
  ensureProjectsRegistered()
  const project = getProjectById('booking')
  if (!project) throw new Error('Unknown project: booking')
  const page = project.pages.find((item) => item.id === pageId)
  if (!page) throw new Error(`Unknown page ${pageId} in booking`)

  const LazyPage = lazy(async () => {
    const mod = await page.component()
    const Page = mod.default as ComponentType<{ bookingId: string }>
    return {
      default: function Bound() {
        return <Page bookingId={bookingId} />
      },
    }
  })

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

/**
 * Tab content only (no ProjectPage / shell).
 * Parent `/booking/$bookingId` layout owns providers + detail shell + tabs.
 */
export function createBookingTabContent(pageId: string, bookingId: string) {
  ensureProjectsRegistered()
  const project = getProjectById('booking')
  if (!project) throw new Error('Unknown project: booking')
  const page = project.pages.find((item) => item.id === pageId)
  if (!page) throw new Error(`Unknown page ${pageId} in booking`)

  const LazyPage = lazy(async () => {
    const mod = await page.component()
    const Page = mod.default as ComponentType<{ bookingId: string }>
    return {
      default: function Bound() {
        return <Page bookingId={bookingId} />
      },
    }
  })

  return (
    <Suspense fallback={<Loading label="Loading tab…" />}>
      <LazyPage />
    </Suspense>
  )
}

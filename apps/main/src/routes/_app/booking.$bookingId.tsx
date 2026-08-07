import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Loading } from '@repo/ui'
import { bookingDetailQueryOptions } from '@repo/booking/apis'
import { bookingTabFromPathname } from '@repo/booking/constants'
import { getProjectById } from '@repo/shared/project'
import { ProjectPage } from '~/components/ProjectPage'
import { BookingDetailShell } from '~/lib/booking-detail-shell'
import { bookingDetailHead } from '~/lib/booking-seo'
import { ensureProjectsRegistered } from '~/projects/installed'

/**
 * Shared chrome for all booking detail tabs: header + tab nav + `<Outlet />` content.
 */
export const Route = createFileRoute('/_app/booking/$bookingId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      bookingDetailQueryOptions(params.bookingId),
    ),
  head: ({ loaderData }) => bookingDetailHead(loaderData),
  component: BookingDetailLayoutRoute,
})

function BookingDetailLayoutRoute() {
  const { bookingId } = Route.useParams()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const active = bookingTabFromPathname(pathname)

  ensureProjectsRegistered()
  const project = getProjectById('booking')
  if (!project) throw new Error('Unknown project: booking')

  return (
    <ProjectPage
      project={project}
      Page={() => (
        <Suspense fallback={<Loading label="Loading booking…" />}>
          <BookingDetailShell bookingId={bookingId} active={active}>
            <Outlet />
          </BookingDetailShell>
        </Suspense>
      )}
    />
  )
}

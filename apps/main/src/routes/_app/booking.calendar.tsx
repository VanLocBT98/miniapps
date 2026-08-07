import { createFileRoute, redirect } from '@tanstack/react-router'
import { bookingsQueryOptions } from '@repo/booking/apis'
import { ENABLE_LEGACY_CALENDAR } from '@repo/booking/constants'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/booking/calendar')({
  beforeLoad: () => {
    if (!ENABLE_LEGACY_CALENDAR) {
      throw redirect({ to: '/booking' })
    }
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(bookingsQueryOptions),
  component: createLazyRouteComponent('booking', 'calendar'),
})

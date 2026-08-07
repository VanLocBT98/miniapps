import { createFileRoute } from '@tanstack/react-router'
import { bookingsQueryOptions } from '@repo/booking/apis'
import { bookingListHead } from '~/lib/booking-seo'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/booking/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(bookingsQueryOptions),
  head: () => bookingListHead(),
  component: createLazyRouteComponent('booking', 'list'),
})

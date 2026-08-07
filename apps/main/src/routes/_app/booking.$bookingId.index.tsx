import { createFileRoute } from '@tanstack/react-router'
import { bookingDetailQueryOptions } from '@repo/booking/apis'
import { createBookingTabContent } from '~/lib/bound-booking-page'
import { bookingDetailHead } from '~/lib/booking-seo'

export const Route = createFileRoute('/_app/booking/$bookingId/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      bookingDetailQueryOptions(params.bookingId),
    ),
  head: ({ loaderData }) => bookingDetailHead(loaderData),
  component: function BookingDetailIndexRoute() {
    const { bookingId } = Route.useParams()
    return createBookingTabContent('detail', bookingId)
  },
})

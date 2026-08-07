import { createFileRoute } from '@tanstack/react-router'
import {
  bookingDetailQueryOptions,
  bookingFlightsQueryOptions,
} from '@repo/booking/apis'
import { createBookingTabContent } from '~/lib/bound-booking-page'
import { bookingDetailHead } from '~/lib/booking-seo'

export const Route = createFileRoute('/_app/booking/$bookingId/flights')({
  loader: async ({ context, params }) => {
    const [booking] = await Promise.all([
      context.queryClient.ensureQueryData(
        bookingDetailQueryOptions(params.bookingId),
      ),
      context.queryClient.ensureQueryData(
        bookingFlightsQueryOptions(params.bookingId),
      ),
    ])
    return booking
  },
  head: ({ loaderData }) => bookingDetailHead(loaderData),
  component: function FlightsRoute() {
    const { bookingId } = Route.useParams()
    return createBookingTabContent('flights', bookingId)
  },
})

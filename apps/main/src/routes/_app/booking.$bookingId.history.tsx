import { createFileRoute } from '@tanstack/react-router'
import {
  bookingDetailQueryOptions,
  bookingHistoryQueryOptions,
  bookingTimelineQueryOptions,
} from '@repo/booking/apis'
import { createBookingTabContent } from '~/lib/bound-booking-page'
import { bookingDetailHead } from '~/lib/booking-seo'

export const Route = createFileRoute('/_app/booking/$bookingId/history')({
  loader: async ({ context, params }) => {
    const [booking] = await Promise.all([
      context.queryClient.ensureQueryData(
        bookingDetailQueryOptions(params.bookingId),
      ),
      context.queryClient.ensureQueryData(
        bookingHistoryQueryOptions(params.bookingId),
      ),
      context.queryClient.ensureQueryData(
        bookingTimelineQueryOptions(params.bookingId),
      ),
    ])
    return booking
  },
  head: ({ loaderData }) => bookingDetailHead(loaderData),
  component: function HistoryRoute() {
    const { bookingId } = Route.useParams()
    return createBookingTabContent('history', bookingId)
  },
})

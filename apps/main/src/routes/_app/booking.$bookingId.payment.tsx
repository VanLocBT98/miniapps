import { createFileRoute } from '@tanstack/react-router'
import {
  bookingDetailQueryOptions,
  bookingPaymentQueryOptions,
} from '@repo/booking/apis'
import { createBookingTabContent } from '~/lib/bound-booking-page'
import { bookingDetailHead } from '~/lib/booking-seo'

export const Route = createFileRoute('/_app/booking/$bookingId/payment')({
  loader: async ({ context, params }) => {
    const [booking] = await Promise.all([
      context.queryClient.ensureQueryData(
        bookingDetailQueryOptions(params.bookingId),
      ),
      context.queryClient.ensureQueryData(
        bookingPaymentQueryOptions(params.bookingId),
      ),
    ])
    return booking
  },
  head: ({ loaderData }) => bookingDetailHead(loaderData),
  component: function PaymentRoute() {
    const { bookingId } = Route.useParams()
    return createBookingTabContent('payment', bookingId)
  },
})

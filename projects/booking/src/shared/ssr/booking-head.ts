import type { BookingAggregate } from '@/shared/types'

/** Shared SSR `head()` meta for booking detail + nested tabs (09-ssr). */
export function bookingDetailHead(loaderData: unknown) {
  const booking = loaderData as BookingAggregate | undefined
  const title = booking
    ? `${booking.bookingNumber} · ${booking.status} · Booking`
    : 'Booking detail'
  const description = booking
    ? `${booking.bookingNumber} (${booking.status}, ${booking.bookingType}) — passengers ${booking.passengers.length}, flights ${booking.flights.length}`
    : 'Booking detail'

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }
}

/** List route SSR head. */
export function bookingListHead() {
  const title = 'Bookings'
  const description = 'Search and manage airline bookings'
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
    ],
  }
}

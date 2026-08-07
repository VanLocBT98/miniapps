import type { Booking, BookingAggregate } from '@/shared/types'

/** List row: booking header + display helpers. */
export type BookingListItem = Booking & {
  guest: string
  amount: number
  departureTime: string | null
}

export function primaryGuestName(booking: BookingAggregate): string {
  const p = booking.passengers[0]
  return p ? `${p.firstName} ${p.lastName}` : booking.bookingNumber
}

/** Map aggregate → list DTO (UI table rows). */
export function toBookingListItem(booking: BookingAggregate): BookingListItem {
  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    bookingType: booking.bookingType,
    createdDate: booking.createdDate,
    updatedDate: booking.updatedDate,
    guest: primaryGuestName(booking),
    amount: booking.payment?.amount ?? 0,
    departureTime: booking.flights[0]?.departureTime ?? null,
  }
}

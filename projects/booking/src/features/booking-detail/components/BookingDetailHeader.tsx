import { Link } from '@tanstack/react-router'
import { formatDate } from '@repo/shared/utils'
import { BookingStatus } from '@/components/molecules/booking-cards'
import { isBookingReadOnly } from '@/shared/domain'
import type { BookingAggregate } from '@/shared/types'

export function BookingDetailHeader({ booking }: { booking: BookingAggregate }) {
  const readOnly = isBookingReadOnly(booking.status)
  const guest = booking.passengers[0]
    ? `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`
    : null

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/booking"
          className="text-sm text-sky-400 hover:underline"
        >
          ← Back to bookings
        </Link>
        {readOnly ? (
          <span className="rounded-md border border-amber-700/60 bg-amber-950/50 px-2.5 py-1 text-xs font-medium text-amber-200">
            Read-only · {booking.status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          {booking.bookingNumber}
        </h1>
        <BookingStatus status={booking.status} />
      </div>
      <p className="text-sm text-slate-400">
        {guest ? (
          <>
            <span className="text-slate-200">{guest}</span>
            <span className="mx-2 text-slate-600">·</span>
          </>
        ) : null}
        <span className="capitalize">{booking.bookingType}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>{booking.id}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Updated {formatDate(booking.updatedDate)}</span>
      </p>
    </header>
  )
}

import { Card } from '@repo/ui'
import { formatCurrency, formatDate } from '@repo/shared/utils'
import type { BookingAggregate } from '@/shared/types'

export function BookingDetailSummaryCard({
  booking,
}: {
  booking: BookingAggregate
}) {
  const guest = booking.passengers[0]
    ? `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`
    : booking.bookingNumber

  return (
    <Card title="Summary" description={guest}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Passengers
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {booking.passengers.length}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Flights
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {booking.flights.length}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Payment
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {booking.payment
              ? formatCurrency(booking.payment.amount)
              : '—'}
          </dd>
          {booking.payment ? (
            <p className="mt-1 text-xs text-slate-400">
              {booking.payment.paymentStatus} · {booking.payment.currency}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">No payment yet</p>
          )}
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            Created
          </dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">
            {formatDate(booking.createdDate)}
          </dd>
          <p className="mt-1 text-xs text-slate-400">
            Updated {formatDate(booking.updatedDate)}
          </p>
        </div>
      </dl>
    </Card>
  )
}

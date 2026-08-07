import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import { BookingStatus } from '@/components/molecules'
import { bookingsQueryOptions } from '@/shared/services/apis/apis'

export default function CalendarPage() {
  const { data } = useSuspenseQuery(bookingsQueryOptions)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Calendar (legacy)</h1>
      <div className="grid gap-3">
        {data.map((booking) => (
          <Card
            key={booking.id}
            title={booking.guest}
            description={booking.bookingNumber}
          >
            <div className="flex items-center justify-between gap-2 text-sm text-slate-300">
              <span>
                {booking.departureTime
                  ? formatDate(booking.departureTime)
                  : 'No flight'}
              </span>
              <BookingStatus status={booking.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

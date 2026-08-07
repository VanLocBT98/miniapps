import { Card } from '@repo/ui'
import { isBookingReadOnly } from '@/shared/domain'
import type { BookingStatus } from '@/shared/types'

export function BookingReadOnlyBanner({ status }: { status: BookingStatus }) {
  if (!isBookingReadOnly(status)) return null
  return (
    <Card
      title={`${status} booking`}
      description={
        status === 'Cancelled'
          ? 'Cancelled bookings cannot be edited.'
          : 'Completed bookings are read-only.'
      }
      className="border-amber-800/50 bg-amber-950/20"
    />
  )
}

import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { BookingDetailSummaryCard } from '@/features/booking-detail'
import { BookingTimeline } from '@/features/timeline'
import { bookingDetailQueryOptions } from '@/shared/services/apis/apis'

/** Overview tab content (shell provided by detail layout). */
export default function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const { data } = useSuspenseQuery(bookingDetailQueryOptions(bookingId))

  return (
    <div className="space-y-4">
      <BookingDetailSummaryCard booking={data} />
      <Card
        title="Recent timeline"
        description="Full history is under the History tab."
      >
        <BookingTimeline events={data.timeline.slice(-5)} />
      </Card>
    </div>
  )
}

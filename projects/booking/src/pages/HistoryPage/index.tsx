import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { HistoryTable } from '@/features/history'
import { BookingTimeline } from '@/features/timeline'
import {
  bookingHistoryQueryOptions,
  bookingTimelineQueryOptions,
} from '@/shared/services/apis/apis'

export default function HistoryPage({ bookingId }: { bookingId: string }) {
  const { data: history } = useSuspenseQuery(bookingHistoryQueryOptions(bookingId))
  const { data: timeline } = useSuspenseQuery(
    bookingTimelineQueryOptions(bookingId),
  )

  return (
    <div className="space-y-6">
      <Card
        title="Timeline"
        description="Visual trail of booking events (synced with history on each update)."
      >
        <BookingTimeline events={timeline} />
      </Card>

      <HistoryTable entries={history} />
    </div>
  )
}

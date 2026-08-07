import { formatDate } from '@repo/shared/utils'
import { TimelineCard } from '@/components/molecules/booking-cards'
import type { TimelineEvent } from '@/shared/types'

/** Vertical timeline (newest first). */
export function BookingTimeline({
  events,
  emptyMessage = 'No timeline events yet.',
}: {
  events: TimelineEvent[]
  emptyMessage?: string
}) {
  const ordered = [...events].sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  )

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-slate-400">{emptyMessage}</p>
    )
  }

  return (
    <ol className="relative space-y-0 border-l border-slate-700 pl-6">
      {ordered.map((event, index) => (
        <li key={event.id} className="relative pb-6 last:pb-0">
          <span
            className="absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full border-2 border-sky-500 bg-slate-950"
            aria-hidden
          />
          <TimelineCard title={event.action}>
            <p className="text-sm text-slate-300">{event.user}</p>
            <p className="text-sm text-slate-400">
              {formatDate(event.createdDate)}
            </p>
            {index === 0 ? (
              <p className="mt-1 text-xs uppercase tracking-wide text-sky-400">
                Latest
              </p>
            ) : null}
          </TimelineCard>
        </li>
      ))}
    </ol>
  )
}

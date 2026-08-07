import { Link } from '@tanstack/react-router'
import { cn } from '@repo/ui'
import { bookingDetailTabs } from '@/shared/constants'
import type { BookingDetailTabId } from '@/shared/stores/ui.store'

export function BookingDetailTabs({
  bookingId,
  active,
}: {
  bookingId: string
  active: BookingDetailTabId
}) {
  return (
    <nav
      className="flex flex-wrap gap-1 border-b border-slate-800 pb-2"
      aria-label="Booking sections"
    >
      {bookingDetailTabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <Link
            key={tab.id}
            to={tab.to}
            params={{ bookingId }}
            activeOptions={{ exact: tab.id === 'overview' }}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sky-950 text-sky-200'
                : 'text-slate-300 hover:bg-slate-900',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

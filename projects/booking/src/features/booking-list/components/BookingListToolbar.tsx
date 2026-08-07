import { Link } from '@tanstack/react-router'
import { Button } from '@repo/ui'
import { useUiStore } from '@/shared/stores/ui.store'

export function BookingListToolbar({ total }: { total: number }) {
  const filtersOpen = useUiStore((s) => s.filtersOpen)
  const setFiltersOpen = useUiStore((s) => s.setFiltersOpen)
  const resetFilters = useUiStore((s) => s.resetFilters)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Bookings</h1>
        <p className="text-sm text-slate-400">{total} result{total === 1 ? '' : 's'}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {filtersOpen ? 'Hide filters' : 'Advanced filters'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => resetFilters()}>
          Clear
        </Button>
        <Link to="/booking/new">
          <Button size="sm">New booking</Button>
        </Link>
      </div>
    </div>
  )
}

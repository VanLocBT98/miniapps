import { Button, Card } from '@repo/ui'
import { useUiStore } from '@/shared/stores/ui.store'
import { bookingStatusSchema, bookingTypeSchema } from '@/shared/types'

export function BookingAdvancedFilters() {
  const open = useUiStore((s) => s.filtersOpen)
  const draft = useUiStore((s) => s.draftFilters)
  const setDraftFilters = useUiStore((s) => s.setDraftFilters)
  const applyFilters = useUiStore((s) => s.applyFilters)
  const resetFilters = useUiStore((s) => s.resetFilters)

  if (!open) return null

  return (
    <Card title="Advanced filters" description="Draft in Zustand — Apply updates the list query.">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          applyFilters()
        }}
      >
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Status</span>
          <select
            className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={draft.status}
            onChange={(e) => setDraftFilters({ status: e.target.value })}
          >
            <option value="">All</option>
            {bookingStatusSchema.options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Type</span>
          <select
            className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={draft.bookingType}
            onChange={(e) => setDraftFilters({ bookingType: e.target.value })}
          >
            <option value="">All</option>
            {bookingTypeSchema.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" size="sm">
          Apply filters
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => resetFilters()}>
          Reset
        </Button>
      </form>
    </Card>
  )
}

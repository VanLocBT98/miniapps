import { Button, Card } from '@repo/ui'
import {
  customerSourceSchema,
  customerStatusSchema,
  customerTypeSchema,
} from '@/shared/types'
import { useCustomerListStore } from '../store'

export function CustomerAdvancedFilters() {
  const open = useCustomerListStore((s) => s.filtersOpen)
  const draft = useCustomerListStore((s) => s.draftFilters)
  const setDraftFilters = useCustomerListStore((s) => s.setDraftFilters)
  const applyFilters = useCustomerListStore((s) => s.applyFilters)
  const resetFilters = useCustomerListStore((s) => s.resetFilters)

  if (!open) return null

  return (
    <Card
      title="Advanced filters"
      description="Draft in Zustand — Apply updates the list query."
    >
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
            {customerStatusSchema.options.map((status) => (
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
            value={draft.customerType}
            onChange={(e) => setDraftFilters({ customerType: e.target.value })}
          >
            <option value="">All</option>
            {customerTypeSchema.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-400">Source</span>
          <select
            className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={draft.source}
            onChange={(e) => setDraftFilters({ source: e.target.value })}
          >
            <option value="">All</option>
            {customerSourceSchema.options.map((source) => (
              <option key={source} value={source}>
                {source}
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

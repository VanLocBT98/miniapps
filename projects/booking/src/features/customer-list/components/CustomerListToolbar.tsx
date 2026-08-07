import { Link } from '@tanstack/react-router'
import { Button } from '@repo/ui'
import { useCustomerListStore } from '../store'

export function CustomerListToolbar({ total }: { total: number }) {
  const filtersOpen = useCustomerListStore((s) => s.filtersOpen)
  const setFiltersOpen = useCustomerListStore((s) => s.setFiltersOpen)
  const resetFilters = useCustomerListStore((s) => s.resetFilters)
  const selectedIds = useCustomerListStore((s) => s.selectedIds)
  const clearSelection = useCustomerListStore((s) => s.clearSelection)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Customers</h1>
        <p className="text-sm text-slate-400">
          {total} result{total === 1 ? '' : 's'}
          {selectedIds.length > 0
            ? ` · ${selectedIds.length} selected (bulk stub)`
            : ''}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selectedIds.length > 0 ? (
          <Button type="button" size="sm" variant="ghost" onClick={clearSelection}>
            Clear selection
          </Button>
        ) : null}
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
        <Link to="/customer/new">
          <Button size="sm">New customer</Button>
        </Link>
      </div>
    </div>
  )
}

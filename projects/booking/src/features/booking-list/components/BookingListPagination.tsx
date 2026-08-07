import { Button } from '@repo/ui'
import { useUiStore } from '@/shared/stores/ui.store'

const PAGE_SIZES = [5, 10, 20] as const

export function BookingListPagination({ total }: { total: number }) {
  const page = useUiStore((s) => s.listPage)
  const pageSize = useUiStore((s) => s.listPageSize)
  const setListPage = useUiStore((s) => s.setListPage)
  const setListPageSize = useUiStore((s) => s.setListPageSize)

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(total, safePage * pageSize)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
      <p>
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span>Rows</span>
          <select
            className="h-9 rounded-md border border-slate-700 bg-slate-950 px-2 text-slate-100"
            value={pageSize}
            onChange={(e) => setListPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={safePage <= 1}
          onClick={() => setListPage(safePage - 1)}
        >
          Previous
        </Button>
        <span className="min-w-[5rem] text-center text-slate-300">
          Page {safePage} / {pageCount}
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={safePage >= pageCount}
          onClick={() => setListPage(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

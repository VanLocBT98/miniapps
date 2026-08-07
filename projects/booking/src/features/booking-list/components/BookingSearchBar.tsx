import { Input } from '@repo/ui'
import { useUiStore } from '@/shared/stores/ui.store'

/** Primary search bar — updates draft filter; Apply commits to Query. */
export function BookingSearchBar() {
  const q = useUiStore((s) => s.draftFilters.q)
  const setDraftFilters = useUiStore((s) => s.setDraftFilters)
  const applyFilters = useUiStore((s) => s.applyFilters)

  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        applyFilters()
      }}
      role="search"
    >
      <Input
        className="min-w-[16rem] flex-1"
        value={q}
        onChange={(e) => setDraftFilters({ q: e.target.value })}
        placeholder="Search booking #, guest, or id…"
        aria-label="Search bookings"
      />
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-500"
      >
        Search
      </button>
    </form>
  )
}

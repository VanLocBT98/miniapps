import { Input } from '@repo/ui'
import { useCustomerListStore } from '../store'

export function CustomerSearchBar() {
  const q = useCustomerListStore((s) => s.draftFilters.q)
  const setDraftFilters = useCustomerListStore((s) => s.setDraftFilters)
  const applyFilters = useCustomerListStore((s) => s.applyFilters)

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
        placeholder="Search code, name, phone, email, passport…"
        aria-label="Search customers"
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

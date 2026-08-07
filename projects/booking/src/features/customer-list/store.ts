import { create } from 'zustand'
import type { Customer } from '@/shared/types'

export type CustomerListFilterDraft = {
  q: string
  status: string
  customerType: string
  source: string
}

export type CustomerSortBy =
  | 'customerCode'
  | 'fullName'
  | 'createdDate'
  | 'status'
  | 'owner'
  | 'source'

type CustomerListUiState = {
  draftFilters: CustomerListFilterDraft
  appliedFilters: CustomerListFilterDraft
  filtersOpen: boolean
  listPage: number
  listPageSize: number
  sortBy: CustomerSortBy
  sortDir: 'asc' | 'desc'
  selectedIds: string[]
  setDraftFilters: (patch: Partial<CustomerListFilterDraft>) => void
  applyFilters: () => void
  resetFilters: () => void
  setFiltersOpen: (open: boolean) => void
  setListPage: (page: number) => void
  setListPageSize: (size: number) => void
  setSort: (sortBy: CustomerSortBy) => void
  toggleSelected: (id: string) => void
  setSelectedIds: (ids: string[]) => void
  clearSelection: () => void
}

const emptyFilters: CustomerListFilterDraft = {
  q: '',
  status: '',
  customerType: '',
  source: '',
}

export const useCustomerListStore = create<CustomerListUiState>((set) => ({
  draftFilters: { ...emptyFilters },
  appliedFilters: { ...emptyFilters },
  filtersOpen: false,
  listPage: 1,
  listPageSize: 10,
  sortBy: 'createdDate',
  sortDir: 'desc',
  selectedIds: [],
  setDraftFilters: (patch) =>
    set((s) => ({ draftFilters: { ...s.draftFilters, ...patch } })),
  applyFilters: () =>
    set((s) => ({
      appliedFilters: { ...s.draftFilters },
      listPage: 1,
      selectedIds: [],
    })),
  resetFilters: () =>
    set({
      draftFilters: { ...emptyFilters },
      appliedFilters: { ...emptyFilters },
      listPage: 1,
      selectedIds: [],
    }),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
  setListPage: (page) => set({ listPage: Math.max(1, page) }),
  setListPageSize: (size) => set({ listPageSize: size, listPage: 1 }),
  setSort: (sortBy) =>
    set((s) => ({
      sortBy,
      sortDir: s.sortBy === sortBy && s.sortDir === 'asc' ? 'desc' : 'asc',
      listPage: 1,
    })),
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}))

export function sortCustomers(
  rows: Customer[],
  sortBy: CustomerSortBy,
  sortDir: 'asc' | 'desc',
): Customer[] {
  const dir = sortDir === 'desc' ? -1 : 1
  return [...rows].sort((a, b) => {
    const av = a[sortBy]
    const bv = b[sortBy]
    const aStr = av == null ? '' : String(av)
    const bStr = bv == null ? '' : String(bv)
    return aStr.localeCompare(bStr) * dir
  })
}

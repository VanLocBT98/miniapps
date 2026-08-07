import { create } from 'zustand'
import type { BookingDetailTabId } from '@/shared/constants'

export type { BookingDetailTabId }

export type BookingListFilterDraft = {
  q: string
  status: string
  bookingType: string
}

type UiState = {
  sidebarOpen: boolean
  draftFilters: BookingListFilterDraft
  appliedFilters: BookingListFilterDraft
  filtersOpen: boolean
  listPage: number
  listPageSize: number
  selectedTab: BookingDetailTabId | null
  toggleSidebar: () => void
  setDraftFilters: (patch: Partial<BookingListFilterDraft>) => void
  applyFilters: () => void
  resetFilters: () => void
  setFiltersOpen: (open: boolean) => void
  setListPage: (page: number) => void
  setListPageSize: (size: number) => void
  setSelectedTab: (tab: BookingDetailTabId | null) => void
}

const emptyFilters: BookingListFilterDraft = {
  q: '',
  status: '',
  bookingType: '',
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  draftFilters: { ...emptyFilters },
  appliedFilters: { ...emptyFilters },
  filtersOpen: false,
  listPage: 1,
  listPageSize: 10,
  selectedTab: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setDraftFilters: (patch) =>
    set((s) => ({ draftFilters: { ...s.draftFilters, ...patch } })),
  applyFilters: () =>
    set((s) => ({
      appliedFilters: { ...s.draftFilters },
      listPage: 1,
    })),
  resetFilters: () =>
    set({
      draftFilters: { ...emptyFilters },
      appliedFilters: { ...emptyFilters },
      listPage: 1,
    }),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
  setListPage: (page) => set({ listPage: Math.max(1, page) }),
  setListPageSize: (size) =>
    set({ listPageSize: size, listPage: 1 }),
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}))

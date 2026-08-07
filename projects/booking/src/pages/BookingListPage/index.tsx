import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Button, EmptyState } from '@repo/ui'
import {
  BookingAdvancedFilters,
  BookingListPagination,
  BookingListTable,
  BookingListToolbar,
  BookingSearchBar,
} from '@/features/booking-list'
import { bookingListQueryOptions } from '@/shared/services/apis/apis'
import { useUiStore } from '@/shared/stores/ui.store'

export default function BookingListPage() {
  const appliedFilters = useUiStore((s) => s.appliedFilters)
  const listPage = useUiStore((s) => s.listPage)
  const listPageSize = useUiStore((s) => s.listPageSize)
  const setListPage = useUiStore((s) => s.setListPage)

  const filters = {
    q: appliedFilters.q || undefined,
    status: appliedFilters.status || undefined,
    bookingType: appliedFilters.bookingType || undefined,
  }
  const { data } = useSuspenseQuery(bookingListQueryOptions(filters))

  const pageCount = Math.max(1, Math.ceil(data.length / listPageSize))
  const safePage = Math.min(listPage, pageCount)

  useEffect(() => {
    if (safePage !== listPage) setListPage(safePage)
  }, [safePage, listPage, setListPage])

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * listPageSize
    return data.slice(start, start + listPageSize)
  }, [data, listPageSize, safePage])

  return (
    <div className="space-y-4">
      <BookingListToolbar total={data.length} />
      <BookingSearchBar />
      <BookingAdvancedFilters />
      {data.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Try another search, clear filters, or create a new booking."
          action={
            <Link to="/booking/new">
              <Button size="sm">New booking</Button>
            </Link>
          }
        />
      ) : (
        <>
          <BookingListTable rows={pageRows} />
          <BookingListPagination total={data.length} />
        </>
      )}
    </div>
  )
}

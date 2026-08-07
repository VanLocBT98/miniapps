import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Button, EmptyState } from '@repo/ui'
import {
  CustomerAdvancedFilters,
  CustomerListPagination,
  CustomerListTable,
  CustomerListToolbar,
  CustomerSearchBar,
  sortCustomers,
  useCustomerListStore,
} from '@/features/customer-list'
import { customerListQueryOptions } from '@/shared/services/apis/apis'

export default function CustomerListPage() {
  const appliedFilters = useCustomerListStore((s) => s.appliedFilters)
  const listPage = useCustomerListStore((s) => s.listPage)
  const listPageSize = useCustomerListStore((s) => s.listPageSize)
  const setListPage = useCustomerListStore((s) => s.setListPage)
  const sortBy = useCustomerListStore((s) => s.sortBy)
  const sortDir = useCustomerListStore((s) => s.sortDir)

  const filters = {
    q: appliedFilters.q || undefined,
    status: appliedFilters.status || undefined,
    customerType: appliedFilters.customerType || undefined,
    source: appliedFilters.source || undefined,
  }
  const { data } = useSuspenseQuery(customerListQueryOptions(filters))

  const sorted = useMemo(
    () => sortCustomers(data, sortBy, sortDir),
    [data, sortBy, sortDir],
  )

  const pageCount = Math.max(1, Math.ceil(sorted.length / listPageSize))
  const safePage = Math.min(listPage, pageCount)

  useEffect(() => {
    if (safePage !== listPage) setListPage(safePage)
  }, [safePage, listPage, setListPage])

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * listPageSize
    return sorted.slice(start, start + listPageSize)
  }, [sorted, listPageSize, safePage])

  return (
    <div className="space-y-4">
      <CustomerListToolbar total={sorted.length} />
      <CustomerSearchBar />
      <CustomerAdvancedFilters />
      {sorted.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try another search, clear filters, or create a new customer."
          action={
            <Link to="/customer/new">
              <Button size="sm">New customer</Button>
            </Link>
          }
        />
      ) : (
        <>
          <CustomerListTable rows={pageRows} />
          <CustomerListPagination total={sorted.length} />
        </>
      )}
    </div>
  )
}

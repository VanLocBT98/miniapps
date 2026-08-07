import { Link, useNavigate } from '@tanstack/react-router'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Button, Card, DataTable } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import { CustomerStatus } from '@/components/molecules'
import type { Customer } from '@/shared/types'
import {
  useCustomerListStore,
  type CustomerSortBy,
} from '../store'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Customer>()

function DetailLink({
  customerId,
  children,
  className,
}: {
  customerId: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      className={className ?? 'font-medium text-sky-400 hover:underline'}
      to="/customer/$customerId"
      params={{ customerId }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  )
}

function SortHeader({
  label,
  sortKey,
}: {
  label: string
  sortKey: CustomerSortBy
}) {
  const sortBy = useCustomerListStore((s) => s.sortBy)
  const sortDir = useCustomerListStore((s) => s.sortDir)
  const setSort = useCustomerListStore((s) => s.setSort)
  const active = sortBy === sortKey
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-medium text-slate-200 hover:text-sky-300"
      onClick={() => setSort(sortKey)}
    >
      {label}
      {active ? (
        <span className="text-xs text-sky-400" aria-hidden>
          {sortDir === 'asc' ? '↑' : '↓'}
        </span>
      ) : null}
    </button>
  )
}

export function CustomerListTable({ rows }: { rows: Customer[] }) {
  const navigate = useNavigate()
  const selectedIds = useCustomerListStore((s) => s.selectedIds)
  const toggleSelected = useCustomerListStore((s) => s.toggleSelected)
  const setSelectedIds = useCustomerListStore((s) => s.setSelectedIds)

  const allSelected =
    rows.length > 0 && rows.every((r) => selectedIds.includes(r.id))

  const columns = helper.columns([
    helper.display({
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          aria-label="Select all on page"
          checked={allSelected}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([
                ...new Set([...selectedIds, ...rows.map((r) => r.id)]),
              ])
            } else {
              const pageIds = new Set(rows.map((r) => r.id))
              setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)))
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      cell: (info) => {
        const id = info.row.original.id
        return (
          <input
            type="checkbox"
            aria-label={`Select ${info.row.original.customerCode}`}
            checked={selectedIds.includes(id)}
            onChange={() => toggleSelected(id)}
            onClick={(e) => e.stopPropagation()}
          />
        )
      },
    }),
    helper.accessor('customerCode', {
      header: () => <SortHeader label="Customer Code" sortKey="customerCode" />,
      cell: (info) => (
        <DetailLink customerId={info.row.original.id}>
          {info.getValue()}
        </DetailLink>
      ),
    }),
    helper.accessor('fullName', {
      header: () => <SortHeader label="Name" sortKey="fullName" />,
      cell: (info) => (
        <DetailLink
          customerId={info.row.original.id}
          className="text-slate-200 hover:text-sky-300 hover:underline"
        >
          {info.getValue()}
        </DetailLink>
      ),
    }),
    helper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue() || '—',
    }),
    helper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue() || '—',
    }),
    helper.accessor('passportNumber', {
      header: 'Passport Number',
      cell: (info) => info.getValue() || '—',
    }),
    helper.accessor('owner', {
      header: () => <SortHeader label="Owner" sortKey="owner" />,
    }),
    helper.accessor('source', {
      header: () => <SortHeader label="Source" sortKey="source" />,
    }),
    helper.accessor('status', {
      header: () => <SortHeader label="Status" sortKey="status" />,
      cell: (info) => <CustomerStatus status={info.getValue()} />,
    }),
    helper.accessor('createdDate', {
      header: () => <SortHeader label="Created Date" sortKey="createdDate" />,
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const id = info.row.original.id
        return (
          <div
            className="flex flex-wrap gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to="/customer/$customerId" params={{ customerId: id }}>
              <Button type="button" size="sm" variant="ghost">
                View
              </Button>
            </Link>
            <Link to="/customer/$customerId/edit" params={{ customerId: id }}>
              <Button type="button" size="sm" variant="ghost">
                Edit
              </Button>
            </Link>
          </div>
        )
      },
    }),
  ])

  const table = useTable({ features, columns, data: rows })

  return (
    <Card className="overflow-hidden p-0">
      <DataTable
        className="rounded-none border-0"
        emptyMessage="No customers match your search or filters."
        headerGroups={table.getHeaderGroups().map((group) => ({
          id: group.id,
          headers: group.headers.map((header) => ({
            id: header.id,
            isPlaceholder: header.isPlaceholder,
            colSpan: header.colSpan,
            render: () =>
              header.isPlaceholder ? null : (
                <table.FlexRender header={header} />
              ),
          })),
        }))}
        rows={table.getRowModel().rows.map((row) => ({
          id: row.id,
          onClick: () => {
            void navigate({
              to: '/customer/$customerId',
              params: { customerId: row.original.id },
            })
          },
          cells: row.getAllCells().map((cell) => ({
            id: cell.id,
            render: () => <table.FlexRender cell={cell} />,
          })),
        }))}
      />
    </Card>
  )
}

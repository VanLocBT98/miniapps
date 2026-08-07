import { Link, useNavigate } from '@tanstack/react-router'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Button, Card, DataTable } from '@repo/ui'
import { formatCurrency, formatDate } from '@repo/shared/utils'
import { BookingStatus } from '@/components/molecules'
import type { BookingListItem } from '@/shared/services/apis/apis'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, BookingListItem>()

function DetailLink({
  bookingId,
  children,
  className,
}: {
  bookingId: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      className={className ?? 'font-medium text-sky-400 hover:underline'}
      to="/booking/$bookingId/"
      params={{ bookingId }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  )
}

export function BookingListTable({ rows }: { rows: BookingListItem[] }) {
  const navigate = useNavigate()

  const columns = helper.columns([
    helper.accessor('bookingNumber', {
      header: 'Booking #',
      cell: (info) => (
        <DetailLink bookingId={info.row.original.id}>
          {info.getValue()}
        </DetailLink>
      ),
    }),
    helper.accessor('guest', {
      header: 'Guest',
      cell: (info) => (
        <DetailLink
          bookingId={info.row.original.id}
          className="text-slate-200 hover:text-sky-300 hover:underline"
        >
          {info.getValue()}
        </DetailLink>
      ),
    }),
    helper.accessor('bookingType', {
      header: 'Type',
      cell: (info) => (
        <span className="capitalize text-slate-300">{info.getValue()}</span>
      ),
    }),
    helper.accessor('status', {
      header: 'Status',
      cell: (info) => <BookingStatus status={info.getValue()} />,
    }),
    helper.accessor('departureTime', {
      header: 'Departure',
      cell: (info) => {
        const v = info.getValue()
        return v ? formatDate(v) : '—'
      },
    }),
    helper.accessor('amount', {
      header: 'Amount',
      cell: (info) => formatCurrency(info.getValue()),
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
            <Link to="/booking/$bookingId/" params={{ bookingId: id }}>
              <Button type="button" size="sm" variant="ghost">
                View
              </Button>
            </Link>
            <Link
              to="/booking/$bookingId/passengers"
              params={{ bookingId: id }}
            >
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
        emptyMessage="No bookings match your search or filters."
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
              to: '/booking/$bookingId/',
              params: { bookingId: row.original.id },
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

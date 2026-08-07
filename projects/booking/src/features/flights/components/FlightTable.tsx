import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Button, DataTable } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import type { Flight } from '@/shared/types'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Flight>()

export function FlightTable({
  flights,
  readOnly,
  onRemove,
}: {
  flights: Flight[]
  readOnly: boolean
  onRemove: (id: string) => void
}) {
  const columns = helper.columns([
    helper.accessor('airline', { header: 'Airline' }),
    helper.accessor('flightNumber', { header: 'Flight #' }),
    helper.accessor('departureAirport', { header: 'From' }),
    helper.accessor('arrivalAirport', { header: 'To' }),
    helper.accessor('departureTime', {
      header: 'Depart',
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor('arrivalTime', {
      header: 'Arrive',
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.display({
      id: 'actions',
      header: '',
      cell: (info) =>
        readOnly ? null : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-rose-300 hover:text-rose-200"
            onClick={() => onRemove(info.row.original.id)}
          >
            Remove
          </Button>
        ),
    }),
  ])

  const table = useTable({ features, columns, data: flights })

  return (
    <DataTable
      emptyMessage="No flights yet."
      headerGroups={table.getHeaderGroups().map((group) => ({
        id: group.id,
        headers: group.headers.map((header) => ({
          id: header.id,
          isPlaceholder: header.isPlaceholder,
          colSpan: header.colSpan,
          render: () =>
            header.isPlaceholder ? null : <table.FlexRender header={header} />,
        })),
      }))}
      rows={table.getRowModel().rows.map((row) => ({
        id: row.id,
        cells: row.getAllCells().map((cell) => ({
          id: cell.id,
          render: () => <table.FlexRender cell={cell} />,
        })),
      }))}
    />
  )
}

import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Button, DataTable } from '@repo/ui'
import type { Passenger } from '@/shared/types'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, Passenger>()

export function PassengerTable({
  passengers,
  readOnly,
  onRemove,
}: {
  passengers: Passenger[]
  readOnly: boolean
  onRemove: (id: string) => void
}) {
  const columns = helper.columns([
    helper.accessor('firstName', { header: 'First name' }),
    helper.accessor('lastName', { header: 'Last name' }),
    helper.accessor('gender', { header: 'Gender' }),
    helper.accessor('birthday', { header: 'Birthday' }),
    helper.accessor('passportNumber', {
      header: 'Passport',
      cell: (info) => info.getValue() || '—',
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

  const table = useTable({ features, columns, data: passengers })

  return (
    <DataTable
      emptyMessage="No passengers yet."
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

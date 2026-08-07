import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Card, DataTable } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import type { HistoryEntry } from '@/shared/types'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, HistoryEntry>()

export function HistoryTable({ entries }: { entries: HistoryEntry[] }) {
  const ordered = [...entries].sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  )

  const columns = helper.columns([
    helper.accessor('createdDate', {
      header: 'When',
      cell: (info) => formatDate(info.getValue()),
    }),
    helper.accessor('action', { header: 'Action' }),
    helper.accessor('user', { header: 'User' }),
  ])

  const table = useTable({ features, columns, data: ordered })

  return (
    <Card
      title="History log"
      description="Every mock mutation appends an entry (rule 9)."
    >
      <DataTable
        emptyMessage="No history yet."
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
          cells: row.getAllCells().map((cell) => ({
            id: cell.id,
            render: () => <table.FlexRender cell={cell} />,
          })),
        }))}
      />
    </Card>
  )
}

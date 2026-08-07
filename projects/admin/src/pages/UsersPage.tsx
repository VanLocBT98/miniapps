import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { Card, DataTable } from '@repo/ui'
import { usersQueryOptions, type AdminUser } from '@/shared/services/apis/apis'

const features = tableFeatures({})
const helper = createColumnHelper<typeof features, AdminUser>()
const columns = helper.columns([
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('email', { header: 'Email' }),
  helper.accessor('role', { header: 'Role' }),
])

export default function UsersPage() {
  const { data } = useSuspenseQuery(usersQueryOptions)
  const table = useTable({ features, columns, data })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Users</h1>
      <Card>
        <DataTable
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
      </Card>
    </div>
  )
}

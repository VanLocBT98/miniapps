import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type HeaderGroup = {
  id: string
  headers: Array<{
    id: string
    isPlaceholder: boolean
    colSpan: number
    render: () => ReactNode
  }>
}

type Row = {
  id: string
  cells: Array<{
    id: string
    render: () => ReactNode
  }>
  onClick?: () => void
}

export type DataTableProps = {
  headerGroups: HeaderGroup[]
  rows: Row[]
  className?: string
  emptyMessage?: string
}

export function DataTable({
  headerGroups,
  rows,
  className,
  emptyMessage = 'No rows',
}: DataTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto overscroll-x-contain rounded-lg border border-slate-800',
        className,
      )}
    >
      <table className="w-max min-w-full border-collapse text-left text-sm text-slate-200">
        <thead className="bg-slate-900/90">
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="whitespace-nowrap px-4 py-3 font-medium text-slate-300"
                >
                  {header.isPlaceholder ? null : header.render()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                className="whitespace-nowrap px-4 py-6 text-slate-500"
                colSpan={headerGroups[0]?.headers.length ?? 1}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-slate-800/80 hover:bg-slate-900/60',
                  row.onClick && 'cursor-pointer',
                )}
                onClick={row.onClick}
                onKeyDown={
                  row.onClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          row.onClick?.()
                        }
                      }
                    : undefined
                }
                tabIndex={row.onClick ? 0 : undefined}
                role={row.onClick ? 'link' : undefined}
              >
                {row.cells.map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                    {cell.render()}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

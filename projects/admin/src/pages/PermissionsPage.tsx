import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { permissionsQueryOptions } from '@/shared/services/apis/apis'

export default function PermissionsPage() {
  const { data } = useSuspenseQuery(permissionsQueryOptions)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Permissions</h1>
      <Card>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.map((permission) => (
            <li key={permission} className="rounded-md bg-slate-950 px-3 py-2 text-sm text-sky-300">
              {permission}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

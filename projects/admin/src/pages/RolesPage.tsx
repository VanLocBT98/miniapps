import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { rolesQueryOptions } from '@/shared/services/apis/apis'

export default function RolesPage() {
  const { data } = useSuspenseQuery(rolesQueryOptions)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Roles</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((role) => (
          <Card key={role.id} title={role.name} description={role.id}>
            <p className="text-sm text-slate-400">{role.permissions.join(', ')}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

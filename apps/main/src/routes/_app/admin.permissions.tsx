import { createFileRoute } from '@tanstack/react-router'
import { permissionsQueryOptions } from '@repo/admin/apis'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/admin/permissions')({
  loader: ({ context }) => context.queryClient.ensureQueryData(permissionsQueryOptions),
  component: createLazyRouteComponent('admin', 'permissions'),
})

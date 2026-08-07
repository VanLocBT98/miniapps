import { createFileRoute } from '@tanstack/react-router'
import { rolesQueryOptions } from '@repo/admin/apis'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/admin/roles')({
  loader: ({ context }) => context.queryClient.ensureQueryData(rolesQueryOptions),
  component: createLazyRouteComponent('admin', 'roles'),
})

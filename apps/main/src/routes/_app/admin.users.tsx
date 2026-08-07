import { createFileRoute } from '@tanstack/react-router'
import { usersQueryOptions } from '@repo/admin/apis'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/admin/users')({
  loader: ({ context }) => context.queryClient.ensureQueryData(usersQueryOptions),
  component: createLazyRouteComponent('admin', 'users'),
})

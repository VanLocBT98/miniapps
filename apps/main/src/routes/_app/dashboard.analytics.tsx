import { createFileRoute } from '@tanstack/react-router'
import { analyticsQueryOptions } from '@repo/dashboard/apis'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/dashboard/analytics')({
  beforeLoad: ({ context }) => {
    if (!context.session?.user.permissions.includes('dashboard:analytics')) {
      throw new Error('Missing permission: dashboard:analytics')
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(analyticsQueryOptions),
  component: createLazyRouteComponent('dashboard', 'analytics'),
})

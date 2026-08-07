import { createFileRoute } from '@tanstack/react-router'
import { customersQueryOptions } from '@repo/booking/apis'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/customer/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(customersQueryOptions),
  component: createLazyRouteComponent('booking', 'customer-list'),
})

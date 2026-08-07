import { createFileRoute } from '@tanstack/react-router'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/customer/new')({
  component: createLazyRouteComponent('booking', 'customer-new'),
})

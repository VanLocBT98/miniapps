import { createFileRoute } from '@tanstack/react-router'
import { createLazyRouteComponent } from '~/lib/lazy-project-page'

export const Route = createFileRoute('/_app/dashboard/')({
  component: createLazyRouteComponent('dashboard', 'home'),
})

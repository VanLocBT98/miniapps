import { createFileRoute } from '@tanstack/react-router'
import { createCustomerScopedPage } from '~/lib/bound-customer-page'

export const Route = createFileRoute('/_app/customer/$customerId/')({
  component: function CustomerDetailRoute() {
    const { customerId } = Route.useParams()
    return createCustomerScopedPage('customer-detail', customerId)
  },
})

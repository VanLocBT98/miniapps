import { createFileRoute } from '@tanstack/react-router'
import { customerDetailQueryOptions } from '@repo/booking/apis'
import { createCustomerScopedPage } from '~/lib/bound-customer-page'

export const Route = createFileRoute('/_app/customer/$customerId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      customerDetailQueryOptions(params.customerId),
    ),
  component: function CustomerEditRoute() {
    const { customerId } = Route.useParams()
    return createCustomerScopedPage('customer-edit', customerId)
  },
})

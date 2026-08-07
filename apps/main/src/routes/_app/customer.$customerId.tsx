import { Outlet, createFileRoute } from '@tanstack/react-router'
import { customerDetailQueryOptions } from '@repo/booking/apis'

export const Route = createFileRoute('/_app/customer/$customerId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      customerDetailQueryOptions(params.customerId),
    ),
  component: () => <Outlet />,
})

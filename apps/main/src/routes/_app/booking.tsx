import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { hasAnyPermission } from '@repo/shared/auth'

export const Route = createFileRoute('/_app/booking')({
  beforeLoad: ({ context }) => {
    if (!hasAnyPermission(context.session?.user, ['booking:view'])) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => <Outlet />,
})

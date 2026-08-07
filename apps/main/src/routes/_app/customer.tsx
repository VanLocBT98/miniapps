import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { hasAnyPermission } from '@repo/shared/auth'

export const Route = createFileRoute('/_app/customer')({
  beforeLoad: ({ context }) => {
    if (!hasAnyPermission(context.session?.user, ['customer:view'])) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => <Outlet />,
})

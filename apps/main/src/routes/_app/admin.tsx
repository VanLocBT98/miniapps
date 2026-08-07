import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { hasAnyPermission } from '@repo/shared/auth'

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: ({ context }) => {
    if (
      !hasAnyPermission(context.session?.user, [
        'admin:users',
        'admin:roles',
        'admin:permissions',
      ])
    ) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => <Outlet />,
})

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { hasAnyPermission } from '@repo/shared/auth'

export const Route = createFileRoute('/_app/dashboard')({
  beforeLoad: ({ context }) => {
    if (!hasAnyPermission(context.session?.user, ['dashboard:view'])) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})

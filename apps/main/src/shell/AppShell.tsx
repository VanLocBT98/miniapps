import { Outlet } from '@tanstack/react-router'
import type { Session } from '@repo/shared/auth'
import type { ProjectMeta } from '~/lib/router-context'
import { getNavigationFromMeta } from '~/projects/installed'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'
import { AppFooter } from './AppFooter'

export function AppShell({
  session,
  projects,
  appName,
}: {
  session: Session
  projects: ProjectMeta[]
  appName: string
}) {
  const navigation = getNavigationFromMeta(projects, session.user.permissions)

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={session.user} appName={appName} />
      <div className="flex flex-1">
        <AppSidebar items={navigation} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <AppFooter />
    </div>
  )
}

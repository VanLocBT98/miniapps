import { Link } from '@tanstack/react-router'
import { Button } from '@repo/ui'
import type { AuthUser } from '@repo/shared/auth'
import {
  isPortalMode,
  portalHomePath,
  useRuntimeOptional,
} from '@repo/shared/runtime'
import { logoutFn } from '~/lib/auth'

export function AppHeader({
  user,
  appName,
}: {
  user: AuthUser | null
  appName: string
}) {
  const runtime = useRuntimeOptional()
  const showBackHome = runtime ? isPortalMode(runtime) : false
  const homeHref = runtime ? portalHomePath(runtime) : '/'

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-semibold tracking-tight text-slate-50">
          {appName}
        </Link>
        <span className="hidden text-xs text-slate-500 sm:inline">
          SSR Micro Frontend Host
        </span>
        {showBackHome ? (
          <a
            href={homeHref}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-sky-400 hover:bg-slate-900"
          >
            Back to Home
          </a>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden text-sm text-slate-300 sm:inline">{user.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void logoutFn().then(() => {
                  window.location.href = '/login'
                })
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button size="sm">Login</Button>
          </Link>
        )}
      </div>
    </header>
  )
}

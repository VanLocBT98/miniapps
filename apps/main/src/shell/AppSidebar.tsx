import { Link } from '@tanstack/react-router'
import type { NavigationItem } from '@repo/shared/project'
import { cn } from '@repo/ui'

export function AppSidebar({ items }: { items: NavigationItem[] }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-800 bg-slate-950/60 p-3 md:block">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Navigation
      </p>
      <nav className="flex flex-col gap-1" aria-label="Main">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 hover:text-slate-50"
            activeProps={{
              className: cn(
                'rounded-md px-3 py-2 text-sm bg-sky-950 text-sky-200 hover:bg-sky-950',
              ),
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

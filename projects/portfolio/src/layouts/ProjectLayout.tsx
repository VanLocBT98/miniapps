import type { ReactNode } from 'react'

/** Host/standalone wrapper — keeps portfolio styles scoped. */
export function ProjectLayout({ children }: { children: ReactNode }) {
  return <div className="portfolio-root">{children}</div>
}

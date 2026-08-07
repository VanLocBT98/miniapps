import type { ReactNode } from 'react'
import { PROJECT_NAME } from '@/shared/constants'

export function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
        {PROJECT_NAME}
      </div>
      {children}
    </div>
  )
}

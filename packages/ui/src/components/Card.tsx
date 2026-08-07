import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  actions?: ReactNode
}

export function Card({ className, title, description, actions, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm shadow-black/20',
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-base font-semibold text-slate-50">{title}</h3> : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}

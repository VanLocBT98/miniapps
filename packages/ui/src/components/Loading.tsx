import { LoaderCircle } from 'lucide-react'
import { cn } from '../lib/cn'

export type LoadingProps = {
  label?: string
  className?: string
}

export function Loading({ label = 'Loading…', className }: LoadingProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2 py-10 text-slate-300', className)}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  )
}

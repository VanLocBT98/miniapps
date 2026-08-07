import { cn } from '@repo/ui'
import type { CustomerStatus as CustomerStatusValue } from '@/shared/types'

const tone: Record<CustomerStatusValue, string> = {
  Active: 'bg-emerald-900 text-emerald-100',
  Inactive: 'bg-slate-700 text-slate-200',
}

/** Status pill for customer Active / Inactive. */
export function CustomerStatus({
  status,
  className,
}: {
  status: CustomerStatusValue | string
  className?: string
}) {
  const known = status in tone ? (status as CustomerStatusValue) : null
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
        known ? tone[known] : 'bg-slate-800 text-slate-200',
        className,
      )}
    >
      {status}
    </span>
  )
}

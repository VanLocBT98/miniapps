import type { ReactNode } from 'react'
import { cn } from '@repo/ui'
import type { BookingStatus as BookingStatusValue } from '@/shared/types'

const tone: Record<BookingStatusValue, string> = {
  Draft: 'bg-slate-700 text-slate-100',
  Confirmed: 'bg-sky-900 text-sky-100',
  Ticketed: 'bg-emerald-900 text-emerald-100',
  Cancelled: 'bg-rose-900 text-rose-100',
  Completed: 'bg-slate-800 text-slate-200',
}

/** Status pill for domain booking statuses. */
export function BookingStatus({
  status,
  className,
}: {
  status: BookingStatusValue | string
  className?: string
}) {
  const known = status in tone ? (status as BookingStatusValue) : null
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

function Shell({
  title,
  children,
  className,
}: {
  title: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-800 bg-slate-900/50 p-4',
        className,
      )}
    >
      <h3 className="mb-2 text-sm font-semibold text-slate-100">{title}</h3>
      {children}
    </div>
  )
}

export function BookingCard({
  title,
  children,
  className,
}: {
  title: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Shell title={title} className={className}>
      {children}
    </Shell>
  )
}

export function PassengerCard({
  title = 'Passenger',
  children,
  className,
}: {
  title?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Shell title={title} className={className}>
      {children}
    </Shell>
  )
}

export function FlightCard({
  title = 'Flight',
  children,
  className,
}: {
  title?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Shell title={title} className={className}>
      {children}
    </Shell>
  )
}

export function PaymentCard({
  title = 'Payment',
  children,
  className,
}: {
  title?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Shell title={title} className={className}>
      {children}
    </Shell>
  )
}

export function TimelineCard({
  title = 'Timeline',
  children,
  className,
}: {
  title?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <Shell title={title} className={className}>
      {children}
    </Shell>
  )
}

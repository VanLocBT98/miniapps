import { Button, Card, toast } from '@repo/ui'
import { bookingStatusSchema, type BookingStatus, type Payment } from '@/shared/types'
import {
  canMarkTicketed,
  validateTicketedRequiresPayment,
} from '../utils/validate-payment'

export function BookingStatusActions({
  status,
  payment,
  disabled,
  pending,
  onChangeStatus,
}: {
  status: BookingStatus
  payment: Payment | null
  disabled: boolean
  pending: boolean
  onChangeStatus: (status: BookingStatus) => void
}) {
  if (disabled) return null

  const ticketBlocked = !canMarkTicketed(payment)

  return (
    <Card
      title="Booking status"
      description="Ticketed is blocked until a payment exists."
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm text-slate-300">
          Status
          <select
            className="h-10 min-w-[10rem] rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={status}
            disabled={pending}
            onChange={(e) => {
              const next = e.target.value as BookingStatus
              const issues = validateTicketedRequiresPayment(payment, next)
              if (issues.length > 0) {
                toast({
                  title: 'Cannot mark Ticketed',
                  description: issues[0]?.message,
                  variant: 'error',
                })
                return
              }
              onChangeStatus(next)
            }}
          >
            {bookingStatusSchema.options.map((s) => (
              <option
                key={s}
                value={s}
                disabled={s === 'Ticketed' && ticketBlocked}
              >
                {s}
                {s === 'Ticketed' && ticketBlocked ? ' (needs payment)' : ''}
              </option>
            ))}
          </select>
        </label>
        {ticketBlocked ? (
          <p className="text-sm text-amber-200">
            Add a payment below to unlock Ticketed.
          </p>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={pending || status === 'Ticketed'}
            onClick={() => onChangeStatus('Ticketed')}
          >
            Mark Ticketed
          </Button>
        )}
      </div>
    </Card>
  )
}

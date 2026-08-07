import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Card, toast } from '@repo/ui'
import {
  BookingStatusActions,
  PaymentForm,
  PaymentInfoCard,
  PaymentRulesAlert,
  validateTicketedRequiresPayment,
} from '@/features/payment'
import { isBookingReadOnly } from '@/shared/domain'
import {
  bookingDetailQueryOptions,
  bookingPaymentQueryOptions,
} from '@/shared/services/apis/apis'
import {
  useUpdateBookingMutation,
  useUpdatePaymentMutation,
} from '@/shared/services/apis/mutations'
import type { BookingStatus, Payment } from '@/shared/types'

export default function PaymentPage({ bookingId }: { bookingId: string }) {
  const { data: booking } = useSuspenseQuery(bookingDetailQueryOptions(bookingId))
  const { data: payment } = useSuspenseQuery(bookingPaymentQueryOptions(bookingId))
  const updatePayment = useUpdatePaymentMutation(bookingId)
  const updateBooking = useUpdateBookingMutation()
  const readOnly = isBookingReadOnly(booking.status)

  const ticketIssues = validateTicketedRequiresPayment(payment, 'Ticketed')

  const savePayment = (next: Payment) => {
    updatePayment.mutate(next)
  }

  const clearPayment = () => {
    if (booking.status === 'Ticketed') {
      toast({
        title: 'Cannot remove payment',
        description: 'Ticketed bookings require a payment on file.',
        variant: 'error',
      })
      return
    }
    updatePayment.mutate(null)
  }

  const changeStatus = (status: BookingStatus) => {
    const issues = validateTicketedRequiresPayment(payment, status)
    if (issues.length > 0) {
      toast({
        title: 'Cannot mark Ticketed',
        description: issues[0]?.message,
        variant: 'error',
      })
      return
    }
    updateBooking.mutate({ id: bookingId, input: { status } })
  }

  return (
    <div className="space-y-4">
      <PaymentRulesAlert payment={payment} issues={ticketIssues} />

      <BookingStatusActions
        status={booking.status}
        payment={payment}
        disabled={readOnly}
        pending={updateBooking.isPending}
        onChangeStatus={changeStatus}
      />

      {payment ? (
        <PaymentInfoCard payment={payment} />
      ) : (
        <Card title="Payment" description="No payment on this booking." />
      )}

      <PaymentForm
        key={payment?.id ?? 'new'}
        disabled={readOnly}
        initial={payment}
        onSave={savePayment}
      />

      {!readOnly && payment ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-rose-300"
          disabled={updatePayment.isPending || booking.status === 'Ticketed'}
          onClick={clearPayment}
        >
          Remove payment
        </Button>
      ) : null}
    </div>
  )
}

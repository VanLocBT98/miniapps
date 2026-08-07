import { formatCurrency } from '@repo/shared/utils'
import { PaymentCard } from '@/components/molecules/booking-cards'
import type { Payment } from '@/shared/types'

export function PaymentInfoCard({ payment }: { payment: Payment }) {
  return (
    <PaymentCard title={payment.paymentMethod}>
      <p className="text-lg font-semibold text-slate-50">
        {formatCurrency(payment.amount)}{' '}
        <span className="text-sm font-normal text-slate-400">
          {payment.currency}
        </span>
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Status: {payment.paymentStatus}
      </p>
      <p className="mt-1 text-xs text-slate-500">ID: {payment.id}</p>
    </PaymentCard>
  )
}

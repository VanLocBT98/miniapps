import { canSetTicketed } from '@/shared/domain'
import type { BookingStatus, Payment } from '@/shared/types'

export type PaymentRuleIssue = { code: string; message: string }

/** Issues when targeting Ticketed without a payment record. */
export function validateTicketedRequiresPayment(
  payment: Payment | null | undefined,
  targetStatus?: BookingStatus,
): PaymentRuleIssue[] {
  if (targetStatus !== 'Ticketed') return []
  if (canSetTicketed(payment)) return []
  return [
    {
      code: 'payment.required',
      message: 'Payment must exist before status can become Ticketed',
    },
  ]
}

export function canMarkTicketed(payment: Payment | null | undefined): boolean {
  return canSetTicketed(payment)
}

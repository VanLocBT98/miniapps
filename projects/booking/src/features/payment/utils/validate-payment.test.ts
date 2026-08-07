import { describe, expect, it } from 'vitest'
import {
  canMarkTicketed,
  validateTicketedRequiresPayment,
} from './validate-payment'
import type { Payment } from '@/shared/types'

const payment: Payment = {
  id: 'pay-1',
  amount: 100,
  currency: 'USD',
  paymentMethod: 'card',
  paymentStatus: 'Captured',
}

describe('validateTicketedRequiresPayment', () => {
  it('blocks Ticketed without payment', () => {
    const issues = validateTicketedRequiresPayment(null, 'Ticketed')
    expect(issues.some((i) => i.code === 'payment.required')).toBe(true)
  })

  it('allows Ticketed with payment', () => {
    expect(validateTicketedRequiresPayment(payment, 'Ticketed')).toEqual([])
  })

  it('ignores non-Ticketed targets', () => {
    expect(validateTicketedRequiresPayment(null, 'Confirmed')).toEqual([])
  })

  it('canMarkTicketed mirrors payment presence', () => {
    expect(canMarkTicketed(null)).toBe(false)
    expect(canMarkTicketed(payment)).toBe(true)
  })
})

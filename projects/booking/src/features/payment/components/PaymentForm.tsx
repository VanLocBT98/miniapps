import { useState } from 'react'
import { Button, Card, FormField, Input } from '@repo/ui'
import {
  paymentStatusSchema,
  type Payment,
  type PaymentStatus,
} from '@/shared/types'

const METHODS = ['card', 'cash', 'bank_transfer', 'agency_credit'] as const

export function PaymentForm({
  disabled,
  initial,
  onSave,
}: {
  disabled: boolean
  initial: Payment | null
  onSave: (payment: Payment) => void
}) {
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : '',
  )
  const [currency, setCurrency] = useState(initial?.currency ?? 'USD')
  const [paymentMethod, setPaymentMethod] = useState(
    initial?.paymentMethod ?? 'card',
  )
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initial?.paymentStatus ?? 'Captured',
  )
  const [error, setError] = useState<string | null>(null)

  if (disabled) return null

  return (
    <Card
      title={initial ? 'Edit payment' : 'Add payment'}
      description="Required before marking the booking Ticketed."
    >
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          const parsedAmount = Number(amount)
          if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
            setError('Enter a valid non-negative amount')
            return
          }
          if (!currency.trim() || !paymentMethod.trim()) {
            setError('Currency and method are required')
            return
          }
          setError(null)
          onSave({
            id: initial?.id ?? `pay-${Date.now()}`,
            amount: parsedAmount,
            currency: currency.trim().toUpperCase(),
            paymentMethod: paymentMethod.trim(),
            paymentStatus,
          })
        }}
      >
        <FormField label="Amount" htmlFor="pay-amount" error={error ?? undefined}>
          <Input
            id="pay-amount"
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Currency" htmlFor="pay-currency">
          <Input
            id="pay-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            placeholder="USD"
          />
        </FormField>
        <FormField label="Method" htmlFor="pay-method">
          <select
            id="pay-method"
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Payment status" htmlFor="pay-status">
          <select
            id="pay-status"
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={paymentStatus}
            onChange={(e) =>
              setPaymentStatus(e.target.value as PaymentStatus)
            }
          >
            {paymentStatusSchema.options.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">
            {initial ? 'Save payment' : 'Add payment'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

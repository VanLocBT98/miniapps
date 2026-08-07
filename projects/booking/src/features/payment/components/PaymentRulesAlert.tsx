import { Card } from '@repo/ui'
import type { Payment } from '@/shared/types'
import type { PaymentRuleIssue } from '../utils/validate-payment'

export function PaymentRulesAlert({
  payment,
  issues,
}: {
  payment: Payment | null
  issues: PaymentRuleIssue[]
}) {
  return (
    <Card
      title="Payment rules"
      description="Payment must exist before status can become Ticketed."
      className={
        !payment || issues.length > 0
          ? 'border-amber-800/50 bg-amber-950/20'
          : 'border-slate-800'
      }
    >
      {!payment ? (
        <p className="text-sm text-amber-200">
          No payment on this booking — Ticketed is blocked until you add one.
        </p>
      ) : issues.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-rose-200">
          {issues.map((issue) => (
            <li key={issue.code}>{issue.message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">
          Payment on file — Ticketed is allowed (other booking rules still apply).
        </p>
      )}
    </Card>
  )
}

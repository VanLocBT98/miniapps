import { Card } from '@repo/ui'
import type { BookingType } from '@/shared/types'
import type { PassengerRuleIssue } from '../utils/validate-passengers'

export function PassengerRulesAlert({
  bookingType,
  issues,
}: {
  bookingType: BookingType
  issues: PassengerRuleIssue[]
}) {
  if (issues.length === 0 && bookingType !== 'international') return null

  return (
    <Card
      title="Passenger rules"
      description={
        bookingType === 'international'
          ? 'International bookings require a passport number for every passenger. At least one passenger is required.'
          : 'At least one passenger is required.'
      }
      className={
        issues.length > 0
          ? 'border-rose-800/50 bg-rose-950/20'
          : 'border-slate-800'
      }
    >
      {issues.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-rose-200">
          {issues.map((issue) => (
            <li key={issue.code}>{issue.message}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">All passenger rules look good.</p>
      )}
    </Card>
  )
}

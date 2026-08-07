import { Card } from '@repo/ui'
import type { FlightRuleIssue } from '../utils/validate-flights'

export function FlightRulesAlert({ issues }: { issues: FlightRuleIssue[] }) {
  return (
    <Card
      title="Flight rules"
      description="At least one flight is required."
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
        <p className="text-sm text-slate-400">All flight rules look good.</p>
      )}
    </Card>
  )
}

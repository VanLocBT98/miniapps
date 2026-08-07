import { useSuspenseQuery } from '@tanstack/react-query'
import { Card } from '@repo/ui'
import { analyticsQueryOptions } from '@/shared/services/apis/apis'

export default function AnalyticsPage() {
  const { data } = useSuspenseQuery(analyticsQueryOptions)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Analytics</h1>
      <Card title="Weekly traffic">
        <ul className="space-y-2">
          {data.map((point) => (
            <li key={point.label} className="flex items-center justify-between text-sm">
              <span>{point.label}</span>
              <span className="font-medium text-sky-300">{point.value}k</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

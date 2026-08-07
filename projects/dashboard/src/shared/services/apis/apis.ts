import { queryOptions } from '@tanstack/react-query'
import { dashboardKeys } from './query-keys'

export type AnalyticsPoint = { label: string; value: number }

const analytics: AnalyticsPoint[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 9 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 15 },
]

export function getAnalytics() {
  return analytics
}

export const analyticsQueryOptions = queryOptions({
  queryKey: dashboardKeys.list({ type: 'analytics' }),
  queryFn: async () => getAnalytics(),
})

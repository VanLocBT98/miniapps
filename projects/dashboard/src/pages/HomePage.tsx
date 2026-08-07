import { Card } from '@repo/ui'

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Active users" description="Last 24h">1,284</Card>
        <Card title="Conversion" description="This week">4.8%</Card>
        <Card title="Revenue" description="MTD">$82,400</Card>
      </div>
    </div>
  )
}

import { Card } from '@repo/ui'

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Profile</h1>
      <Card title="Account" description="Demo profile for the dashboard mini app">
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-slate-400">Name</dt><dd>Admin User</dd></div>
          <div className="flex justify-between"><dt className="text-slate-400">Timezone</dt><dd>Asia/Ho_Chi_Minh</dd></div>
        </dl>
      </Card>
    </div>
  )
}

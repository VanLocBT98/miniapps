import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Card, Input } from '@repo/ui'
import { useCreateBookingMutation } from '@/shared/services/apis/mutations'
import type { BookingType } from '@/shared/types'
import { useState } from 'react'

export default function BookingNewPage() {
  const navigate = useNavigate()
  const createMutation = useCreateBookingMutation()
  const [bookingNumber, setBookingNumber] = useState(
    () => `BK-${Date.now().toString().slice(-6)}`,
  )
  const [bookingType, setBookingType] = useState<BookingType>('domestic')

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-50">New booking</h1>
        <Link to="/booking" className="text-sm text-sky-400 hover:underline">
          Back to list
        </Link>
      </div>
      <Card
        title="Create"
        description="Draft booking via TanStack Query mutation (toast + invalidate)."
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate(
              {
                bookingNumber,
                bookingType,
                status: 'Draft',
              },
              {
                onSuccess: (data) => {
                  void navigate({
                    to: '/booking/$bookingId',
                    params: { bookingId: data.id },
                  })
                },
              },
            )
          }}
        >
          <label className="block space-y-1 text-sm">
            <span className="text-slate-400">Booking number</span>
            <Input
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-slate-400">Type</span>
            <select
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value as BookingType)}
            >
              <option value="domestic">domestic</option>
              <option value="international">international</option>
            </select>
          </label>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving…' : 'Create draft'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Card, toast } from '@repo/ui'
import {
  AddPassengerForm,
  PassengerCards,
  PassengerRulesAlert,
  PassengerTable,
  validatePassengersForBooking,
} from '@/features/passengers'
import { isBookingReadOnly } from '@/shared/domain'
import {
  bookingDetailQueryOptions,
  bookingPassengersQueryOptions,
} from '@/shared/services/apis/apis'
import { useUpdatePassengersMutation } from '@/shared/services/apis/mutations'
import type { Passenger } from '@/shared/types'

export default function PassengersPage({ bookingId }: { bookingId: string }) {
  const { data: booking } = useSuspenseQuery(bookingDetailQueryOptions(bookingId))
  const { data: serverPassengers } = useSuspenseQuery(
    bookingPassengersQueryOptions(bookingId),
  )
  const updatePassengers = useUpdatePassengersMutation(bookingId)
  const readOnly = isBookingReadOnly(booking.status)
  const [view, setView] = useState<'table' | 'cards'>('table')
  const [draft, setDraft] = useState<Passenger[] | null>(null)
  const passengers = draft ?? serverPassengers

  const issues = useMemo(
    () => validatePassengersForBooking(booking.bookingType, passengers),
    [booking.bookingType, passengers],
  )

  const dirty = draft !== null

  const persist = (next: Passenger[]) => {
    const nextIssues = validatePassengersForBooking(booking.bookingType, next)
    if (nextIssues.length > 0) {
      toast({
        title: 'Passenger rules failed',
        description: nextIssues[0]?.message,
        variant: 'error',
      })
      setDraft(next)
      return
    }
    updatePassengers.mutate(next, {
      onSuccess: () => setDraft(null),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-400">
          {passengers.length} passenger{passengers.length === 1 ? '' : 's'}
          {dirty ? ' · unsaved changes' : ''}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={view === 'table' ? 'primary' : 'ghost'}
            onClick={() => setView('table')}
          >
            Table
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === 'cards' ? 'primary' : 'ghost'}
            onClick={() => setView('cards')}
          >
            Cards
          </Button>
        </div>
      </div>

      <PassengerRulesAlert
        bookingType={booking.bookingType}
        issues={issues}
      />

      <Card title="Passengers">
        {view === 'table' ? (
          <PassengerTable
            passengers={passengers}
            readOnly={readOnly}
            onRemove={(id) => {
              const next = passengers.filter((p) => p.id !== id)
              if (next.length === 0) {
                toast({
                  title: 'At least one passenger is required',
                  variant: 'error',
                })
                setDraft(next)
                return
              }
              setDraft(next)
            }}
          />
        ) : (
          <PassengerCards
            passengers={passengers}
            bookingType={booking.bookingType}
            readOnly={readOnly}
            onRemove={(id) => {
              const next = passengers.filter((p) => p.id !== id)
              if (next.length === 0) {
                toast({
                  title: 'At least one passenger is required',
                  variant: 'error',
                })
                setDraft(next)
                return
              }
              setDraft(next)
            }}
          />
        )}
      </Card>

      <AddPassengerForm
        bookingType={booking.bookingType}
        disabled={readOnly}
        onAdd={(passenger) => setDraft([...passengers, passenger])}
      />

      {!readOnly && dirty ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={updatePassengers.isPending || issues.length > 0}
            onClick={() => persist(passengers)}
          >
            {updatePassengers.isPending ? 'Saving…' : 'Save passengers'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setDraft(null)}
          >
            Discard
          </Button>
        </div>
      ) : null}
    </div>
  )
}

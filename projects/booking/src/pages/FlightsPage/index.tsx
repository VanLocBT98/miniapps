import { useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Card, toast } from '@repo/ui'
import {
  AddFlightForm,
  FlightCards,
  FlightRulesAlert,
  FlightTable,
  validateFlightsForBooking,
} from '@/features/flights'
import { isBookingReadOnly } from '@/shared/domain'
import {
  bookingDetailQueryOptions,
  bookingFlightsQueryOptions,
} from '@/shared/services/apis/apis'
import { useUpdateFlightsMutation } from '@/shared/services/apis/mutations'
import type { Flight } from '@/shared/types'

export default function FlightsPage({ bookingId }: { bookingId: string }) {
  const { data: booking } = useSuspenseQuery(bookingDetailQueryOptions(bookingId))
  const { data: serverFlights } = useSuspenseQuery(
    bookingFlightsQueryOptions(bookingId),
  )
  const updateFlights = useUpdateFlightsMutation(bookingId)
  const readOnly = isBookingReadOnly(booking.status)
  const [view, setView] = useState<'table' | 'cards'>('table')
  const [draft, setDraft] = useState<Flight[] | null>(null)
  const flights = draft ?? serverFlights

  const issues = useMemo(() => validateFlightsForBooking(flights), [flights])
  const dirty = draft !== null

  const persist = (next: Flight[]) => {
    const nextIssues = validateFlightsForBooking(next)
    if (nextIssues.length > 0) {
      toast({
        title: 'Flight rules failed',
        description: nextIssues[0]?.message,
        variant: 'error',
      })
      setDraft(next)
      return
    }
    updateFlights.mutate(next, {
      onSuccess: () => setDraft(null),
    })
  }

  const onRemove = (id: string) => {
    const next = flights.filter((f) => f.id !== id)
    if (next.length === 0) {
      toast({
        title: 'At least one flight is required',
        variant: 'error',
      })
      setDraft(next)
      return
    }
    setDraft(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-400">
          {flights.length} flight{flights.length === 1 ? '' : 's'}
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

      <FlightRulesAlert issues={issues} />

      <Card title="Flights">
        {view === 'table' ? (
          <FlightTable
            flights={flights}
            readOnly={readOnly}
            onRemove={onRemove}
          />
        ) : (
          <FlightCards
            flights={flights}
            readOnly={readOnly}
            onRemove={onRemove}
          />
        )}
      </Card>

      <AddFlightForm
        disabled={readOnly}
        onAdd={(flight) => setDraft([...flights, flight])}
      />

      {!readOnly && dirty ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={updateFlights.isPending || issues.length > 0}
            onClick={() => persist(flights)}
          >
            {updateFlights.isPending ? 'Saving…' : 'Save flights'}
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

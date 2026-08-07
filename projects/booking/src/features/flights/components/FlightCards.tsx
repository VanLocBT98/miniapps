import { FlightCard } from '@/components/molecules/booking-cards'
import { Button } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import type { Flight } from '@/shared/types'

export function FlightCards({
  flights,
  readOnly,
  onRemove,
}: {
  flights: Flight[]
  readOnly: boolean
  onRemove: (id: string) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {flights.map((f) => (
        <FlightCard key={f.id} title={`${f.airline} ${f.flightNumber}`}>
          <p className="text-sm text-slate-300">
            {f.departureAirport} → {f.arrivalAirport}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {formatDate(f.departureTime)} → {formatDate(f.arrivalTime)}
          </p>
          {!readOnly ? (
            <div className="mt-3">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-rose-300"
                onClick={() => onRemove(f.id)}
              >
                Remove
              </Button>
            </div>
          ) : null}
        </FlightCard>
      ))}
    </div>
  )
}

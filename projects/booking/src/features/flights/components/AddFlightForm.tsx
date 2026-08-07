import { useState } from 'react'
import { Button, Card, FormField, Input } from '@repo/ui'
import type { Flight } from '@/shared/types'

export function AddFlightForm({
  disabled,
  onAdd,
}: {
  disabled: boolean
  onAdd: (flight: Flight) => void
}) {
  const [airline, setAirline] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [departureAirport, setDepartureAirport] = useState('')
  const [arrivalAirport, setArrivalAirport] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (disabled) return null

  return (
    <Card title="Add flight" description="Saved via TanStack Query mutation.">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (
            !airline.trim() ||
            !flightNumber.trim() ||
            !departureAirport.trim() ||
            !arrivalAirport.trim() ||
            !departureTime.trim() ||
            !arrivalTime.trim()
          ) {
            setError('All flight fields are required')
            return
          }
          if (new Date(arrivalTime) <= new Date(departureTime)) {
            setError('Arrival must be after departure')
            return
          }
          setError(null)
          onAdd({
            id: `f-${Date.now()}`,
            airline: airline.trim(),
            flightNumber: flightNumber.trim(),
            departureAirport: departureAirport.trim().toUpperCase(),
            arrivalAirport: arrivalAirport.trim().toUpperCase(),
            departureTime: new Date(departureTime).toISOString(),
            arrivalTime: new Date(arrivalTime).toISOString(),
          })
          setAirline('')
          setFlightNumber('')
          setDepartureAirport('')
          setArrivalAirport('')
          setDepartureTime('')
          setArrivalTime('')
        }}
      >
        <FormField label="Airline" htmlFor="f-airline">
          <Input
            id="f-airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            required
            placeholder="e.g. Vietnam Airlines"
          />
        </FormField>
        <FormField label="Flight number" htmlFor="f-number">
          <Input
            id="f-number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            required
            placeholder="e.g. VN210"
          />
        </FormField>
        <FormField label="Departure airport" htmlFor="f-dep">
          <Input
            id="f-dep"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
            required
            placeholder="SGN"
          />
        </FormField>
        <FormField label="Arrival airport" htmlFor="f-arr">
          <Input
            id="f-arr"
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value)}
            required
            placeholder="HAN"
          />
        </FormField>
        <FormField label="Departure time" htmlFor="f-dep-time">
          <Input
            id="f-dep-time"
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </FormField>
        <FormField
          label="Arrival time"
          htmlFor="f-arr-time"
          error={error ?? undefined}
        >
          <Input
            id="f-arr-time"
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </FormField>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">
            Add flight
          </Button>
        </div>
      </form>
    </Card>
  )
}

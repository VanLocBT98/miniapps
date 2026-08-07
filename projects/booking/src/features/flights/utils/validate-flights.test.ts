import { describe, expect, it } from 'vitest'
import { validateFlightsForBooking } from './validate-flights'
import type { Flight } from '@/shared/types'

const base: Flight = {
  id: 'f-1',
  airline: 'VN',
  flightNumber: 'VN210',
  departureAirport: 'SGN',
  arrivalAirport: 'HAN',
  departureTime: '2026-09-01T08:00:00.000Z',
  arrivalTime: '2026-09-01T10:00:00.000Z',
}

describe('validateFlightsForBooking', () => {
  it('requires at least one flight', () => {
    const issues = validateFlightsForBooking([])
    expect(issues.some((i) => i.code === 'flight.min')).toBe(true)
  })

  it('passes with one flight', () => {
    expect(validateFlightsForBooking([base])).toEqual([])
  })
})

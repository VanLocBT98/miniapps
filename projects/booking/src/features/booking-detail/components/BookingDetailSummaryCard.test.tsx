/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingDetailSummaryCard } from './BookingDetailSummaryCard'
import type { BookingAggregate } from '@/shared/types'

const booking: BookingAggregate = {
  id: 'b-1001',
  bookingNumber: 'BK-1001',
  status: 'Confirmed',
  bookingType: 'domestic',
  createdDate: '2026-08-01T00:00:00.000Z',
  updatedDate: '2026-08-02T00:00:00.000Z',
  passengers: [
    {
      id: 'p-1',
      firstName: 'An',
      lastName: 'Nguyen',
      gender: 'female',
      birthday: '1994-03-12',
    },
  ],
  flights: [
    {
      id: 'f-1',
      airline: 'VN',
      flightNumber: 'VN210',
      departureAirport: 'SGN',
      arrivalAirport: 'HAN',
      departureTime: '2026-08-10T08:00:00.000Z',
      arrivalTime: '2026-08-10T10:05:00.000Z',
    },
  ],
  payment: {
    id: 'pay-1',
    amount: 240,
    currency: 'USD',
    paymentMethod: 'card',
    paymentStatus: 'Captured',
  },
  timeline: [],
  history: [],
  documents: [],
}

describe('BookingDetailSummaryCard smoke', () => {
  it('renders passenger and flight counts', () => {
    render(<BookingDetailSummaryCard booking={booking} />)
    expect(screen.getByText('An Nguyen')).toBeInTheDocument()
    expect(screen.getByText('Passengers')).toBeInTheDocument()
    expect(screen.getByText('Flights')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
    expect(screen.getByText(/Captured/)).toBeInTheDocument()
  })
})

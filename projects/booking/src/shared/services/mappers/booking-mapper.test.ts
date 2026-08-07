import { describe, expect, it } from 'vitest'
import { primaryGuestName, toBookingListItem } from './booking-mapper'
import type { BookingAggregate } from '@/shared/types'

const booking: BookingAggregate = {
  id: 'b-1',
  bookingNumber: 'BK-1',
  status: 'Confirmed',
  bookingType: 'domestic',
  createdDate: '2026-08-01T00:00:00.000Z',
  updatedDate: '2026-08-01T00:00:00.000Z',
  passengers: [
    {
      id: 'p-1',
      firstName: 'An',
      lastName: 'Nguyen',
      gender: 'female',
      birthday: '1994-01-01',
    },
  ],
  flights: [
    {
      id: 'f-1',
      airline: 'VN',
      flightNumber: 'VN1',
      departureAirport: 'SGN',
      arrivalAirport: 'HAN',
      departureTime: '2026-09-01T08:00:00.000Z',
      arrivalTime: '2026-09-01T10:00:00.000Z',
    },
  ],
  payment: {
    id: 'pay-1',
    amount: 199,
    currency: 'USD',
    paymentMethod: 'card',
    paymentStatus: 'Captured',
  },
  timeline: [],
  history: [],
  documents: [],
}

describe('toBookingListItem', () => {
  it('maps guest, amount, and departure', () => {
    const row = toBookingListItem(booking)
    expect(row.guest).toBe('An Nguyen')
    expect(row.amount).toBe(199)
    expect(row.departureTime).toBe('2026-09-01T08:00:00.000Z')
    expect(row.bookingNumber).toBe('BK-1')
  })

  it('falls back guest to booking number', () => {
    expect(
      primaryGuestName({ ...booking, passengers: [] }),
    ).toBe('BK-1')
  })

  it('defaults amount and departure when empty', () => {
    const row = toBookingListItem({
      ...booking,
      flights: [],
      payment: null,
    })
    expect(row.amount).toBe(0)
    expect(row.departureTime).toBeNull()
  })
})

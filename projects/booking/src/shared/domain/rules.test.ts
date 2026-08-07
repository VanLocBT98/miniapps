import { describe, expect, it } from 'vitest'
import {
  assertUniqueBookingNumbers,
  canSetTicketed,
  isBookingEditable,
  isBookingReadOnly,
  validateBookingAggregate,
} from './rules'
import type { BookingAggregate } from '../types/booking'

function baseAggregate(
  overrides: Partial<BookingAggregate> = {},
): BookingAggregate {
  return {
    id: 'b-1',
    bookingNumber: 'BK-001',
    status: 'Draft',
    bookingType: 'domestic',
    createdDate: '2026-08-06T00:00:00.000Z',
    updatedDate: '2026-08-06T00:00:00.000Z',
    passengers: [
      {
        id: 'p-1',
        firstName: 'An',
        lastName: 'Nguyen',
        gender: 'female',
        birthday: '1995-01-01',
      },
    ],
    flights: [
      {
        id: 'f-1',
        airline: 'VN',
        flightNumber: 'VN210',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        departureTime: '2026-09-01T08:00:00.000Z',
        arrivalTime: '2026-09-01T10:00:00.000Z',
      },
    ],
    payment: null,
    timeline: [],
    history: [],
    documents: [],
    ...overrides,
  }
}

describe('booking business rules', () => {
  it('marks Cancelled and Completed as read-only', () => {
    expect(isBookingReadOnly('Cancelled')).toBe(true)
    expect(isBookingReadOnly('Completed')).toBe(true)
    expect(isBookingEditable('Draft')).toBe(true)
    expect(isBookingEditable('Confirmed')).toBe(true)
  })

  it('requires payment before Ticketed', () => {
    expect(canSetTicketed(null)).toBe(false)
    expect(
      canSetTicketed({
        id: 'pay-1',
        amount: 100,
        currency: 'USD',
        paymentMethod: 'card',
        paymentStatus: 'Captured',
      }),
    ).toBe(true)

    const issues = validateBookingAggregate(baseAggregate(), {
      targetStatus: 'Ticketed',
    })
    expect(issues.some((i) => i.code === 'payment.required')).toBe(true)
  })

  it('requires at least one passenger and flight', () => {
    const issues = validateBookingAggregate(
      baseAggregate({ passengers: [], flights: [] }),
    )
    expect(issues.map((i) => i.code).sort()).toEqual([
      'flight.min',
      'passenger.min',
    ])
  })

  it('requires passport on international bookings', () => {
    const issues = validateBookingAggregate(
      baseAggregate({ bookingType: 'international' }),
    )
    expect(issues.some((i) => i.code === 'passenger.passport')).toBe(true)

    const ok = validateBookingAggregate(
      baseAggregate({
        bookingType: 'international',
        passengers: [
          {
            id: 'p-1',
            firstName: 'An',
            lastName: 'Nguyen',
            gender: 'female',
            birthday: '1995-01-01',
            passportNumber: 'C1234567',
          },
        ],
      }),
    )
    expect(ok.some((i) => i.code === 'passenger.passport')).toBe(false)
  })

  it('detects duplicate booking numbers', () => {
    expect(assertUniqueBookingNumbers(['A', 'B', 'A'])).toMatch(/Duplicate/)
    expect(assertUniqueBookingNumbers(['A', 'B'])).toBeNull()
  })

  it('blocks edits when current status is read-only', () => {
    const issues = validateBookingAggregate(
      baseAggregate({ status: 'Completed' }),
      { targetStatus: 'Confirmed' },
    )
    expect(issues.some((i) => i.code === 'booking.readonly')).toBe(true)
  })
})

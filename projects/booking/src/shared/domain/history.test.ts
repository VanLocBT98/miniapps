import { describe, expect, it } from 'vitest'
import { describeBookingUpdateActions } from './history'
import type { BookingAggregate } from '../types/booking'

const base: BookingAggregate = {
  id: 'b-1',
  bookingNumber: 'BK-1',
  status: 'Draft',
  bookingType: 'domestic',
  createdDate: '2026-08-01T00:00:00.000Z',
  updatedDate: '2026-08-01T00:00:00.000Z',
  passengers: [],
  flights: [],
  payment: null,
  timeline: [],
  history: [],
  documents: [],
}

describe('describeBookingUpdateActions', () => {
  it('describes passenger and status changes', () => {
    const actions = describeBookingUpdateActions(base, {
      status: 'Confirmed',
      passengers: [
        {
          id: 'p-1',
          firstName: 'A',
          lastName: 'B',
          gender: 'other',
          birthday: '2000-01-01',
        },
      ],
    })
    expect(actions).toContain('Status changed to Confirmed')
    expect(actions).toContain('Passengers updated (1)')
  })

  it('describes payment removed', () => {
    expect(
      describeBookingUpdateActions(
        {
          ...base,
          payment: {
            id: 'pay-1',
            amount: 10,
            currency: 'USD',
            paymentMethod: 'card',
            paymentStatus: 'Pending',
          },
        },
        { payment: null },
      ),
    ).toEqual(['Payment removed'])
  })

  it('falls back to Booking updated', () => {
    expect(describeBookingUpdateActions(base, {})).toEqual(['Booking updated'])
  })
})

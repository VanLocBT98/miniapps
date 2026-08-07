import { describe, expect, it } from 'vitest'
import { bookingDetailHead, bookingListHead } from './booking-head'
import type { BookingAggregate } from '@/shared/types'

const booking = {
  bookingNumber: 'BK-1001',
  status: 'Confirmed',
  bookingType: 'domestic',
  passengers: [{ id: 'p1' }],
  flights: [{ id: 'f1' }],
} as BookingAggregate

describe('bookingDetailHead', () => {
  it('includes booking number and status in title', () => {
    const head = bookingDetailHead(booking)
    const title = head.meta.find((m) => 'title' in m && m.title)?.title
    expect(title).toContain('BK-1001')
    expect(title).toContain('Confirmed')
  })

  it('falls back without loader data', () => {
    const head = bookingDetailHead(undefined)
    expect(head.meta.some((m) => 'title' in m && m.title === 'Booking detail')).toBe(
      true,
    )
  })
})

describe('bookingListHead', () => {
  it('returns list title', () => {
    const head = bookingListHead()
    expect(head.meta.some((m) => 'title' in m && m.title === 'Bookings')).toBe(
      true,
    )
  })
})

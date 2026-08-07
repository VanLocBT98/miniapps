import { describe, expect, it, beforeEach } from 'vitest'
import {
  createBooking,
  getBooking,
  getBookingDocuments,
  listBookings,
  updateBooking,
} from './booking-service'
import { resetBookingDb } from './mock-db'

describe('booking API envelope', () => {
  beforeEach(() => {
    resetBookingDb()
  })

  it('lists bookings in success envelope', async () => {
    const res = await listBookings()
    expect(res.success).toBe(true)
    expect(res.error).toBeNull()
    expect(res.data?.length).toBeGreaterThan(0)
    expect(res.meta?.total).toBe(res.data?.length)
  })

  it('returns not_found envelope for missing detail', async () => {
    const res = await getBooking('missing')
    expect(res.success).toBe(false)
    expect(res.data).toBeNull()
    expect(res.error?.code).toBe('booking.not_found')
  })

  it('creates a draft booking', async () => {
    const res = await createBooking({
      bookingNumber: 'BK-NEW-1',
      bookingType: 'domestic',
      status: 'Draft',
    })
    expect(res.success).toBe(true)
    expect(res.data?.bookingNumber).toBe('BK-NEW-1')
    expect(res.data?.history.length).toBeGreaterThan(0)
  })

  it('rejects Ticketed without payment', async () => {
    const created = await createBooking({
      bookingNumber: 'BK-NEW-2',
      bookingType: 'domestic',
      status: 'Draft',
      passengers: [
        {
          id: 'p-x',
          firstName: 'A',
          lastName: 'B',
          gender: 'other',
          birthday: '2000-01-01',
        },
      ],
      flights: [
        {
          id: 'f-x',
          airline: 'VN',
          flightNumber: 'VN1',
          departureAirport: 'SGN',
          arrivalAirport: 'HAN',
          departureTime: '2026-09-01T00:00:00.000Z',
          arrivalTime: '2026-09-01T02:00:00.000Z',
        },
      ],
    })
    expect(created.success).toBe(true)
    const updated = await updateBooking(created.data!.id, { status: 'Ticketed' })
    expect(updated.success).toBe(false)
    expect(updated.error?.code).toBe('booking.rules')
  })

  it('records specific history on update mutations', async () => {
    const created = await createBooking({
      bookingNumber: 'BK-HIST-1',
      bookingType: 'domestic',
      status: 'Draft',
      passengers: [
        {
          id: 'p-h',
          firstName: 'H',
          lastName: 'Ist',
          gender: 'other',
          birthday: '2001-01-01',
        },
      ],
      flights: [
        {
          id: 'f-h',
          airline: 'VN',
          flightNumber: 'VN9',
          departureAirport: 'SGN',
          arrivalAirport: 'HAN',
          departureTime: '2026-09-01T00:00:00.000Z',
          arrivalTime: '2026-09-01T02:00:00.000Z',
        },
      ],
    })
    expect(created.success).toBe(true)
    const before = created.data!.history.length
    const updated = await updateBooking(created.data!.id, {
      status: 'Confirmed',
      passengers: [
        {
          id: 'p-h',
          firstName: 'H',
          lastName: 'Ist',
          gender: 'other',
          birthday: '2001-01-01',
        },
        {
          id: 'p-h2',
          firstName: 'Two',
          lastName: 'Guest',
          gender: 'female',
          birthday: '2002-02-02',
        },
      ],
    })
    expect(updated.success).toBe(true)
    const actions = updated.data!.history.slice(before).map((h) => h.action)
    expect(actions).toContain('Status changed to Confirmed')
    expect(actions).toContain('Passengers updated (2)')
    expect(updated.data!.timeline.length).toBe(updated.data!.history.length)
  })

  it('returns documents list for a booking', async () => {
    const res = await getBookingDocuments('b-1001')
    expect(res.success).toBe(true)
    expect(res.data?.length).toBeGreaterThan(0)
    expect(res.data?.[0]).toMatchObject({
      id: expect.any(String),
      type: expect.any(String),
      url: expect.any(String),
    })
  })
})

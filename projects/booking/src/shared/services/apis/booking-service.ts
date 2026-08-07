import { z } from 'zod'
import {
  assertUniqueBookingNumbers,
  createHistoryEntry,
  describeBookingUpdateActions,
  isBookingReadOnly,
  validateBookingAggregate,
} from '@/shared/domain'
import {
  bookingAggregateSchema,
  bookingSchema,
  documentSchema,
  failEnvelope,
  flightSchema,
  okEnvelope,
  passengerSchema,
  paymentSchema,
  type ApiEnvelope,
  type BookingAggregate,
  type Flight,
  type HistoryEntry,
  type Passenger,
  type Payment,
  type TimelineEvent,
  type Document,
} from '@/shared/types'
import { bookingDb } from './mock-db'
import { toBookingListItem, type BookingListItem } from '../mappers'

export type { BookingListItem }
export type BookingListFilters = {
  q?: string
  status?: string
  bookingType?: string
}

export const createBookingInputSchema = bookingAggregateSchema
  .omit({
    id: true,
    createdDate: true,
    updatedDate: true,
    timeline: true,
    history: true,
  })
  .partial({
    passengers: true,
    flights: true,
    payment: true,
    documents: true,
  })
  .extend({
    bookingNumber: z.string().min(1),
    status: bookingSchema.shape.status.default('Draft'),
    bookingType: bookingSchema.shape.bookingType,
  })

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>

export const updateBookingInputSchema = z.object({
  bookingNumber: z.string().min(1).optional(),
  status: bookingSchema.shape.status.optional(),
  bookingType: bookingSchema.shape.bookingType.optional(),
  updatedDate: z.string().min(1).optional(),
  passengers: z.array(passengerSchema).optional(),
  flights: z.array(flightSchema).optional(),
  payment: paymentSchema.nullable().optional(),
  documents: z.array(documentSchema).optional(),
})

export type UpdateBookingInput = z.infer<typeof updateBookingInputSchema>

function delay(ms = 20) {
  return new Promise((r) => setTimeout(r, ms))
}

function findIndex(id: string) {
  return bookingDb.rows.findIndex((b) => b.id === id)
}

function pushHistory(
  booking: BookingAggregate,
  action: string,
  user = 'agent',
) {
  const entry = createHistoryEntry({
    id: `h-${booking.id}-${booking.history.length + 1}`,
    action,
    user,
  })
  booking.history = [...booking.history, entry]
  booking.timeline = [
    ...booking.timeline,
    {
      id: `t-${booking.id}-${booking.timeline.length + 1}`,
      action,
      user,
      createdDate: entry.createdDate,
    },
  ]
  booking.updatedDate = entry.createdDate
}

export async function listBookings(
  filters: BookingListFilters = {},
): Promise<ApiEnvelope<BookingListItem[]>> {
  await delay()
  let rows = bookingDb.rows.map(toBookingListItem)
  if (filters.status) {
    rows = rows.filter((r) => r.status === filters.status)
  }
  if (filters.bookingType) {
    rows = rows.filter((r) => r.bookingType === filters.bookingType)
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase()
    rows = rows.filter(
      (r) =>
        r.bookingNumber.toLowerCase().includes(q) ||
        r.guest.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
    )
  }
  return okEnvelope(rows, { total: rows.length })
}

export async function getBooking(
  id: string,
): Promise<ApiEnvelope<BookingAggregate>> {
  await delay()
  const booking = bookingDb.rows.find((b) => b.id === id)
  if (!booking) {
    return failEnvelope({
      code: 'booking.not_found',
      message: 'Booking not found',
    })
  }
  return okEnvelope(booking)
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<ApiEnvelope<BookingAggregate>> {
  await delay()
  const parsed = createBookingInputSchema.safeParse(input)
  if (!parsed.success) {
    return failEnvelope({
      code: 'booking.invalid',
      message: parsed.error.issues[0]?.message ?? 'Invalid booking',
      details: parsed.error.flatten(),
    })
  }

  const dup = assertUniqueBookingNumbers([
    ...bookingDb.rows.map((b) => b.bookingNumber),
    parsed.data.bookingNumber,
  ])
  if (dup) {
    return failEnvelope({ code: 'booking.number_unique', message: dup })
  }

  const now = new Date().toISOString()
  const id = `b-${Date.now()}`
  const aggregate = bookingAggregateSchema.parse({
    ...parsed.data,
    id,
    createdDate: now,
    updatedDate: now,
    passengers: parsed.data.passengers ?? [],
    flights: parsed.data.flights ?? [],
    payment: parsed.data.payment ?? null,
    documents: parsed.data.documents ?? [],
    timeline: [],
    history: [],
  })

  const issues = validateBookingAggregate(aggregate)
  // Draft may be incomplete; only block hard unique/passport when Confirmed+
  if (aggregate.status !== 'Draft' && issues.length > 0) {
    return failEnvelope({
      code: 'booking.rules',
      message: issues[0]!.message,
      details: issues,
    })
  }

  pushHistory(aggregate, 'Booking created')
  bookingDb.rows = [...bookingDb.rows, aggregate]
  return okEnvelope(aggregate)
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<ApiEnvelope<BookingAggregate>> {
  await delay()
  const idx = findIndex(id)
  if (idx < 0) {
    return failEnvelope({
      code: 'booking.not_found',
      message: 'Booking not found',
    })
  }
  const current = bookingDb.rows[idx]!
  if (isBookingReadOnly(current.status)) {
    return failEnvelope({
      code: 'booking.readonly',
      message: `${current.status} bookings cannot be edited`,
    })
  }

  const parsed = updateBookingInputSchema.safeParse(input)
  if (!parsed.success) {
    return failEnvelope({
      code: 'booking.invalid',
      message: parsed.error.issues[0]?.message ?? 'Invalid update',
      details: parsed.error.flatten(),
    })
  }

  if (
    parsed.data.bookingNumber &&
    parsed.data.bookingNumber !== current.bookingNumber
  ) {
    const dup = assertUniqueBookingNumbers(
      bookingDb.rows
        .filter((b) => b.id !== id)
        .map((b) => b.bookingNumber)
        .concat(parsed.data.bookingNumber),
    )
    if (dup) {
      return failEnvelope({ code: 'booking.number_unique', message: dup })
    }
  }

  const next = bookingAggregateSchema.parse({
    ...current,
    ...parsed.data,
    id: current.id,
    createdDate: current.createdDate,
    history: current.history,
    timeline: current.timeline,
  })

  const issues = validateBookingAggregate(next, {
    targetStatus: next.status,
  })
  if (issues.length > 0) {
    return failEnvelope({
      code: 'booking.rules',
      message: issues[0]!.message,
      details: issues,
    })
  }

  const actions = describeBookingUpdateActions(current, parsed.data)
  for (const action of actions) {
    pushHistory(next, action)
  }
  const copy = [...bookingDb.rows]
  copy[idx] = next
  bookingDb.rows = copy
  return okEnvelope(next)
}

export async function deleteBooking(
  id: string,
): Promise<ApiEnvelope<{ id: string }>> {
  await delay()
  const idx = findIndex(id)
  if (idx < 0) {
    return failEnvelope({
      code: 'booking.not_found',
      message: 'Booking not found',
    })
  }
  const current = bookingDb.rows[idx]!
  if (isBookingReadOnly(current.status)) {
    return failEnvelope({
      code: 'booking.readonly',
      message: `${current.status} bookings cannot be deleted`,
    })
  }
  bookingDb.rows = bookingDb.rows.filter((b) => b.id !== id)
  return okEnvelope({ id })
}

export async function getBookingHistory(
  id: string,
): Promise<ApiEnvelope<HistoryEntry[]>> {
  const res = await getBooking(id)
  if (!res.success || !res.data)
    return res as unknown as ApiEnvelope<HistoryEntry[]>
  return okEnvelope(res.data.history, { bookingId: id })
}

export async function getBookingTimeline(
  id: string,
): Promise<ApiEnvelope<TimelineEvent[]>> {
  const res = await getBooking(id)
  if (!res.success || !res.data)
    return res as unknown as ApiEnvelope<TimelineEvent[]>
  return okEnvelope(res.data.timeline, { bookingId: id })
}

export async function getBookingPassengers(
  id: string,
): Promise<ApiEnvelope<Passenger[]>> {
  const res = await getBooking(id)
  if (!res.success || !res.data)
    return res as unknown as ApiEnvelope<Passenger[]>
  return okEnvelope(res.data.passengers, { bookingId: id })
}

export async function getBookingFlights(
  id: string,
): Promise<ApiEnvelope<Flight[]>> {
  const res = await getBooking(id)
  if (!res.success || !res.data) return res as unknown as ApiEnvelope<Flight[]>
  return okEnvelope(res.data.flights, { bookingId: id })
}

export async function getBookingPayment(
  id: string,
): Promise<ApiEnvelope<Payment | null>> {
  const res = await getBooking(id)
  if (!res.success || !res.data)
    return res as unknown as ApiEnvelope<Payment | null>
  return okEnvelope(res.data.payment, { bookingId: id })
}

export async function getBookingDocuments(
  id: string,
): Promise<ApiEnvelope<Document[]>> {
  const res = await getBooking(id)
  if (!res.success || !res.data)
    return res as unknown as ApiEnvelope<Document[]>
  return okEnvelope(res.data.documents, { bookingId: id })
}

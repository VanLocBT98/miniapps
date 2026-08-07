import { z } from 'zod'

export const bookingStatusSchema = z.enum([
  'Draft',
  'Confirmed',
  'Ticketed',
  'Cancelled',
  'Completed',
])
export type BookingStatus = z.infer<typeof bookingStatusSchema>

export const bookingTypeSchema = z.enum(['domestic', 'international'])
export type BookingType = z.infer<typeof bookingTypeSchema>

export const paymentStatusSchema = z.enum([
  'Pending',
  'Authorized',
  'Captured',
  'Failed',
  'Refunded',
])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

export const genderSchema = z.enum(['male', 'female', 'other', 'unspecified'])
export type Gender = z.infer<typeof genderSchema>

export const bookingIdSchema = z.string().min(1)
export type BookingId = z.infer<typeof bookingIdSchema>

export const passengerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: genderSchema,
  birthday: z.string().min(1),
  passportNumber: z.string().optional(),
})
export type Passenger = z.infer<typeof passengerSchema>

export const flightSchema = z.object({
  id: z.string().min(1),
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  departureAirport: z.string().min(1),
  arrivalAirport: z.string().min(1),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
})
export type Flight = z.infer<typeof flightSchema>

export const paymentSchema = z.object({
  id: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().min(1),
  paymentMethod: z.string().min(1),
  paymentStatus: paymentStatusSchema,
})
export type Payment = z.infer<typeof paymentSchema>

export const timelineEventSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1),
  user: z.string().min(1),
  createdDate: z.string().min(1),
})
export type TimelineEvent = z.infer<typeof timelineEventSchema>

/** History entries mirror timeline shape (every update is recorded). */
export const historyEntrySchema = timelineEventSchema
export type HistoryEntry = z.infer<typeof historyEntrySchema>

export const documentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  url: z.string().min(1),
})
export type Document = z.infer<typeof documentSchema>

export const bookingSchema = z.object({
  id: bookingIdSchema,
  bookingNumber: z.string().min(1),
  status: bookingStatusSchema,
  bookingType: bookingTypeSchema,
  createdDate: z.string().min(1),
  updatedDate: z.string().min(1),
})
export type Booking = z.infer<typeof bookingSchema>

/** Aggregate used for create/update validation (rules in shared/domain). */
export const bookingAggregateSchema = bookingSchema.extend({
  passengers: z.array(passengerSchema).default([]),
  flights: z.array(flightSchema).default([]),
  payment: paymentSchema.nullable().default(null),
  timeline: z.array(timelineEventSchema).default([]),
  history: z.array(historyEntrySchema).default([]),
  documents: z.array(documentSchema).default([]),
})
export type BookingAggregate = z.infer<typeof bookingAggregateSchema>

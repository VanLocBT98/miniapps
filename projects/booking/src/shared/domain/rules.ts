import type {
  BookingAggregate,
  BookingStatus,
  BookingType,
  Passenger,
  Payment,
} from '../types/booking'

export function isBookingReadOnly(status: BookingStatus): boolean {
  return status === 'Cancelled' || status === 'Completed'
}

export function isBookingEditable(status: BookingStatus): boolean {
  return !isBookingReadOnly(status)
}

export function canSetTicketed(payment: Payment | null | undefined): boolean {
  return Boolean(payment)
}

export function hasMinPassengers(passengers: Passenger[]): boolean {
  return passengers.length >= 1
}

export function hasMinFlights(flights: { length: number }): boolean {
  return flights.length >= 1
}

export function requiresPassport(bookingType: BookingType): boolean {
  return bookingType === 'international'
}

export function passengerHasPassport(passenger: Passenger): boolean {
  return Boolean(passenger.passportNumber?.trim())
}

export function assertPassportsForInternational(
  bookingType: BookingType,
  passengers: Passenger[],
): string | null {
  if (!requiresPassport(bookingType)) return null
  const missing = passengers.filter((p) => !passengerHasPassport(p))
  if (missing.length === 0) return null
  return `Passport required for international booking (missing: ${missing
    .map((p) => p.id)
    .join(', ')})`
}

/** Booking numbers must be unique within a collection. */
export function assertUniqueBookingNumbers(numbers: string[]): string | null {
  const seen = new Set<string>()
  for (const n of numbers) {
    if (seen.has(n)) return `Duplicate booking number: ${n}`
    seen.add(n)
  }
  return null
}

export type RuleIssue = { code: string; message: string }

/**
 * Validate an aggregate against business rules (07-business-rules.md).
 * Does not enforce uniqueness across a DB — use `assertUniqueBookingNumbers` at list/create time.
 */
export function validateBookingAggregate(
  booking: BookingAggregate,
  opts?: { targetStatus?: BookingStatus },
): RuleIssue[] {
  const issues: RuleIssue[] = []
  const status = opts?.targetStatus ?? booking.status

  if (!hasMinPassengers(booking.passengers)) {
    issues.push({
      code: 'passenger.min',
      message: 'At least one passenger is required',
    })
  }
  if (!hasMinFlights(booking.flights)) {
    issues.push({
      code: 'flight.min',
      message: 'At least one flight is required',
    })
  }

  const passportIssue = assertPassportsForInternational(
    booking.bookingType,
    booking.passengers,
  )
  if (passportIssue) {
    issues.push({ code: 'passenger.passport', message: passportIssue })
  }

  if (status === 'Ticketed' && !canSetTicketed(booking.payment)) {
    issues.push({
      code: 'payment.required',
      message: 'Payment must exist before status can become Ticketed',
    })
  }

  if (opts?.targetStatus && isBookingReadOnly(booking.status)) {
    issues.push({
      code: 'booking.readonly',
      message: `${booking.status} bookings cannot be edited`,
    })
  }

  return issues
}

export function createHistoryEntry(input: {
  id: string
  action: string
  user: string
  createdDate?: string
}) {
  return {
    id: input.id,
    action: input.action,
    user: input.user,
    createdDate: input.createdDate ?? new Date().toISOString(),
  }
}

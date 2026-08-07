import {
  assertPassportsForInternational,
  hasMinPassengers,
} from '@/shared/domain'
import type { BookingType, Passenger } from '@/shared/types'

export type PassengerRuleIssue = { code: string; message: string }

/** Client-side passenger rules for a booking (min 1 + passport for international). */
export function validatePassengersForBooking(
  bookingType: BookingType,
  passengers: Passenger[],
): PassengerRuleIssue[] {
  const issues: PassengerRuleIssue[] = []
  if (!hasMinPassengers(passengers)) {
    issues.push({
      code: 'passenger.min',
      message: 'At least one passenger is required',
    })
  }
  const passport = assertPassportsForInternational(bookingType, passengers)
  if (passport) {
    issues.push({ code: 'passenger.passport', message: passport })
  }
  return issues
}

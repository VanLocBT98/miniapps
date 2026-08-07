import { hasMinFlights } from '@/shared/domain'
import type { Flight } from '@/shared/types'

export type FlightRuleIssue = { code: string; message: string }

/** Client-side flight rules for a booking (at least one flight). */
export function validateFlightsForBooking(
  flights: Flight[],
): FlightRuleIssue[] {
  const issues: FlightRuleIssue[] = []
  if (!hasMinFlights(flights)) {
    issues.push({
      code: 'flight.min',
      message: 'At least one flight is required',
    })
  }
  return issues
}

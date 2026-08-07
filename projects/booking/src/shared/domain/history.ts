import type {
  BookingAggregate,
  BookingStatus,
  BookingType,
  Document,
  Flight,
  Passenger,
  Payment,
} from '../types/booking'

/** Subset of update fields used to describe history/timeline actions. */
export type BookingUpdatePatch = {
  status?: BookingStatus
  bookingNumber?: string
  bookingType?: BookingType
  passengers?: Passenger[]
  flights?: Flight[]
  payment?: Payment | null
  documents?: Document[]
}

/** Human-readable history/timeline actions for a mock update patch. */
export function describeBookingUpdateActions(
  current: BookingAggregate,
  patch: BookingUpdatePatch,
): string[] {
  const actions: string[] = []

  if (patch.status !== undefined && patch.status !== current.status) {
    actions.push(`Status changed to ${patch.status}`)
  }
  if (
    patch.bookingNumber !== undefined &&
    patch.bookingNumber !== current.bookingNumber
  ) {
    actions.push(`Booking number set to ${patch.bookingNumber}`)
  }
  if (
    patch.bookingType !== undefined &&
    patch.bookingType !== current.bookingType
  ) {
    actions.push(`Booking type set to ${patch.bookingType}`)
  }
  if (patch.passengers !== undefined) {
    actions.push(`Passengers updated (${patch.passengers.length})`)
  }
  if (patch.flights !== undefined) {
    actions.push(`Flights updated (${patch.flights.length})`)
  }
  if (patch.payment !== undefined) {
    actions.push(patch.payment ? 'Payment updated' : 'Payment removed')
  }
  if (patch.documents !== undefined) {
    actions.push(`Documents updated (${patch.documents.length})`)
  }

  return actions.length > 0 ? actions : ['Booking updated']
}

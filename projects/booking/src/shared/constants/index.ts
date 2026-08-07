export const PROJECT_ID = 'booking' as const
export const PROJECT_NAME = 'Booking' as const

/** Legacy calendar route — off by default (spec 03-routing). */
export const ENABLE_LEGACY_CALENDAR = false

export const bookingDetailTabs = [
  { id: 'overview', label: 'Overview', to: '/booking/$bookingId/' },
  { id: 'passengers', label: 'Passengers', to: '/booking/$bookingId/passengers' },
  { id: 'flights', label: 'Flights', to: '/booking/$bookingId/flights' },
  { id: 'payment', label: 'Payment', to: '/booking/$bookingId/payment' },
  { id: 'documents', label: 'Documents', to: '/booking/$bookingId/documents' },
  { id: 'history', label: 'History', to: '/booking/$bookingId/history' },
] as const

export type BookingDetailTabId = (typeof bookingDetailTabs)[number]['id']

/** Infer active detail tab from the current pathname. */
export function bookingTabFromPathname(pathname: string): BookingDetailTabId {
  const path = pathname.replace(/\/+$/, '')
  if (path.endsWith('/passengers')) return 'passengers'
  if (path.endsWith('/flights')) return 'flights'
  if (path.endsWith('/payment')) return 'payment'
  if (path.endsWith('/documents')) return 'documents'
  if (path.endsWith('/history')) return 'history'
  return 'overview'
}

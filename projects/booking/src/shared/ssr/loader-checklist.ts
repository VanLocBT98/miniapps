/**
 * SSR loader checklist (09-ssr) — keep in sync with host + standalone routes.
 * Each entry must `ensureQueryData` for listed query options.
 */
export const bookingSsrLoaderChecklist = [
  {
    route: '/booking',
    queries: ['bookingsQueryOptions'],
    head: 'bookingListHead',
  },
  {
    route: '/booking/$bookingId',
    queries: ['bookingDetailQueryOptions'],
    head: 'bookingDetailHead',
  },
  {
    route: '/booking/$bookingId/passengers',
    queries: ['bookingDetailQueryOptions', 'bookingPassengersQueryOptions'],
    head: 'bookingDetailHead',
  },
  {
    route: '/booking/$bookingId/flights',
    queries: ['bookingDetailQueryOptions', 'bookingFlightsQueryOptions'],
    head: 'bookingDetailHead',
  },
  {
    route: '/booking/$bookingId/payment',
    queries: ['bookingDetailQueryOptions', 'bookingPaymentQueryOptions'],
    head: 'bookingDetailHead',
  },
  {
    route: '/booking/$bookingId/documents',
    queries: ['bookingDetailQueryOptions', 'bookingDocumentsQueryOptions'],
    head: 'bookingDetailHead',
  },
  {
    route: '/booking/$bookingId/history',
    queries: [
      'bookingDetailQueryOptions',
      'bookingHistoryQueryOptions',
      'bookingTimelineQueryOptions',
    ],
    head: 'bookingDetailHead',
  },
] as const

import type { QueryClient } from '@tanstack/react-query'
import { bookingKeys, customerKeys } from './query-keys'

/** Invalidate list + optional detail subtree after mutations. */
export function invalidateBookingQueries(
  queryClient: QueryClient,
  bookingId?: string,
) {
  void queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
  if (bookingId) {
    void queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) })
  } else {
    void queryClient.invalidateQueries({ queryKey: bookingKeys.details() })
  }
}

export function invalidateCustomerQueries(
  queryClient: QueryClient,
  customerId?: string,
) {
  void queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
  if (customerId) {
    void queryClient.invalidateQueries({
      queryKey: customerKeys.detail(customerId),
    })
  } else {
    void queryClient.invalidateQueries({ queryKey: customerKeys.details() })
  }
}

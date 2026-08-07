import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { ApiEnvelope } from '@/shared/types'
import {
  createBooking,
  deleteBooking,
  getBooking,
  getBookingFlights,
  getBookingHistory,
  getBookingPassengers,
  getBookingPayment,
  getBookingDocuments,
  getBookingTimeline,
  listBookings,
  updateBooking,
  type BookingListFilters,
  type CreateBookingInput,
  type UpdateBookingInput,
} from './booking-service'
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
  type CreateCustomerInput,
  type CustomerListFilters,
  type UpdateCustomerInput,
} from './customer-service'
import { bookingKeys, customerKeys } from './query-keys'

export type {
  BookingListFilters,
  BookingListItem,
  CreateBookingInput,
  UpdateBookingInput,
} from './booking-service'
export type {
  CreateCustomerInput,
  CustomerListFilters,
  DeleteCustomerResult,
  UpdateCustomerInput,
} from './customer-service'
export type { Booking, BookingAggregate, Customer } from '@/shared/types'
export {
  createBooking,
  deleteBooking,
  getBooking,
  getBookingFlights,
  getBookingHistory,
  getBookingPassengers,
  getBookingPayment,
  getBookingDocuments,
  getBookingTimeline,
  listBookings,
  updateBooking,
} from './booking-service'
export {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from './customer-service'
export { resetBookingDb, resetCustomerDb } from './mock-db'
export { bookingKeys, customerKeys } from './query-keys'

/** Unwrap envelope for TanStack Query — throw on failure only (`data: null` can be valid). */
export function unwrapEnvelope<T>(envelope: ApiEnvelope<T>): T {
  if (!envelope.success) {
    throw new Error(envelope.error?.message ?? 'Request failed')
  }
  // Successful responses may intentionally return null (e.g. no payment yet).
  return envelope.data as T
}

/** List with optional filters. */
export const bookingListQueryOptions = (filters: BookingListFilters = {}) =>
  queryOptions({
    queryKey: bookingKeys.list(filters),
    queryFn: async () => unwrapEnvelope(await listBookings(filters)),
  })

/**
 * Default list (no filters).
 * Historical name used by host loaders + pages — keep as QueryOptions object.
 */
export const bookingsQueryOptions = bookingListQueryOptions()

export const bookingDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.detail(id),
    queryFn: async () => unwrapEnvelope(await getBooking(id)),
  })

export const bookingHistoryQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.history(id),
    queryFn: async () => unwrapEnvelope(await getBookingHistory(id)),
  })

export const bookingTimelineQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.timeline(id),
    queryFn: async () => unwrapEnvelope(await getBookingTimeline(id)),
  })

export const bookingPassengersQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.passengers(id),
    queryFn: async () => unwrapEnvelope(await getBookingPassengers(id)),
  })

export const bookingFlightsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.flights(id),
    queryFn: async () => unwrapEnvelope(await getBookingFlights(id)),
  })

export const bookingPaymentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.payment(id),
    queryFn: async () => unwrapEnvelope(await getBookingPayment(id)),
  })

export const bookingDocumentsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: bookingKeys.documents(id),
    queryFn: async () => unwrapEnvelope(await getBookingDocuments(id)),
  })

export const createBookingMutationOptions = mutationOptions({
  mutationKey: [...bookingKeys.all, 'create'],
  mutationFn: async (input: CreateBookingInput) =>
    unwrapEnvelope(await createBooking(input)),
})

export const updateBookingMutationOptions = mutationOptions({
  mutationKey: [...bookingKeys.all, 'update'],
  mutationFn: async (vars: { id: string; input: UpdateBookingInput }) =>
    unwrapEnvelope(await updateBooking(vars.id, vars.input)),
})

export const deleteBookingMutationOptions = mutationOptions({
  mutationKey: [...bookingKeys.all, 'delete'],
  mutationFn: async (id: string) => unwrapEnvelope(await deleteBooking(id)),
})

/** Customer list with optional search / filter / pagination / sort. */
export const customerListQueryOptions = (filters: CustomerListFilters = {}) =>
  queryOptions({
    queryKey: customerKeys.list(filters),
    queryFn: async () => unwrapEnvelope(await listCustomers(filters)),
  })

export const customersQueryOptions = customerListQueryOptions()

export const customerDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: customerKeys.detail(id),
    queryFn: async () => unwrapEnvelope(await getCustomer(id)),
  })

export const createCustomerMutationOptions = mutationOptions({
  mutationKey: [...customerKeys.all, 'create'],
  mutationFn: async (input: CreateCustomerInput) =>
    unwrapEnvelope(await createCustomer(input)),
})

export const updateCustomerMutationOptions = mutationOptions({
  mutationKey: [...customerKeys.all, 'update'],
  mutationFn: async (vars: { id: string; input: UpdateCustomerInput }) =>
    unwrapEnvelope(await updateCustomer(vars.id, vars.input)),
})

export const deleteCustomerMutationOptions = mutationOptions({
  mutationKey: [...customerKeys.all, 'delete'],
  mutationFn: async (id: string) => unwrapEnvelope(await deleteCustomer(id)),
})

export { invalidateBookingQueries, invalidateCustomerQueries } from './invalidate'
export {
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useUpdatePassengersMutation,
  useUpdateFlightsMutation,
  useUpdatePaymentMutation,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from './mutations'

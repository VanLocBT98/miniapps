import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@repo/ui'
import type { Passenger, Flight, Payment } from '@/shared/types'
import {
  createBookingMutationOptions,
  createCustomerMutationOptions,
  deleteBookingMutationOptions,
  deleteCustomerMutationOptions,
  updateBookingMutationOptions,
  updateCustomerMutationOptions,
  unwrapEnvelope,
  updateBooking,
} from './apis'
import {
  invalidateBookingQueries,
  invalidateCustomerQueries,
} from './invalidate'
import type { CreateBookingInput, UpdateBookingInput } from './booking-service'
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from './customer-service'

function onMutError(err: unknown, fallback: string) {
  toast({
    title: fallback,
    description: err instanceof Error ? err.message : undefined,
    variant: 'error',
  })
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...createBookingMutationOptions,
    onSuccess: (data) => {
      toast({
        title: 'Booking created',
        description: data.bookingNumber,
        variant: 'success',
      })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Create booking failed'),
  })
}

export function useUpdateBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...updateBookingMutationOptions,
    onSuccess: (data) => {
      toast({
        title: 'Booking updated',
        description: data.bookingNumber,
        variant: 'success',
      })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Update booking failed'),
  })
}

export function useDeleteBookingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...deleteBookingMutationOptions,
    onSuccess: (data) => {
      toast({ title: 'Booking deleted', variant: 'success' })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Delete booking failed'),
  })
}

/** Patch passengers via updateBooking + invalidate. */
export function useUpdatePassengersMutation(bookingId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...updateBookingMutationOptions.mutationKey!, 'passengers'],
    mutationFn: async (passengers: Passenger[]) =>
      unwrapEnvelope(await updateBooking(bookingId, { passengers })),
    onSuccess: (data) => {
      toast({ title: 'Passengers updated', variant: 'success' })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Update passengers failed'),
  })
}

export function useUpdateFlightsMutation(bookingId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...updateBookingMutationOptions.mutationKey!, 'flights'],
    mutationFn: async (flights: Flight[]) =>
      unwrapEnvelope(await updateBooking(bookingId, { flights })),
    onSuccess: (data) => {
      toast({ title: 'Flights updated', variant: 'success' })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Update flights failed'),
  })
}

export function useUpdatePaymentMutation(bookingId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...updateBookingMutationOptions.mutationKey!, 'payment'],
    mutationFn: async (payment: Payment | null) =>
      unwrapEnvelope(await updateBooking(bookingId, { payment })),
    onSuccess: (data) => {
      toast({ title: 'Payment updated', variant: 'success' })
      invalidateBookingQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Update payment failed'),
  })
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...createCustomerMutationOptions,
    onSuccess: (data) => {
      toast({
        title: 'Customer created',
        description: data.customerCode,
        variant: 'success',
      })
      invalidateCustomerQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Create customer failed'),
  })
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...updateCustomerMutationOptions,
    onSuccess: (data) => {
      toast({
        title: 'Customer updated',
        description: data.customerCode,
        variant: 'success',
      })
      invalidateCustomerQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Update customer failed'),
  })
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    ...deleteCustomerMutationOptions,
    onSuccess: (data) => {
      toast({
        title: 'Customer deleted',
        description: 'Hidden from list (soft delete)',
        variant: 'success',
      })
      invalidateCustomerQueries(queryClient, data.id)
    },
    onError: (err) => onMutError(err, 'Delete customer failed'),
  })
}

export type { CreateBookingInput, UpdateBookingInput }
export type { CreateCustomerInput, UpdateCustomerInput }

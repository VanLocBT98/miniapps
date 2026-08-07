import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { invalidateBookingQueries } from './invalidate'
import { bookingKeys } from './query-keys'

describe('invalidateBookingQueries', () => {
  it('invalidates lists and detail when id provided', () => {
    const queryClient = new QueryClient()
    const spy = vi.spyOn(queryClient, 'invalidateQueries')
    invalidateBookingQueries(queryClient, 'b-1')
    expect(spy).toHaveBeenCalledWith({ queryKey: bookingKeys.lists() })
    expect(spy).toHaveBeenCalledWith({ queryKey: bookingKeys.detail('b-1') })
  })
})

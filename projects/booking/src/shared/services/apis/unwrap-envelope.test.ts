import { describe, expect, it } from 'vitest'
import { unwrapEnvelope } from './apis'
import { failEnvelope, okEnvelope } from '@/shared/types'

describe('unwrapEnvelope', () => {
  it('returns null data on successful null payload', () => {
    expect(unwrapEnvelope(okEnvelope(null))).toBeNull()
  })

  it('returns data on success', () => {
    expect(unwrapEnvelope(okEnvelope({ id: '1' }))).toEqual({ id: '1' })
  })

  it('throws on failure even when data is null', () => {
    expect(() =>
      unwrapEnvelope(
        failEnvelope({ code: 'x', message: 'Booking not found' }),
      ),
    ).toThrow('Booking not found')
  })
})

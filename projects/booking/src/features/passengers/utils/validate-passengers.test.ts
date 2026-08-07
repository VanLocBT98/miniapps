import { describe, expect, it } from 'vitest'
import { validatePassengersForBooking } from './validate-passengers'
import type { Passenger } from '@/shared/types'

const base: Passenger = {
  id: 'p-1',
  firstName: 'An',
  lastName: 'Nguyen',
  gender: 'female',
  birthday: '1995-01-01',
}

describe('validatePassengersForBooking', () => {
  it('requires at least one passenger', () => {
    const issues = validatePassengersForBooking('domestic', [])
    expect(issues.some((i) => i.code === 'passenger.min')).toBe(true)
  })

  it('requires passport for international', () => {
    const issues = validatePassengersForBooking('international', [base])
    expect(issues.some((i) => i.code === 'passenger.passport')).toBe(true)
  })

  it('passes international with passport', () => {
    const issues = validatePassengersForBooking('international', [
      { ...base, passportNumber: 'C1234567' },
    ])
    expect(issues).toEqual([])
  })
})

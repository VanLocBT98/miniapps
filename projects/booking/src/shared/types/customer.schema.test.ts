import { describe, expect, it } from 'vitest'
import { customerSchema } from './customer'

const valid = {
  id: 'c-1',
  customerCode: 'CUS-1',
  customerType: 'Individual' as const,
  fullName: 'Test User',
  gender: 'other' as const,
  birthday: '1990-01-01',
  nationality: 'VN',
  owner: 'agent',
  source: 'Manual' as const,
  status: 'Active' as const,
  createdBy: 'system',
  createdDate: '2026-08-06T00:00:00.000Z',
  updatedBy: 'system',
  updatedDate: '2026-08-06T00:00:00.000Z',
}

describe('customerSchema', () => {
  it('parses a valid customer', () => {
    const res = customerSchema.safeParse(valid)
    expect(res.success).toBe(true)
  })

  it('allows optional phone and email', () => {
    const res = customerSchema.safeParse(valid)
    expect(res.success).toBe(true)
    if (res.success) {
      expect(res.data.phone).toBeUndefined()
      expect(res.data.email).toBeUndefined()
    }
  })

  it('rejects invalid email when provided', () => {
    const res = customerSchema.safeParse({
      ...valid,
      email: 'not-an-email',
    })
    expect(res.success).toBe(false)
  })

  it('rejects missing customerCode', () => {
    const { customerCode: _omit, ...rest } = valid
    const res = customerSchema.safeParse(rest)
    expect(res.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const res = customerSchema.safeParse({ ...valid, status: 'Pending' })
    expect(res.success).toBe(false)
  })
})

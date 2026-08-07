import { describe, expect, it } from 'vitest'
import {
  assertCustomerPassport,
  assertCustomerSelectable,
  assertUniqueCustomerCodes,
} from './customer-rules'
import type { Customer } from '../types/customer'

const base: Customer = {
  id: 'c-1',
  customerCode: 'CUS-1',
  customerType: 'Individual',
  fullName: 'Test',
  gender: 'other',
  birthday: '2000-01-01',
  nationality: 'VN',
  owner: 'agent',
  source: 'Manual',
  status: 'Active',
  createdBy: 'system',
  createdDate: '2026-01-01T00:00:00.000Z',
  updatedBy: 'system',
  updatedDate: '2026-01-01T00:00:00.000Z',
}

describe('customer rules', () => {
  it('detects duplicate codes case-insensitively', () => {
    expect(assertUniqueCustomerCodes(['A', 'a'])).toMatch(/Duplicate/)
  })

  it('requires passport for international travelers', () => {
    expect(
      assertCustomerPassport({ passportCountry: 'US', passportNumber: '' }),
    ).toMatch(/Passport/)
    expect(
      assertCustomerPassport({
        passportCountry: 'US',
        passportNumber: 'P1',
      }),
    ).toBeNull()
  })

  it('blocks inactive customers from booking selection', () => {
    expect(
      assertCustomerSelectable({ ...base, status: 'Inactive' }),
    ).toMatch(/Active/)
    expect(assertCustomerSelectable(base)).toBeNull()
  })
})

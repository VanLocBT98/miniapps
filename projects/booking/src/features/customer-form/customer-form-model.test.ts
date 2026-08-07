import { describe, expect, it } from 'vitest'
import {
  emptyCustomerFormValues,
  validateCustomerForm,
} from './customer-form-model'

describe('validateCustomerForm', () => {
  it('requires full name and owner', () => {
    const result = validateCustomerForm(
      emptyCustomerFormValues({ fullName: '', owner: '' }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.form).toBeTruthy()
    }
  })

  it('requires passport when passport country set', () => {
    const result = validateCustomerForm(
      emptyCustomerFormValues({
        fullName: 'Test User',
        owner: 'agent',
        birthday: '1990-01-01',
        passportCountry: 'US',
        passportNumber: '',
      }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.passportNumber).toMatch(/Passport/)
    }
  })

  it('allows optional email and phone', () => {
    const result = validateCustomerForm(
      emptyCustomerFormValues({
        fullName: 'Test User',
        owner: 'agent',
        birthday: '1990-01-01',
        email: '',
        phone: '',
      }),
    )
    expect(result.ok).toBe(true)
  })
})

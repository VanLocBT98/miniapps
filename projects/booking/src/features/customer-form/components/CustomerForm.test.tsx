/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomerForm } from './CustomerForm'
import {
  emptyCustomerFormValues,
  type CustomerFormValues,
} from '../customer-form-model'

describe('CustomerForm smoke', () => {
  it('renders sections and submits values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onChange = vi.fn()
    const values: CustomerFormValues = emptyCustomerFormValues({
      fullName: 'An Nguyen',
      owner: 'agent.one',
      birthday: '1994-03-12',
    })

    render(
      <CustomerForm
        values={values}
        errors={{}}
        submitLabel="Create customer"
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    )

    expect(screen.getByText('General Information')).toBeInTheDocument()
    expect(screen.getByText('Travel Information')).toBeInTheDocument()
    expect(screen.getByText('Contact Information')).toBeInTheDocument()
    expect(screen.getByText('Bank Information')).toBeInTheDocument()
    expect(screen.getByText('Internal Information')).toBeInTheDocument()
    expect(screen.getByDisplayValue('An Nguyen')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create customer' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('shows form-level error', () => {
    render(
      <CustomerForm
        values={emptyCustomerFormValues()}
        errors={{ form: 'Passport number is required for international travelers' }}
        submitLabel="Save"
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    expect(
      screen.getByText('Passport number is required for international travelers'),
    ).toBeInTheDocument()
  })
})

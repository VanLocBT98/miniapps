/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomerDeleteDialog } from './CustomerDeleteDialog'
import type { Customer } from '@/shared/types'

const sample: Customer = {
  id: 'c-1001',
  customerCode: 'CUS-1001',
  customerType: 'Individual',
  fullName: 'An Nguyen',
  gender: 'female',
  birthday: '1994-03-12',
  nationality: 'VN',
  owner: 'agent.one',
  source: 'Manual',
  status: 'Active',
  createdBy: 'system',
  createdDate: '2026-08-06T00:00:00.000Z',
  updatedBy: 'system',
  updatedDate: '2026-08-06T00:00:00.000Z',
}

describe('CustomerDeleteDialog', () => {
  it('confirms delete and explains soft-delete', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(
      <CustomerDeleteDialog
        customer={sample}
        open
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByText(/CUS-1001/)).toBeInTheDocument()
    expect(screen.getByText(/soft-deleted/i)).toBeInTheDocument()
    expect(screen.getByText(/deleted_at/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirm delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})

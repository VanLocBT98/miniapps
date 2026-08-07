/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CustomerListTable } from './CustomerListTable'
import type { Customer } from '@/shared/types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: React.ReactNode
    to: string
    params?: Record<string, string>
  }) => (
    <a href={params?.customerId ? `${to}/${params.customerId}` : to}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}))

const sample: Customer = {
  id: 'c-1001',
  customerCode: 'CUS-1001',
  customerType: 'Individual',
  fullName: 'An Nguyen',
  gender: 'female',
  birthday: '1994-03-12',
  nationality: 'VN',
  phone: '+84901234567',
  email: 'an.nguyen@example.com',
  passportNumber: 'C1234567',
  owner: 'agent.one',
  source: 'Manual',
  status: 'Active',
  createdBy: 'system',
  createdDate: '2026-08-06T00:00:00.000Z',
  updatedBy: 'system',
  updatedDate: '2026-08-06T00:00:00.000Z',
}

describe('CustomerListTable smoke', () => {
  it('renders customer columns and actions', () => {
    render(<CustomerListTable rows={[sample]} />)
    expect(screen.getByText('CUS-1001')).toBeInTheDocument()
    expect(screen.getByText('An Nguyen')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
})

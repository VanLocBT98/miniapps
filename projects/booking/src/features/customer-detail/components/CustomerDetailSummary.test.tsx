/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CustomerDetailSummary } from './CustomerDetailSections'
import type { Customer } from '@/shared/types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
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
  department: 'Sales',
  source: 'Manual',
  status: 'Active',
  createdBy: 'system',
  createdDate: '2026-08-06T00:00:00.000Z',
  updatedBy: 'system',
  updatedDate: '2026-08-06T00:00:00.000Z',
}

describe('CustomerDetailSummary smoke', () => {
  it('renders summary chips', () => {
    render(<CustomerDetailSummary customer={sample} />)
    expect(screen.getByText('Individual')).toBeInTheDocument()
    expect(screen.getByText('agent.one')).toBeInTheDocument()
    expect(screen.getByText('+84901234567')).toBeInTheDocument()
  })
})

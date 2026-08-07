/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingListTable } from './BookingListTable'
import type { BookingListItem } from '@/shared/services/mappers'

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
    <a href={params?.bookingId ? `${to}/${params.bookingId}` : to}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}))

const row: BookingListItem = {
  id: 'b-1001',
  bookingNumber: 'BK-1001',
  status: 'Confirmed',
  bookingType: 'domestic',
  createdDate: '2026-08-01T00:00:00.000Z',
  updatedDate: '2026-08-01T00:00:00.000Z',
  guest: 'An Nguyen',
  amount: 240,
  departureTime: '2026-08-10T08:00:00.000Z',
}

describe('BookingListTable smoke', () => {
  it('renders booking number, guest, and actions', () => {
    render(<BookingListTable rows={[row]} />)
    expect(screen.getByText('BK-1001')).toBeInTheDocument()
    expect(screen.getByText('An Nguyen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })
})

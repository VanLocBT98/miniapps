/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PassengerTable } from './PassengerTable'
import type { Passenger } from '@/shared/types'

const passengers: Passenger[] = [
  {
    id: 'p-1',
    firstName: 'An',
    lastName: 'Nguyen',
    gender: 'female',
    birthday: '1994-03-12',
    passportNumber: 'C123',
  },
]

describe('PassengerTable smoke', () => {
  it('renders passenger rows', () => {
    const onRemove = vi.fn()
    render(
      <PassengerTable
        passengers={passengers}
        readOnly={false}
        onRemove={onRemove}
      />,
    )
    expect(screen.getByText('An')).toBeInTheDocument()
    expect(screen.getByText('Nguyen')).toBeInTheDocument()
    expect(screen.getByText('C123')).toBeInTheDocument()
  })
})

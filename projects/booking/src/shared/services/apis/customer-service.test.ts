import { describe, expect, it, beforeEach } from 'vitest'
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from './customer-service'
import { resetCustomerDb } from './mock-db'

describe('customer API envelope', () => {
  beforeEach(() => {
    resetCustomerDb()
  })

  it('lists customers in success envelope', async () => {
    const res = await listCustomers()
    expect(res.success).toBe(true)
    expect(res.error).toBeNull()
    expect(res.data?.length).toBeGreaterThan(0)
    expect(res.meta?.total).toBe(res.data?.length)
  })

  it('returns not_found for missing detail', async () => {
    const res = await getCustomer('missing')
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe('customer.not_found')
  })

  it('rejects duplicate customer code', async () => {
    const res = await createCustomer({
      customerCode: 'CUS-1001',
      customerType: 'Individual',
      fullName: 'Dup',
      gender: 'other',
      birthday: '1990-01-01',
      nationality: 'VN',
      owner: 'agent',
      source: 'Manual',
      status: 'Active',
    })
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe('customer.duplicate_code')
  })

  it('requires passport when passportCountry is set', async () => {
    const res = await createCustomer({
      customerCode: 'CUS-NEW-1',
      customerType: 'Individual',
      fullName: 'Intl Traveler',
      gender: 'female',
      birthday: '1992-02-02',
      nationality: 'VN',
      passportCountry: 'US',
      owner: 'agent',
      source: 'Manual',
      status: 'Active',
    })
    expect(res.success).toBe(false)
    expect(res.error?.code).toBe('customer.rules')
  })

  it('creates a customer when rules pass', async () => {
    const res = await createCustomer({
      customerCode: 'CUS-NEW-2',
      customerType: 'Individual',
      fullName: 'New Person',
      gender: 'male',
      birthday: '1991-03-03',
      nationality: 'VN',
      owner: 'agent',
      source: 'Manual',
      status: 'Active',
    })
    expect(res.success).toBe(true)
    expect(res.data?.customerCode).toBe('CUS-NEW-2')
  })

  it('soft-deletes and hides from list/detail', async () => {
    const res = await deleteCustomer('c-1001')
    expect(res.success).toBe(true)
    expect(res.data?.deleted).toBe(true)
    expect(res.data?.softDeactivated).toBe(true)

    const detail = await getCustomer('c-1001')
    expect(detail.success).toBe(false)

    const list = await listCustomers({ q: 'CUS-1001' })
    expect(list.data?.some((c) => c.id === 'c-1001')).toBe(false)
  })

  it('soft-deletes customers without related bookings the same way', async () => {
    const res = await deleteCustomer('c-1002')
    expect(res.success).toBe(true)
    expect(res.data?.deleted).toBe(true)
    const detail = await getCustomer('c-1002')
    expect(detail.success).toBe(false)
  })

  it('updates customer fields', async () => {
    const res = await updateCustomer('c-1002', { fullName: 'Acme Renamed' })
    expect(res.success).toBe(true)
    expect(res.data?.fullName).toBe('Acme Renamed')
  })

  it('filters by status and search query', async () => {
    const active = await listCustomers({ status: 'Active' })
    expect(active.success).toBe(true)
    expect(active.data?.every((c) => c.status === 'Active')).toBe(true)

    const search = await listCustomers({ q: 'CUS-1001' })
    expect(search.success).toBe(true)
    expect(search.data?.some((c) => c.customerCode === 'CUS-1001')).toBe(true)
  })

  it('sorts by fullName ascending', async () => {
    const res = await listCustomers({ sortBy: 'fullName', sortDir: 'asc' })
    expect(res.success).toBe(true)
    const names = res.data!.map((c) => c.fullName)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })
})

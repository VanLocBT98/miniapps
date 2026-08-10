import { z } from 'zod'
import { assertUniqueCustomerCodes, validateCustomer } from '@/shared/domain'
import {
  customerSchema,
  failEnvelope,
  okEnvelope,
  type ApiEnvelope,
  type Customer,
  type CustomerStatus,
  type CustomerType,
  type CustomerSource,
} from '@/shared/types'
import { customerDb } from './mock-db'

export type CustomerListFilters = {
  q?: string
  status?: CustomerStatus | string
  customerType?: CustomerType | string
  source?: CustomerSource | string
  owner?: string
  page?: number
  pageSize?: number
  sortBy?: keyof Customer | string
  sortDir?: 'asc' | 'desc'
}

export const createCustomerInputSchema = customerSchema
  .omit({
    id: true,
    createdDate: true,
    updatedDate: true,
    createdBy: true,
    updatedBy: true,
  })
  .partial({
    phone: true,
    email: true,
    address: true,
    passportNumber: true,
    passportExpiredDate: true,
    passportCountry: true,
    identityNumber: true,
    bankName: true,
    accountNumber: true,
    accountName: true,
    swiftCode: true,
    department: true,
  })
  .extend({
    status: customerSchema.shape.status.default('Active'),
    source: customerSchema.shape.source.default('Manual'),
    createdBy: z.string().min(1).optional(),
  })

export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>

export const updateCustomerInputSchema = createCustomerInputSchema.partial()

export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>

export type DeleteCustomerResult = {
  id: string
  deleted: boolean
  softDeactivated: boolean
  customer?: Customer
}

function delay(ms = 20) {
  return new Promise((r) => setTimeout(r, ms))
}

function findIndex(id: string) {
  return customerDb.rows.findIndex((c) => c.id === id)
}

function isVisible(id: string) {
  return !customerDb.deletedIds.has(id)
}

function normalizeEmail(email: string | undefined): string | undefined {
  if (email == null || email === '') return undefined
  return email
}

function sortCustomers(
  rows: Customer[],
  sortBy?: string,
  sortDir: 'asc' | 'desc' = 'asc',
): Customer[] {
  if (!sortBy) return rows
  const dir = sortDir === 'desc' ? -1 : 1
  return [...rows].sort((a, b) => {
    const av = a[sortBy as keyof Customer]
    const bv = b[sortBy as keyof Customer]
    const aStr = av == null ? '' : String(av)
    const bStr = bv == null ? '' : String(bv)
    return aStr.localeCompare(bStr) * dir
  })
}

function isVitest() {
  return Boolean(import.meta.env.VITEST)
}

async function withPostgresOrMock<T>(
  viaServer: () => Promise<ApiEnvelope<T>>,
  viaMock: () => Promise<ApiEnvelope<T>>,
): Promise<ApiEnvelope<T>> {
  if (isVitest()) return viaMock()
  try {
    const res = await viaServer()
    if (res.error?.code === 'db.unavailable') return viaMock()
    return res
  } catch (error) {
    // Production with DATABASE_URL must not silently write to in-memory mock.
    if (import.meta.env.PROD) {
      console.error(
        '[customer] server fn failed; not falling back to mock',
        error,
      )
      return failEnvelope({
        code: 'customer.server_error',
        message:
          error instanceof Error ? error.message : 'Customer API unavailable',
      })
    }
    return viaMock()
  }
}

async function listCustomersMock(
  filters: CustomerListFilters = {},
): Promise<ApiEnvelope<Customer[]>> {
  await delay()
  let rows = customerDb.rows.filter((r) => isVisible(r.id))

  if (filters.status) {
    rows = rows.filter((r) => r.status === filters.status)
  }
  if (filters.customerType) {
    rows = rows.filter((r) => r.customerType === filters.customerType)
  }
  if (filters.source) {
    rows = rows.filter((r) => r.source === filters.source)
  }
  if (filters.owner?.trim()) {
    const owner = filters.owner.trim().toLowerCase()
    rows = rows.filter((r) => r.owner.toLowerCase().includes(owner))
  }
  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase()
    rows = rows.filter(
      (r) =>
        r.customerCode.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        (r.phone?.toLowerCase().includes(q) ?? false) ||
        (r.email?.toLowerCase().includes(q) ?? false) ||
        (r.passportNumber?.toLowerCase().includes(q) ?? false) ||
        r.id.toLowerCase().includes(q),
    )
  }

  rows = sortCustomers(rows, filters.sortBy, filters.sortDir ?? 'asc')

  const total = rows.length
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.max(1, filters.pageSize ?? 20)
  const shouldPage = filters.page != null || filters.pageSize != null
  const paged = shouldPage
    ? rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    : rows

  return okEnvelope(paged, {
    total,
    page: shouldPage ? page : 1,
    pageSize: shouldPage ? pageSize : total,
  })
}

async function getCustomerMock(id: string): Promise<ApiEnvelope<Customer>> {
  await delay()
  if (!isVisible(id)) {
    return failEnvelope({
      code: 'customer.not_found',
      message: 'Customer not found',
    })
  }
  const customer = customerDb.rows.find((c) => c.id === id)
  if (!customer) {
    return failEnvelope({
      code: 'customer.not_found',
      message: 'Customer not found',
    })
  }
  return okEnvelope(customer)
}

async function createCustomerMock(
  input: CreateCustomerInput,
): Promise<ApiEnvelope<Customer>> {
  await delay()
  const parsed = createCustomerInputSchema.safeParse({
    ...input,
    email: normalizeEmail(input.email),
  })
  if (!parsed.success) {
    return failEnvelope({
      code: 'customer.invalid',
      message: parsed.error.issues[0]?.message ?? 'Invalid customer',
      details: parsed.error.flatten(),
    })
  }

  const data = parsed.data
  const dup = assertUniqueCustomerCodes([
    ...customerDb.rows.map((c) => c.customerCode),
    data.customerCode,
  ])
  if (dup) {
    return failEnvelope({ code: 'customer.duplicate_code', message: dup })
  }

  const ruleIssues = validateCustomer(data)
  if (ruleIssues.length > 0) {
    return failEnvelope({
      code: 'customer.rules',
      message: ruleIssues[0]!.message,
      details: ruleIssues,
    })
  }

  const stamp = new Date().toISOString()
  const actor = data.createdBy ?? 'agent'
  const customer: Customer = {
    ...data,
    id: `c-${Date.now()}`,
    email: normalizeEmail(data.email),
    phone: data.phone || undefined,
    createdBy: actor,
    updatedBy: actor,
    createdDate: stamp,
    updatedDate: stamp,
  }

  customerDb.rows = [...customerDb.rows, customer]
  return okEnvelope(customer)
}

async function updateCustomerMock(
  id: string,
  input: UpdateCustomerInput,
): Promise<ApiEnvelope<Customer>> {
  await delay()
  const idx = findIndex(id)
  if (idx < 0) {
    return failEnvelope({
      code: 'customer.not_found',
      message: 'Customer not found',
    })
  }

  const parsed = updateCustomerInputSchema.safeParse({
    ...input,
    email: input.email !== undefined ? normalizeEmail(input.email) : undefined,
  })
  if (!parsed.success) {
    return failEnvelope({
      code: 'customer.invalid',
      message: parsed.error.issues[0]?.message ?? 'Invalid customer',
      details: parsed.error.flatten(),
    })
  }

  const current = customerDb.rows[idx]!
  const next: Customer = {
    ...current,
    ...parsed.data,
    email:
      parsed.data.email !== undefined
        ? normalizeEmail(parsed.data.email)
        : current.email,
    id: current.id,
    createdBy: current.createdBy,
    createdDate: current.createdDate,
    updatedBy: parsed.data.createdBy ?? 'agent',
    updatedDate: new Date().toISOString(),
  }

  if (parsed.data.customerCode) {
    const others = customerDb.rows
      .filter((c) => c.id !== id)
      .map((c) => c.customerCode)
    const dup = assertUniqueCustomerCodes([...others, next.customerCode])
    if (dup) {
      return failEnvelope({ code: 'customer.duplicate_code', message: dup })
    }
  }

  const ruleIssues = validateCustomer(next)
  if (ruleIssues.length > 0) {
    return failEnvelope({
      code: 'customer.rules',
      message: ruleIssues[0]!.message,
      details: ruleIssues,
    })
  }

  const copy = [...customerDb.rows]
  copy[idx] = next
  customerDb.rows = copy
  return okEnvelope(next)
}

async function deleteCustomerMock(
  id: string,
): Promise<ApiEnvelope<DeleteCustomerResult>> {
  await delay()
  const idx = findIndex(id)
  if (idx < 0 || customerDb.deletedIds.has(id)) {
    return failEnvelope({
      code: 'customer.not_found',
      message: 'Customer not found',
    })
  }

  const current = customerDb.rows[idx]!
  const next: Customer = {
    ...current,
    status: 'Inactive',
    updatedBy: 'agent',
    updatedDate: new Date().toISOString(),
  }
  const copy = [...customerDb.rows]
  copy[idx] = next
  customerDb.rows = copy
  customerDb.deletedIds.add(id)

  return okEnvelope({
    id,
    deleted: true,
    softDeactivated: true,
    customer: next,
  })
}

export async function listCustomers(
  filters: CustomerListFilters = {},
): Promise<ApiEnvelope<Customer[]>> {
  return withPostgresOrMock(
    async () => {
      const { listCustomersFn } = await import('@/server/customer-fns')
      return (await listCustomersFn({ data: filters })) as ApiEnvelope<
        Customer[]
      >
    },
    () => listCustomersMock(filters),
  )
}

export async function getCustomer(id: string): Promise<ApiEnvelope<Customer>> {
  return withPostgresOrMock(
    async () => {
      const { getCustomerFn } = await import('@/server/customer-fns')
      return (await getCustomerFn({ data: { id } })) as ApiEnvelope<Customer>
    },
    () => getCustomerMock(id),
  )
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<ApiEnvelope<Customer>> {
  const parsed = createCustomerInputSchema.safeParse({
    ...input,
    email: normalizeEmail(input.email),
  })
  if (!parsed.success) {
    return failEnvelope({
      code: 'customer.invalid',
      message: parsed.error.issues[0]?.message ?? 'Invalid customer',
      details: parsed.error.flatten(),
    })
  }
  const ruleIssues = validateCustomer(parsed.data)
  if (ruleIssues.length > 0) {
    return failEnvelope({
      code: 'customer.rules',
      message: ruleIssues[0]!.message,
      details: ruleIssues,
    })
  }

  return withPostgresOrMock(
    async () => {
      const { createCustomerFn } = await import('@/server/customer-fns')
      const { department: _dept, ...rest } = parsed.data
      return (await createCustomerFn({ data: rest })) as ApiEnvelope<Customer>
    },
    () => createCustomerMock(input),
  )
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<ApiEnvelope<Customer>> {
  return withPostgresOrMock(
    async () => {
      const { updateCustomerFn } = await import('@/server/customer-fns')
      const { department: _dept, ...rest } = input
      return (await updateCustomerFn({
        data: { id, input: rest },
      })) as ApiEnvelope<Customer>
    },
    () => updateCustomerMock(id, input),
  )
}

export async function deleteCustomer(
  id: string,
): Promise<ApiEnvelope<DeleteCustomerResult>> {
  return withPostgresOrMock(
    async () => {
      const { deleteCustomerFn } = await import('@/server/customer-fns')
      return (await deleteCustomerFn({
        data: { id },
      })) as ApiEnvelope<DeleteCustomerResult>
    },
    () => deleteCustomerMock(id),
  )
}

import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { hasAnyPermission, sessionSchema } from '@repo/shared/auth'
import { hasDatabaseUrl } from '@repo/db'
import {
  createCustomerDb,
  deleteCustomerDb,
  getCustomerDb,
  listCustomersDb,
  updateCustomerDb,
  type CustomerListFilters,
  type CustomerWriteInput,
} from '@repo/db/customers'
import { z } from 'zod'

const AUTH_COOKIE = 'mfe_session'

const listFiltersSchema = z
  .object({
    q: z.string().optional(),
    status: z.string().optional(),
    customerType: z.string().optional(),
    source: z.string().optional(),
    owner: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
    sortBy: z.string().optional(),
    sortDir: z.enum(['asc', 'desc']).optional(),
  })
  .default({})

const customerIdSchema = z.object({ id: z.string().min(1) })

const writeSchema = z.object({
  customerCode: z.string().min(1),
  customerType: z.string().min(1),
  fullName: z.string().min(1),
  gender: z.string().min(1),
  birthday: z.string().min(1),
  nationality: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiredDate: z.string().optional(),
  passportCountry: z.string().optional(),
  identityNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  swiftCode: z.string().optional(),
  owner: z.string().min(1),
  source: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
})

const updateSchema = z.object({
  id: z.string().min(1),
  input: writeSchema.partial(),
})

type ListFiltersInput = z.infer<typeof listFiltersSchema>
type CustomerIdInput = z.infer<typeof customerIdSchema>
type WriteInput = z.infer<typeof writeSchema>
type UpdateInput = z.infer<typeof updateSchema>

function readSession() {
  try {
    const raw = getCookie(AUTH_COOKIE)
    if (!raw) return null
    const parsed = sessionSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

function deny(code: string, message: string) {
  return {
    success: false as const,
    data: null,
    error: { code, message },
  }
}

function requirePerm(...perms: string[]) {
  const session = readSession()
  if (!session) return deny('auth.unauthorized', 'Not authenticated')
  if (!hasAnyPermission(session.user, perms)) {
    return deny('auth.forbidden', 'Missing customer permission')
  }
  return null
}

function dbUnavailable() {
  return deny('db.unavailable', 'DATABASE_URL not set')
}

export const listCustomersFn = createServerFn({ method: 'GET' })
  .validator(listFiltersSchema)
  .handler(async ({ data }: { data: ListFiltersInput }) => {
    const denied = requirePerm('customer:view', 'customer:manage')
    if (denied) return denied
    if (!hasDatabaseUrl()) return dbUnavailable()
    return listCustomersDb(data as CustomerListFilters)
  })

export const getCustomerFn = createServerFn({ method: 'GET' })
  .validator(customerIdSchema)
  .handler(async ({ data }: { data: CustomerIdInput }) => {
    const denied = requirePerm('customer:view', 'customer:manage')
    if (denied) return denied
    if (!hasDatabaseUrl()) return dbUnavailable()
    return getCustomerDb(data.id)
  })

export const createCustomerFn = createServerFn({ method: 'POST' })
  .validator(writeSchema)
  .handler(async ({ data }: { data: WriteInput }) => {
    const denied = requirePerm('customer:manage')
    if (denied) return denied
    if (!hasDatabaseUrl()) return dbUnavailable()
    return createCustomerDb(data as CustomerWriteInput)
  })

export const updateCustomerFn = createServerFn({ method: 'POST' })
  .validator(updateSchema)
  .handler(async ({ data }: { data: UpdateInput }) => {
    const denied = requirePerm('customer:manage')
    if (denied) return denied
    if (!hasDatabaseUrl()) return dbUnavailable()
    return updateCustomerDb(data.id, data.input as Partial<CustomerWriteInput>)
  })

export const deleteCustomerFn = createServerFn({ method: 'POST' })
  .validator(customerIdSchema)
  .handler(async ({ data }: { data: CustomerIdInput }) => {
    const denied = requirePerm('customer:manage')
    if (denied) return denied
    if (!hasDatabaseUrl()) return dbUnavailable()
    return deleteCustomerDb(data.id)
  })

export const dbAvailableFn = createServerFn({ method: 'GET' }).handler(
  async () => ({ available: hasDatabaseUrl() }),
)

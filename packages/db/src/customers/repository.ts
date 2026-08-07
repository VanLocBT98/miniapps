import { and, asc, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm'
import { getDb } from '../client'
import { customers } from '../schema/customers'
import {
  dtoToNewRow,
  rowToCustomerDto,
  type CustomerDto,
  type CustomerWriteInput,
} from './mapper'

export type CustomerListFilters = {
  q?: string
  status?: string
  customerType?: string
  source?: string
  owner?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: {
    code: string
    message: string
    details?: Record<string, string | number | boolean | null>
  } | null
  meta?: Record<string, string | number | boolean | null>
}

function ok<T>(
  data: T,
  meta?: Record<string, string | number | boolean | null>,
): ApiEnvelope<T> {
  return { success: true, data, error: null, meta }
}

function fail<T = never>(
  code: string,
  message: string,
  details?: Record<string, string | number | boolean | null>,
): ApiEnvelope<T> {
  return { success: false, data: null, error: { code, message, details } }
}

const sortColumns = {
  customerCode: customers.customerCode,
  fullName: customers.fullName,
  createdDate: customers.createdAt,
  status: customers.status,
  owner: customers.ownerId,
  source: customers.source,
} as const

export async function listCustomersDb(
  filters: CustomerListFilters = {},
): Promise<ApiEnvelope<CustomerDto[]>> {
  const db = getDb()
  const conditions = [isNull(customers.deletedAt)]

  if (filters.status) {
    conditions.push(eq(customers.status, filters.status))
  }
  if (filters.customerType) {
    conditions.push(eq(customers.customerType, filters.customerType))
  }
  if (filters.source) {
    conditions.push(eq(customers.source, filters.source))
  }
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim()}%`
    conditions.push(
      or(
        ilike(customers.customerCode, q),
        ilike(customers.fullName, q),
        ilike(customers.phone, q),
        ilike(customers.email, q),
        ilike(customers.passportNumber, q),
      )!,
    )
  }

  const sortKey = (filters.sortBy ?? 'createdDate') as keyof typeof sortColumns
  const col = sortColumns[sortKey] ?? customers.createdAt
  const order =
    (filters.sortDir ?? 'desc') === 'asc' ? asc(col) : desc(col)

  let rows = await db
    .select()
    .from(customers)
    .where(and(...conditions))
    .orderBy(order)

  if (filters.owner?.trim()) {
    const owner = filters.owner.trim().toLowerCase()
    rows = rows.filter((r) =>
      rowToCustomerDto(r).owner.toLowerCase().includes(owner),
    )
  }

  const total = rows.length
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.max(1, filters.pageSize ?? 20)
  const shouldPage = filters.page != null || filters.pageSize != null
  const paged = shouldPage
    ? rows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    : rows

  return ok(
    paged.map(rowToCustomerDto),
    {
      total,
      page: shouldPage ? page : 1,
      pageSize: shouldPage ? pageSize : total,
    },
  )
}

export async function getCustomerDb(
  id: string,
): Promise<ApiEnvelope<CustomerDto>> {
  const db = getDb()
  const [row] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .limit(1)
  if (!row) {
    return fail('customer.not_found', 'Customer not found')
  }
  return ok(rowToCustomerDto(row))
}

export async function createCustomerDb(
  input: CustomerWriteInput,
): Promise<ApiEnvelope<CustomerDto>> {
  const db = getDb()
  const dup = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.customerCode, input.customerCode))
    .limit(1)
  if (dup[0]) {
    return fail(
      'customer.duplicate_code',
      `Duplicate customer code: ${input.customerCode}`,
    )
  }
  if (input.passportCountry?.trim() && !input.passportNumber?.trim()) {
    return fail(
      'customer.rules',
      'Passport number is required for international travelers',
    )
  }

  const [row] = await db
    .insert(customers)
    .values(dtoToNewRow(input))
    .returning()
  return ok(rowToCustomerDto(row!))
}

export async function updateCustomerDb(
  id: string,
  input: Partial<CustomerWriteInput>,
): Promise<ApiEnvelope<CustomerDto>> {
  const db = getDb()
  const [current] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .limit(1)
  if (!current) {
    return fail('customer.not_found', 'Customer not found')
  }

  if (input.customerCode && input.customerCode !== current.customerCode) {
    const dup = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.customerCode, input.customerCode))
      .limit(1)
    if (dup[0]) {
      return fail(
        'customer.duplicate_code',
        `Duplicate customer code: ${input.customerCode}`,
      )
    }
  }

  const mergedPassportCountry =
    input.passportCountry !== undefined
      ? input.passportCountry
      : current.passportCountry
  const mergedPassportNumber =
    input.passportNumber !== undefined
      ? input.passportNumber
      : current.passportNumber
  if (mergedPassportCountry?.trim() && !mergedPassportNumber?.trim()) {
    return fail(
      'customer.rules',
      'Passport number is required for international travelers',
    )
  }

  const actor = input.createdBy ?? 'agent'
  const patch = dtoToNewRow(
    {
      customerCode: input.customerCode ?? current.customerCode,
      customerType: input.customerType ?? current.customerType,
      fullName: input.fullName ?? current.fullName,
      gender: input.gender ?? current.gender ?? 'unspecified',
      birthday: input.birthday ?? (current.birthday as string) ?? '',
      nationality: input.nationality ?? current.nationality ?? '',
      phone: input.phone !== undefined ? input.phone : current.phone ?? undefined,
      email: input.email !== undefined ? input.email : current.email ?? undefined,
      address:
        input.address !== undefined ? input.address : current.address ?? undefined,
      passportNumber:
        input.passportNumber !== undefined
          ? input.passportNumber
          : current.passportNumber ?? undefined,
      passportExpiredDate:
        input.passportExpiredDate !== undefined
          ? input.passportExpiredDate
          : (current.passportExpiredDate as string) ?? undefined,
      passportCountry:
        input.passportCountry !== undefined
          ? input.passportCountry
          : current.passportCountry ?? undefined,
      identityNumber:
        input.identityNumber !== undefined
          ? input.identityNumber
          : current.identityNumber ?? undefined,
      bankName:
        input.bankName !== undefined ? input.bankName : current.bankName ?? undefined,
      accountNumber:
        input.accountNumber !== undefined
          ? input.accountNumber
          : current.bankAccountNumber ?? undefined,
      accountName:
        input.accountName !== undefined
          ? input.accountName
          : current.bankAccountName ?? undefined,
      swiftCode:
        input.swiftCode !== undefined
          ? input.swiftCode
          : current.swiftCode ?? undefined,
      owner: input.owner ?? rowToCustomerDto(current).owner,
      source: input.source ?? current.source ?? 'Manual',
      status: input.status ?? current.status ?? 'Active',
      createdBy: actor,
    },
    { actorLabel: actor },
  )

  const [row] = await db
    .update(customers)
    .set({
      customerCode: patch.customerCode,
      customerType: patch.customerType,
      fullName: patch.fullName,
      gender: patch.gender,
      birthday: patch.birthday,
      nationality: patch.nationality,
      phone: patch.phone,
      email: patch.email,
      address: patch.address,
      passportNumber: patch.passportNumber,
      passportCountry: patch.passportCountry,
      passportExpiredDate: patch.passportExpiredDate,
      identityNumber: patch.identityNumber,
      bankName: patch.bankName,
      bankAccountNumber: patch.bankAccountNumber,
      bankAccountName: patch.bankAccountName,
      swiftCode: patch.swiftCode,
      ownerId: patch.ownerId,
      source: patch.source,
      status: patch.status,
      updatedBy: patch.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, id))
    .returning()

  return ok(rowToCustomerDto(row!))
}

export type DeleteCustomerResult = {
  id: string
  deleted: boolean
  softDeactivated: boolean
  customer?: CustomerDto
}

export async function deleteCustomerDb(
  id: string,
): Promise<ApiEnvelope<DeleteCustomerResult>> {
  const db = getDb()
  const [current] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .limit(1)
  if (!current) {
    return fail('customer.not_found', 'Customer not found')
  }

  const now = new Date()
  const [row] = await db
    .update(customers)
    .set({
      status: 'Inactive',
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(customers.id, id))
    .returning()

  return ok({
    id,
    deleted: true,
    softDeactivated: true,
    customer: rowToCustomerDto(row!),
  })
}

export async function countCustomersDb(): Promise<number> {
  const db = getDb()
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(customers)
    .where(isNull(customers.deletedAt))
  return row?.count ?? 0
}

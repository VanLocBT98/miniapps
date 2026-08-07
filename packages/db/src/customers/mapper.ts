import type { CustomerRow, NewCustomerRow } from '../schema/customers'
import { ownerIdToLabel, ownerLabelToId } from './demo'

/** App-facing customer DTO (matches booking Zod Customer shape). */
export type CustomerDto = {
  id: string
  customerCode: string
  customerType: 'Individual' | 'Company'
  fullName: string
  gender: 'male' | 'female' | 'other' | 'unspecified'
  birthday: string
  nationality: string
  phone?: string
  email?: string
  address?: string
  passportNumber?: string
  passportExpiredDate?: string
  passportCountry?: string
  identityNumber?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  swiftCode?: string
  owner: string
  department?: string
  source: 'Manual' | 'Imported' | 'Booking' | 'API' | 'CRM'
  status: 'Active' | 'Inactive'
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
}

function dateToIsoDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 10)
  return value.toISOString().slice(0, 10)
}

function tsToIso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  return value.toISOString()
}

function emptyToUndef(value: string | null | undefined): string | undefined {
  if (value == null || value === '') return undefined
  return value
}

export function rowToCustomerDto(row: CustomerRow): CustomerDto {
  return {
    id: row.id,
    customerCode: row.customerCode,
    customerType: row.customerType as CustomerDto['customerType'],
    fullName: row.fullName,
    gender: (row.gender as CustomerDto['gender']) || 'unspecified',
    birthday: dateToIsoDate(row.birthday),
    nationality: row.nationality ?? '',
    phone: emptyToUndef(row.phone),
    email: emptyToUndef(row.email),
    address: emptyToUndef(row.address),
    passportNumber: emptyToUndef(row.passportNumber),
    passportExpiredDate: emptyToUndef(dateToIsoDate(row.passportExpiredDate) || undefined),
    passportCountry: emptyToUndef(row.passportCountry),
    identityNumber: emptyToUndef(row.identityNumber),
    bankName: emptyToUndef(row.bankName),
    accountNumber: emptyToUndef(row.bankAccountNumber),
    accountName: emptyToUndef(row.bankAccountName),
    swiftCode: emptyToUndef(row.swiftCode),
    owner: ownerIdToLabel(row.ownerId),
    // department not in DB
    source: (row.source as CustomerDto['source']) || 'Manual',
    status: (row.status as CustomerDto['status']) || 'Active',
    createdBy: ownerIdToLabel(row.createdBy) || 'system',
    createdDate: tsToIso(row.createdAt),
    updatedBy: ownerIdToLabel(row.updatedBy) || 'system',
    updatedDate: tsToIso(row.updatedAt),
  }
}

export type CustomerWriteInput = {
  customerCode: string
  customerType: string
  fullName: string
  gender: string
  birthday: string
  nationality: string
  phone?: string
  email?: string
  address?: string
  passportNumber?: string
  passportExpiredDate?: string
  passportCountry?: string
  identityNumber?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  swiftCode?: string
  owner: string
  source?: string
  status?: string
  createdBy?: string
}

export function dtoToNewRow(
  input: CustomerWriteInput,
  opts?: { id?: string; actorLabel?: string },
): NewCustomerRow {
  const actor = ownerLabelToId(opts?.actorLabel ?? input.createdBy ?? 'agent')
  const now = new Date()
  return {
    id: opts?.id,
    customerCode: input.customerCode,
    customerType: input.customerType,
    fullName: input.fullName,
    gender: input.gender,
    birthday: input.birthday || null,
    nationality: input.nationality || null,
    phone: input.phone || null,
    email: input.email || null,
    address: input.address || null,
    passportNumber: input.passportNumber || null,
    passportCountry: input.passportCountry || null,
    passportExpiredDate: input.passportExpiredDate || null,
    identityNumber: input.identityNumber || null,
    bankName: input.bankName || null,
    bankAccountNumber: input.accountNumber || null,
    bankAccountName: input.accountName || null,
    swiftCode: input.swiftCode || null,
    ownerId: ownerLabelToId(input.owner),
    source: input.source ?? 'Manual',
    status: input.status ?? 'Active',
    createdBy: actor,
    updatedBy: actor,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }
}

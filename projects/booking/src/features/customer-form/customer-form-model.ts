import type { CreateCustomerInput } from '@/shared/services/apis/customer-service'
import type { Customer } from '@/shared/types'
import {
  createCustomerInputSchema,
} from '@/shared/services/apis/customer-service'
import { validateCustomer } from '@/shared/domain'

/** Form draft — strings for inputs; empty → undefined on submit. */
export type CustomerFormValues = {
  customerCode: string
  customerType: CreateCustomerInput['customerType']
  fullName: string
  gender: CreateCustomerInput['gender']
  birthday: string
  nationality: string
  phone: string
  email: string
  address: string
  passportNumber: string
  passportExpiredDate: string
  passportCountry: string
  identityNumber: string
  bankName: string
  accountNumber: string
  accountName: string
  swiftCode: string
  owner: string
  department: string
  source: CreateCustomerInput['source']
  status: CreateCustomerInput['status']
}

export function emptyCustomerFormValues(
  overrides: Partial<CustomerFormValues> = {},
): CustomerFormValues {
  return {
    customerCode: `CUS-${Date.now().toString().slice(-6)}`,
    customerType: 'Individual',
    fullName: '',
    gender: 'unspecified',
    birthday: '',
    nationality: 'VN',
    phone: '',
    email: '',
    address: '',
    passportNumber: '',
    passportExpiredDate: '',
    passportCountry: '',
    identityNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    swiftCode: '',
    owner: '',
    department: '',
    source: 'Manual',
    status: 'Active',
    ...overrides,
  }
}

export function customerToFormValues(customer: Customer): CustomerFormValues {
  return {
    customerCode: customer.customerCode,
    customerType: customer.customerType,
    fullName: customer.fullName,
    gender: customer.gender,
    birthday: customer.birthday,
    nationality: customer.nationality,
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    address: customer.address ?? '',
    passportNumber: customer.passportNumber ?? '',
    passportExpiredDate: customer.passportExpiredDate ?? '',
    passportCountry: customer.passportCountry ?? '',
    identityNumber: customer.identityNumber ?? '',
    bankName: customer.bankName ?? '',
    accountNumber: customer.accountNumber ?? '',
    accountName: customer.accountName ?? '',
    swiftCode: customer.swiftCode ?? '',
    owner: customer.owner,
    department: customer.department ?? '',
    source: customer.source,
    status: customer.status,
  }
}

function blankToUndefined(value: string): string | undefined {
  const t = value.trim()
  return t === '' ? undefined : t
}

export function formValuesToInput(values: CustomerFormValues): CreateCustomerInput {
  return {
    customerCode: values.customerCode.trim(),
    customerType: values.customerType,
    fullName: values.fullName.trim(),
    gender: values.gender,
    birthday: values.birthday.trim(),
    nationality: values.nationality.trim(),
    phone: blankToUndefined(values.phone),
    email: blankToUndefined(values.email),
    address: blankToUndefined(values.address),
    passportNumber: blankToUndefined(values.passportNumber),
    passportExpiredDate: blankToUndefined(values.passportExpiredDate),
    passportCountry: blankToUndefined(values.passportCountry),
    identityNumber: blankToUndefined(values.identityNumber),
    bankName: blankToUndefined(values.bankName),
    accountNumber: blankToUndefined(values.accountNumber),
    accountName: blankToUndefined(values.accountName),
    swiftCode: blankToUndefined(values.swiftCode),
    owner: values.owner.trim(),
    department: blankToUndefined(values.department),
    source: values.source,
    status: values.status,
  }
}

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>> & {
  form?: string
}

export function validateCustomerForm(
  values: CustomerFormValues,
): { ok: true; input: CreateCustomerInput } | { ok: false; errors: CustomerFormErrors } {
  const input = formValuesToInput(values)
  const parsed = createCustomerInputSchema.safeParse(input)
  const errors: CustomerFormErrors = {}

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !(key in errors)) {
        errors[key as keyof CustomerFormValues] = issue.message
      }
    }
    if (!errors.form) {
      errors.form = parsed.error.issues[0]?.message ?? 'Invalid customer'
    }
    return { ok: false, errors }
  }

  const ruleIssues = validateCustomer(parsed.data)
  if (ruleIssues.length > 0) {
    const first = ruleIssues[0]!
    if (first.code === 'customer.passport') {
      errors.passportNumber = first.message
    }
    errors.form = first.message
    return { ok: false, errors }
  }

  return { ok: true, input: parsed.data }
}

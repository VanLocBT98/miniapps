import type { Customer, CustomerStatus } from '../types/customer'

export type CustomerRuleIssue = { code: string; message: string }

/** Customer codes must be unique within a collection. */
export function assertUniqueCustomerCodes(codes: string[]): string | null {
  const seen = new Set<string>()
  for (const code of codes) {
    const key = code.trim().toLowerCase()
    if (seen.has(key)) return `Duplicate customer code: ${code}`
    seen.add(key)
  }
  return null
}

/**
 * Passport number required for international travelers.
 * Treat presence of passportCountry as international travel intent.
 */
export function assertCustomerPassport(customer: {
  passportNumber?: string
  passportCountry?: string
}): string | null {
  if (!customer.passportCountry?.trim()) return null
  if (!customer.passportNumber?.trim()) {
    return 'Passport number is required for international travelers'
  }
  return null
}

export function isCustomerActive(status: CustomerStatus): boolean {
  return status === 'Active'
}

/** Only Active customers can be selected during booking. */
export function assertCustomerSelectable(customer: Customer): string | null {
  if (!isCustomerActive(customer.status)) {
    return 'Only Active customers can be selected during booking'
  }
  return null
}

export function validateCustomer(
  customer: Pick<
    Customer,
    'passportNumber' | 'passportCountry' | 'email' | 'phone'
  >,
): CustomerRuleIssue[] {
  const issues: CustomerRuleIssue[] = []
  const passportIssue = assertCustomerPassport(customer)
  if (passportIssue) {
    issues.push({ code: 'customer.passport', message: passportIssue })
  }
  return issues
}

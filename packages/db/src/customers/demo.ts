/** Demo owner labels → stable UUIDs (no users table yet). */
export const DEMO_OWNER_IDS = {
  'agent.one': '11111111-1111-4111-8111-111111111111',
  'agent.two': '22222222-2222-4222-8222-222222222222',
  agent: '33333333-3333-4333-8333-333333333333',
  system: '00000000-0000-4000-8000-000000000001',
} as const

export type DemoOwnerLabel = keyof typeof DEMO_OWNER_IDS

const idToLabel = Object.fromEntries(
  Object.entries(DEMO_OWNER_IDS).map(([label, id]) => [id, label]),
) as Record<string, string>

export function ownerLabelToId(label: string | undefined | null): string | null {
  if (!label?.trim()) return null
  const key = label.trim() as DemoOwnerLabel
  return DEMO_OWNER_IDS[key] ?? DEMO_OWNER_IDS.agent
}

export function ownerIdToLabel(id: string | null | undefined): string {
  if (!id) return ''
  return idToLabel[id] ?? id
}

/** Seed customer UUIDs (stable for demos / related-bookings stub). */
export const SEED_CUSTOMER_IDS = {
  c1001: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  c1002: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
  c1003: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
} as const

/** customerId → related booking ids (stub until bookings FK exists). */
export const RELATED_BOOKINGS_BY_CUSTOMER: Record<string, string[]> = {
  [SEED_CUSTOMER_IDS.c1001]: ['b-1001'],
}

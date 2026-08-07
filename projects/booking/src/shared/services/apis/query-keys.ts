export const bookingKeys = {
  all: ['booking'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  history: (id: string) => [...bookingKeys.detail(id), 'history'] as const,
  timeline: (id: string) => [...bookingKeys.detail(id), 'timeline'] as const,
  passengers: (id: string) => [...bookingKeys.detail(id), 'passengers'] as const,
  flights: (id: string) => [...bookingKeys.detail(id), 'flights'] as const,
  payment: (id: string) => [...bookingKeys.detail(id), 'payment'] as const,
  documents: (id: string) => [...bookingKeys.detail(id), 'documents'] as const,
}

export const customerKeys = {
  all: ['customer'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
}

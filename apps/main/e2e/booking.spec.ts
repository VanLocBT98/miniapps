import { test } from '@playwright/test'

/**
 * Booking Playwright cases (10-testing.md) — noted for apps/main e2e.
 * Implement when host auth + booking fixtures are stable in CI.
 *
 * Cases:
 * 1. Search Booking — `/booking`, type query, assert filtered rows
 * 2. Open Detail — click BK-1001, assert overview + tabs
 * 3. Update Booking — passengers/flights/payment save + history entry
 * 4. Navigate Tabs — overview → passengers → flights → payment → documents → history
 *
 * Prefetch: list/detail loaders already `ensureQueryData` (see booking SSR checklist).
 */
test.describe.skip('booking (planned)', () => {
  test('search booking', async () => {})
  test('open detail', async () => {})
  test('update booking', async () => {})
  test('navigate tabs', async () => {})
})

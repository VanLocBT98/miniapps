import { test } from '@playwright/test'

/**
 * Customer Playwright cases (Sprint 2 / 10-testing.md) — apps/main e2e stub.
 * Implement when host auth + customer fixtures are stable in CI.
 *
 * Cases:
 * 1. List Customers — `/customer`, assert table columns / seed rows
 * 2. Search Customer — filter by code/name, assert filtered rows
 * 3. Create Customer — `/customer/new`, submit form, land on detail
 * 4. Edit Customer — open edit, save, assert detail updated
 * 5. Delete Customer — confirm dialog; hard delete or Inactive per related bookings
 *
 * Prefetch: list/detail loaders already `ensureQueryData` on host customer routes.
 */
test.describe.skip('customer (planned)', () => {
  test('list customers', async () => {})
  test('search customer', async () => {})
  test('create customer', async () => {})
  test('edit customer', async () => {})
  test('delete customer', async () => {})
})

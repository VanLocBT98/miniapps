# Testing

## Vitest

- Booking Service — `src/shared/services/apis/booking-service.test.ts`
- Booking Mapper — `src/shared/services/mappers/booking-mapper.test.ts`
- Booking Utilities (business rules helpers) — `src/shared/domain/*.test.ts`
- SSR head + loader checklist — `src/shared/ssr/*.test.ts`
- Customer Zod — `src/shared/types/customer.schema.test.ts`
- Customer rules — `src/shared/domain/customer-rules.test.ts`
- Customer service — `src/shared/services/apis/customer-service.test.ts`
- Customer form model — `src/features/customer-form/customer-form-model.test.ts`

## React Testing Library

- Booking List — `BookingListTable.test.tsx` (smoke)
- Booking Detail — `BookingDetailSummaryCard.test.tsx` (smoke)
- Passenger Table — `PassengerTable.test.tsx` (smoke)
- Customer List — `CustomerListTable.test.tsx` (smoke)
- Customer Detail summary — `CustomerDetailSummary.test.tsx` (smoke)
- Customer Form — `CustomerForm.test.tsx` (smoke)
- Customer Delete dialog — `CustomerDeleteDialog.test.tsx` (smoke)

Run: `pnpm --filter @repo/booking test`

## Playwright

Planned booking cases (stub: `apps/main/e2e/booking.spec.ts`, currently skipped):

1. **Search Booking** — `/booking`, filter by query, assert table
2. **Open Detail** — open `BK-1001`, assert overview + SEO title
3. **Update Booking** — mutate passengers/flights/payment; history grows
4. **Navigate Tabs** — overview → passengers → flights → payment → documents → history

Planned customer cases (stub: `apps/main/e2e/customer.spec.ts`, currently skipped):

1. **List Customers** — `/customer`, assert seed rows
2. **Search Customer** — filter by code/name
3. **Create Customer** — form submit → detail
4. **Edit Customer** — save → detail updated
5. **Delete Customer** — confirm dialog; soft-delete (`deleted_at`), hidden from list

Align with repo Vitest / Playwright setup under project + `apps/main` e2e as appropriate.

## SSR loaders (related)

Host routes under `apps/main/src/routes/_app/booking*` call `ensureQueryData` + `bookingDetailHead` / `bookingListHead`. Checklist: `projects/booking/src/shared/ssr/loader-checklist.ts`.
Customer list/detail/edit loaders `ensureQueryData` on `/_app/customer*`.

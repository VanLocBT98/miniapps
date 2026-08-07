---
runMode: continue
---

# Booking — Actions queue

> Agent **executes** these items in order when a run is started.
> Start: `pnpm req:start booking` hoặc chat: **chạy requirements booking**
> Stop: `pnpm req:stop`
> After each item: `pnpm req:done booking <id>` + CHANGELOG entry.

## Queue

### folder-structure
- [x] Folder structure (BASIC-APP + domain modules)
- read: `00-overview.md`, `01-domain.md`, `06-ui.md`
- do: Align `projects/booking/src` with BASIC-APP + domain folders for passengers/flights/payment/timeline/documents. Keep existing pages working. No product UI rewrite yet.

### types-zod
- [x] Types + Zod schemas
- read: `04-data-model.md`, `07-business-rules.md`
- do: Add Zod models for Booking, Passenger, Flight, Payment, Timeline, Document + status enum + envelope type. Export from shared/types. Add unit tests for critical rules helpers if cheap.

### api-layer
- [x] API layer (mock) with envelope
- read: `05-api.md`
- do: Implement mock service + `query-keys` + query/mutation options for list/detail/history/passengers/flights/payment matching envelope `{ success, data, error, meta }`.

### routing
- [x] Routing per spec
- read: `03-routing.md`, `02-user-flow.md`
- do: Add host + standalone routes: `/booking`, `/booking/new`, `/booking/:id`, nested passengers/flights/payment/history. Mark calendar as legacy (remove nav or leave stub behind feature flag). Wire loaders + SEO head for detail.

### query-layer
- [x] Query layer polish
- read: `08-state-management.md`
- do: Ensure all server state is TanStack Query; Zustand only UI (filters draft, selected tab). Invalidate on mutations + toast.

### booking-list
- [x] Booking List UI
- read: `06-ui.md`, `02-user-flow.md`
- do: Search, filters, table, pagination, toolbar on list page using `@repo/ui` + project components (`BookingStatus`, etc.).

### booking-detail
- [x] Booking Detail shell
- read: `06-ui.md`, `09-ssr.md`
- do: Detail header, status badge, summary, tabs navigation to nested routes, SSR meta. Respect read-only rules for Cancelled/Completed.

### passenger-module
- [x] Passenger module
- read: `04-data-model.md`, `07-business-rules.md`
- do: Passengers route + table/cards; passport required for international; at least one passenger rule.

### flight-module
- [x] Flight module
- read: `04-data-model.md`, `07-business-rules.md`
- do: Flights route + table/cards; at least one flight rule.

### payment-module
- [x] Payment module
- read: `04-data-model.md`, `07-business-rules.md`
- do: Payment route + card; block Ticketed without payment.

### timeline-history
- [x] Timeline + History
- read: `01-domain.md`, `07-business-rules.md`
- do: History route + timeline UI; record updates into history on mutations (mock).

### documents
- [x] Documents
- read: `01-domain.md`, `06-ui.md`
- do: Document viewer on detail (tab or route); model + mock list.

### ssr-testing
- [x] SSR polish + tests
- read: `09-ssr.md`, `10-testing.md`
- do: Prefetch/loaders verified; Vitest for service/mapper/utils; RTL smoke for list/detail; note Playwright cases.

## Sprint 2 — Customer Management

### customer-routing
- [x] Register customer routes + navigation
- read: `12-customer.md`, `03-routing.md`
- do: Register `/customer`, `/customer/new`, `/customer/:customerId`, `/customer/:customerId/edit` on host + project registry; add Customers nav item; permissions `customer:view` / `customer:manage`.

### customer-api
- [x] Customer API + query/mutation hooks
- read: `12-customer.md`, `05-api.md`, `04-data-model.md`, `07-business-rules.md`
- do: Zod Customer model; mock `/customers` CRUD service + envelope; query-keys; list/detail query options; create/update/delete mutation options. Enforce unique code + delete/inactive rules in service.

### customer-list
- [x] Customer List UI
- read: `12-customer.md`, `06-ui.md`
- do: List page with search, filter, pagination, sort, bulk selection stub; table columns per UI spec; link to detail/create.

### customer-detail
- [x] Customer Detail page
- read: `12-customer.md`, `06-ui.md`
- do: Detail page sections: General, Travel, Contact, Bank, Internal; summary + status; actions Edit/Delete.

### customer-form
- [x] Create/Edit form + validation
- read: `12-customer.md`, `04-data-model.md`, `07-business-rules.md`, `06-ui.md`
- do: Reusable CustomerForm for create + edit; validation (unique code, optional email/phone, passport rules); wire mutations + toast/invalidate.

### customer-delete
- [x] Delete dialog + mutation
- read: `12-customer.md`, `07-business-rules.md`
- do: Confirmation dialog; hard delete only if no related bookings; otherwise mark Inactive; toast + list invalidate.

### customer-tests
- [x] Customer tests
- read: `10-testing.md`, `12-customer.md`
- do: Unit tests for customer Zod/rules/service; RTL smoke for list/form; stub or add Playwright cases for customer CRUD.

# Booking — Changelog / process log

> Newest first.

## 2026-08-10 — Vercel customer persistence (Neon)

- **Why**: Production `/customer` create disappeared after reload (no `DATABASE_URL` → mock RAM).
- **What**: Neon Postgres provisioned + schema/seed; `DATABASE_URL` set on Vercel Main (Production/Preview); `@repo/db` client tuned for pooler/serverless (`max: 1`, `prepare: false`); docs for production DB.
- **Files**: `packages/db/src/client.ts`, `13-database.md`, `Environment.md`
- **Follow-ups**: Claim Neon DB before 72h expire: https://neon.new/claim/019fe983-010b-761f-bb7b-2ae6553a9752
- **Requirements**: `13-database.md` Production section.

## 2026-08-06 — Customer delete = soft-delete

- **Why**: Delete must keep the row in Postgres and hide it from list (not hard `DELETE`).
- **What**: Always set `deleted_at` + `Inactive`; list/detail filter `deleted_at IS NULL`; mock mirrors with `deletedIds`; dialog/toast/tests/docs updated.
- **Files**: `packages/db/.../repository.ts`, `customer-service.ts`, `mock-db.ts`, `CustomerDeleteDialog*`, `mutations.ts`, `13-database.md`, `07-business-rules.md`
- **Follow-ups**: None.
- **Requirements**: Delete rules updated to soft-delete only.

## 2026-08-06 — Postgres customers (local)

- **Why**: Connect Customer CRUD to PostgreSQL for real data while keeping mock fallback.
- **What**: `@repo/db` (Drizzle `customers`), docker-compose Postgres, seed; booking `createServerFn` CRUD; `customer-service` prefers DB then mock; docs `13-database.md`.
- **Files**: `packages/db/**`, `docker-compose.yml`, `projects/booking/src/server/customer-fns.ts`, `customer-service.ts`, `apps/main/.env*`, `packages/config` `DATABASE_URL`
- **Follow-ups**: Start Docker → `pnpm db:setup` → reload `/customer`.
- **Requirements**: `13-database.md` added.

## 2026-08-06 — ACTION customer-tests (Sprint 2 complete)

- **Why**: Close Sprint 2 with Vitest/RTL coverage + Playwright stubs for customer CRUD.
- **What**: Zod schema tests; expanded service filter/sort tests; `CustomerForm` RTL smoke; Playwright stub `apps/main/e2e/customer.spec.ts`; updated `10-testing.md`. Queue **20/20**.
- **Files**: `customer.schema.test.ts`, `CustomerForm.test.tsx`, `customer-service.test.ts`, `e2e/customer.spec.ts`, `10-testing.md`
- **Follow-ups**: None pending in ACTIONS; optional implement Playwright customer cases + Optimization todo.
- **Requirements**: customer-tests checked; `11-todo` customer-tests checked; living REQUIREMENTS pruned.

## 2026-08-06 — ACTION customer-delete

- **Why**: Replace `window.confirm` with confirmation dialog; enforce delete vs Inactive rules in UI flow.
- **What**: `CustomerDeleteDialog` (`@repo/ui` Modal); detail Delete opens dialog → mutation; hard delete navigates to list; soft-deactivate stays on detail; toast + invalidate via existing hook.
- **Files**: `features/customer-detail/components/CustomerDeleteDialog*`, `CustomerDetailHeader.tsx`
- **Follow-ups**: Next ACTION `customer-tests`.
- **Requirements**: customer-delete checked; `11-todo` customer-delete checked.

## 2026-08-06 — ACTION customer-form

- **Why**: Sprint 2 reusable Customer create/edit form + client validation.
- **What**: `CustomerForm` (General/Travel/Contact/Bank/Internal); Zod + passport rules; create/edit pages wire mutations (toast/invalidate via hooks); edit host loader; unique-code errors surfaced from API.
- **Files**: `features/customer-form/**`, `pages/CustomerNewPage`, `pages/CustomerEditPage`, `customer.$customerId.edit.tsx`
- **Follow-ups**: Next ACTION `customer-delete`.
- **Requirements**: customer-form checked; `11-todo` customer-form checked.

## 2026-08-06 — ACTION customer-detail

- **Why**: Sprint 2 Customer Detail page (sections + summary + Edit/Delete actions).
- **What**: `features/customer-detail` header/summary/General/Travel/Contact/Bank/Internal; page wired to `customerDetailQueryOptions`; host detail loader; Edit link + Delete (confirm → mutation, dialog polish in `customer-delete`).
- **Files**: `features/customer-detail/**`, `pages/CustomerDetailPage`, `apps/main/.../customer.$customerId.tsx`
- **Follow-ups**: Next ACTION `customer-form`.
- **Requirements**: customer-detail checked; `11-todo` customer-detail checked.

## 2026-08-06 — ACTION customer-list

- **Why**: Sprint 2 Customer List UI (search/filter/sort/pagination/bulk stub).
- **What**: `features/customer-list` (toolbar, search, filters, table, pagination) + Zustand store; `CustomerStatus`; list page wired to `customerListQueryOptions`; host list loader prefetch; row links to detail/edit/create.
- **Files**: `features/customer-list/**`, `pages/CustomerListPage`, `components/molecules/customer-status.tsx`, `apps/main/.../customer.index.tsx`
- **Follow-ups**: Next ACTION `customer-detail`.
- **Requirements**: customer-list checked; `11-todo` customer-list checked.

## 2026-08-06 — ACTION customer-api

- **Why**: Sprint 2 Customer CRUD API layer (Zod + mock service + Query options).
- **What**: `customer` Zod model; domain rules (unique code, passport, active-only, soft-delete); `customerDb` seed + related-bookings stub; `customer-service` CRUD envelope; `customerKeys` + list/detail query + create/update/delete mutation options + hooks; unit tests.
- **Files**: `shared/types/customer.ts`, `shared/domain/customer-rules*`, `mock-db.ts`, `customer-service*`, `query-keys.ts`, `apis.ts`, `mutations.ts`, `invalidate.ts`
- **Follow-ups**: Next ACTION `customer-list`.
- **Requirements**: customer-api checked; `11-todo` customer-api checked.

## 2026-08-06 — ACTION customer-routing

- **Why**: Sprint 2 Customer Management — register routes, nav, permissions.
- **What**: Stub customer pages; `project.ts` nav + pages + `customer:*` perms; host `/customer` tree + `bound-customer-page`; standalone router paths; mock users get `customer:view`/`manage`.
- **Files**: `pages/Customer*Page/**`, `project.ts`, `router/index.tsx`, `apps/main/src/routes/_app/customer*`, `bound-customer-page.tsx`, `packages/shared/src/auth/index.ts`
- **Follow-ups**: Next ACTION `customer-api`.
- **Requirements**: customer-routing checked; `11-todo` customer-routing checked.

## 2026-08-06 — Sprint 2 docs: Customer Management

- **Why**: Import Sprint 2 product spec (Customer CRUD) into living docs + ACTIONS queue.
- **What**: Added `12-customer.md`; extended routing/data-model/UI/rules/API/domain/user-flow; Sprint 2 ACTIONS (`customer-*`); living REQUIREMENTS Current focus = Customer Management.
- **Files**: `requirements/12-customer.md`, `03-routing.md`, `04-data-model.md`, `05-api.md`, `06-ui.md`, `07-business-rules.md`, `00-overview.md`, `01-domain.md`, `02-user-flow.md`, `ACTIONS.md`, `11-todo.md`, `REQUIREMENTS.md`
- **Follow-ups**: Chat `chạy requirements booking` to execute Sprint 2 queue.
- **Requirements**: Sprint 2 ready; Sprint 1 ACTIONS remain checked.

## 2026-08-06 — Requirements run complete

- **Why**: ACTIONS queue finished (13/13); close the auto-continue run.
- **What**: Marked living REQUIREMENTS as post-queue (empty Current focus); resolved open questions (documents = tab+route; calendar legacy-gated); optional follow-ups = Optimization + Playwright cases.
- **Files**: `REQUIREMENTS.md`, this CHANGELOG
- **Follow-ups**: Add new ACTIONS when product asks; otherwise stop.
- **Requirements**: Living file pruned to north star + constraints + done baseline.

## 2026-08-06 — ACTION ssr-testing

- **Why**: Prefetch/loaders + Vitest/RTL coverage; note Playwright cases (09-ssr, 10-testing).
- **What**: Extracted `toBookingListItem` mapper + tests; `@repo/booking/ssr` head helpers + loader checklist tests; list route `head`; RTL smokes (list table, detail summary, passenger table); Playwright stub `apps/main/e2e/booking.spec.ts` (skipped); Vitest projects unit/dom.
- **Files**: `shared/mappers/**`, `shared/ssr/**`, `vitest.config.ts`, RTL `*.test.tsx`, `booking-seo.ts`, `booking.index.tsx`, `e2e/booking.spec.ts`, `09-ssr.md` / `10-testing.md`
- **Follow-ups**: ACTIONS queue complete (`13/13`). Optional: implement Playwright booking cases; Optimization todo remains.
- **Requirements**: ssr-testing checked; `11-todo` SSR polish + Testing checked.

## 2026-08-06 — ACTION documents

- **Why**: Document viewer on detail (tab + route); model + mock list.
- **What**: Feature `documents` (`DocumentViewer`); `/booking/:id/documents` host + standalone; `getBookingDocuments` + query options; enriched mock docs; Documents tab in detail nav.
- **Files**: `features/documents/**`, `pages/DocumentsPage.tsx`, `booking-service`/`apis`/`query-keys`, `project.ts`, `router`, `booking.$bookingId.documents.tsx`, mock-db
- **Follow-ups**: Next ACTION `ssr-testing`.
- **Requirements**: documents checked; `11-todo` Documents checked.

## 2026-08-06 — ACTION timeline-history

- **Why**: History route + timeline UI; every update recorded (rule 9).
- **What**: `BookingTimeline` + `HistoryTable`; History page loads history+timeline; overview shows recent timeline; mock updates append specific history/timeline actions; fixed partial update schema so unspecified arrays are not wiped; `getBookingTimeline` + query options.
- **Files**: `features/timeline/**`, `features/history/**`, `pages/HistoryPage.tsx`, `pages/BookingDetailPage.tsx`, `shared/domain/history.ts`, `booking-service.ts`, host history route loader
- **Follow-ups**: Next ACTION `documents`.
- **Requirements**: timeline-history checked; `11-todo` Timeline / History checked.

## 2026-08-06 — ACTION payment-module

- **Why**: Payment UI + block Ticketed without payment.
- **What**: Feature `payment` (info card, form, rules alert, status actions); Ticketed option disabled / toast when no payment; API already rejects Ticketed without payment.
- **Files**: `features/payment/**`, `pages/PaymentPage.tsx`
- **Follow-ups**: Next ACTION `timeline-history`.
- **Requirements**: payment-module checked; `11-todo` Payment Module checked.

## 2026-08-06 — ACTION flight-module

- **Why**: Flight UI + rule (at least one flight).
- **What**: Feature `flights` (table/cards toggle, add form, rules alert, validate helper); draft→save via `useUpdateFlightsMutation`; read-only when Cancelled/Completed.
- **Files**: `features/flights/**`, `pages/FlightsPage.tsx`
- **Follow-ups**: Next ACTION `payment-module`.
- **Requirements**: flight-module checked; `11-todo` Flight Module checked.

## 2026-08-06 — ACTION passenger-module

- **Why**: Passenger UI + rules (min 1, passport for international).
- **What**: Feature `passengers` (table/cards toggle, add form, rules alert, validate helper); draft→save via `useUpdatePassengersMutation`; read-only when Cancelled/Completed. 14 tests green.
- **Files**: `features/passengers/**`, `pages/PassengersPage.tsx`
- **Follow-ups**: Next ACTION `flight-module`.
- **Requirements**: passenger-module checked; `11-todo` Passenger Module checked.

## 2026-08-06 — ACTION booking-detail

- **Why**: Detail shell per 06-ui + SSR meta (09-ssr) + read-only Cancelled/Completed.
- **What**: Feature `booking-detail` (header, summary, tabs, read-only banner/shell); overview uses summary card; shared `bookingDetailHead` on detail + nested host routes (title/description/og).
- **Files**: `features/booking-detail/**`, `pages/BookingDetailPage.tsx`, `apps/main/src/lib/booking-seo.ts`, `booking.$bookingId*.tsx`
- **Follow-ups**: Next ACTION `passenger-module`.
- **Requirements**: booking-detail checked; `11-todo` Booking Detail checked.

## 2026-08-06 — ACTION booking-list

- **Why**: Full list UI per 06-ui (search, advanced filters, table, pagination, toolbar).
- **What**: Feature module `features/booking-list/*`; toolbar/search/filters/table/pagination; EmptyState; pageSize + page in Zustand; `bookingType` filter on API list.
- **Files**: `features/booking-list/**`, `pages/BookingListPage.tsx`, `ui.store.ts`, `booking-service.ts`
- **Follow-ups**: Next ACTION `booking-detail`.
- **Requirements**: booking-list checked; `11-todo` Booking List checked.

## 2026-08-06 — ACTION query-layer

- **Why**: Server state in Query only; UI draft state in Zustand; mutations toast + invalidate.
- **What**: Extended `ui.store` (draft/applied filters, selectedTab); `invalidateBookingQueries`; mutation hooks (create/update/delete + passengers/flights/payment); list filters wired; new booking create mutation; ToastViewport in ProjectProviders. 11 tests green.
- **Files**: `ui.store.ts`, `apis/{invalidate,mutations}.ts`, `BookingListPage`, `BookingNewPage`, `BookingDetailShell`, `ProjectProviders`
- **Follow-ups**: Next ACTION `booking-list` (richer list UI).
- **Requirements**: query-layer checked; `11-todo` Query Layer checked.

## 2026-08-06 — ACTION routing

- **Why**: Nested booking routes + SEO + retire calendar from default nav.
- **What**: Host + standalone routes for list/new/detail/passengers/flights/payment/history; `BookingDetailShell` tabs; detail `head()` SEO; calendar behind `ENABLE_LEGACY_CALENDAR` (off → redirect). Version bump `0.2.0`.
- **Files**: `pages/*`, `router/index.tsx`, `project.ts`, `apps/main/src/routes/_app/booking*`, `bound-booking-page.tsx`, `constants`
- **Follow-ups**: Next ACTION `query-layer`.
- **Requirements**: routing checked; `11-todo` Routing checked.

## 2026-08-06 — ACTION api-layer

- **Why**: Mock API with envelope before richer UI/routing.
- **What**: In-memory `mock-db` + `booking-service` (list/detail/create/update/delete + history/passengers/flights/payment); query keys; query/mutation options with `unwrapEnvelope`; list/detail/calendar pages adapted to domain DTOs. 10 Vitest tests green.
- **Files**: `shared/services/apis/{mock-db,booking-service,apis,query-keys}.ts`, pages list/detail/calendar
- **Follow-ups**: Next ACTION `routing` (then query-layer polish).
- **Requirements**: `ACTIONS.md` api-layer checked; `11-todo` API Layer checked.

## 2026-08-06 — ACTION types-zod

- **Why**: Canonical Zod models + business-rule helpers before API layer.
- **What**: Added `booking` / `passenger` / `flight` / `payment` / `timeline` / `history` / `document` schemas, status/type enums, API envelope helpers, `validateBookingAggregate` + related rules; 6 Vitest cases green. Legacy list DTO kept in apis as `LegacyBookingListItem`.
- **Files**: `shared/types/{booking,envelope,index}.ts`, `shared/domain/rules.ts`, `rules.test.ts`, `vitest.config.ts`
- **Follow-ups**: Next ACTION `api-layer`.
- **Requirements**: `ACTIONS.md` types-zod checked; `11-todo` Types checked.

## 2026-08-06 — ACTION folder-structure

- **Why**: Align BASIC-APP + domain modules before types/API work.
- **What**: Added `features/{booking-list,booking-detail,passengers,flights,payment,timeline,history,documents}`, `components/{atoms,molecules,organisms}` with reusable card shells, `shared/domain` + `shared/services/mappers` placeholders. Detail page uses `BookingStatus`. Calendar marked legacy in `project.ts` title. Pages otherwise unchanged.
- **Files**: `projects/booking/src/features/**`, `projects/booking/src/components/molecules/**`, `pages/BookingDetailPage.tsx`, `project.ts`
- **Follow-ups**: Next ACTION `types-zod`.
- **Requirements**: `ACTIONS.md` folder-structure checked; `11-todo` Folder Structure checked.

## 2026-08-06 — Executable ACTIONS + req runner

- **Why**: Requirements must drive implementable actions, not sit as static docs.
- **What**: Added `requirements/ACTIONS.md` queue; `pnpm req:*` scripts; Cursor stop-hook auto-continues while run active.
- **Files**: `docs/projects/booking/requirements/ACTIONS.md`, `scripts/req-action.mjs`, `.cursor/hooks.json`, `.cursor/hooks/req-stop-continue.mjs`, `.cursor/rules/req-actions.mdc`
- **Follow-ups**: User runs `pnpm req:start booking` or says “chạy requirements booking”.
- **Requirements**: living file points at ACTIONS.md.

## 2026-08-06 — Full requirements pack (00–11)

- **Why**: Product-ready booking module spec (domain → SSR → tests → todo).
- **What**: Added `docs/projects/booking/requirements/*.md`; living `REQUIREMENTS.md` now indexes that pack; calendar marked legacy vs new routes.
- **Files**: `docs/projects/booking/requirements/**`, `REQUIREMENTS.md`, `.cursor/rules/project-booking.mdc`
- **Follow-ups**: Implement per `11-todo.md` starting Folder Structure → Types → API → Routing → List/Detail.
- **Requirements**: living file pruned to north star + focus + constraints.

## 2026-08-06 — Docs scaffold

- **Why**: Per-project requirements + process log.
- **What**: Initial stub REQUIREMENTS/CHANGELOG.
- **Files**: `docs/projects/booking/**`

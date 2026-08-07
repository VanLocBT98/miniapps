# Booking — Requirements (living / future-facing)

> Status: `active` · Last updated: 2026-08-06 · `@repo/booking`  
> **Spec pack:** [`requirements/`](./requirements/) · **Queue:** [`requirements/ACTIONS.md`](./requirements/ACTIONS.md) (complete · 20/20)  
> **Rule**: Chỉ giữ hiện tại + tương lai gần. Lịch sử → [`CHANGELOG.md`](./CHANGELOG.md).

## North star

Production-ready airline/travel **booking management** mini-app: standalone + mountable on Main SSR App (`/booking`), plus reusable **Customer Management** (`/customer`).

## Current focus (next / in-flight)

- _(trống — ACTIONS queue 20/20 done)_
- Optional: Optimization (`11-todo`); implement Playwright booking/customer cases

## Standing constraints

- Spec pack `requirements/00–12` + `ACTIONS.md` = product source of truth
- Platform: `AGENTS.md`
- Query = server state; Zustand = UI only
- API envelope `{ success, data, error, meta }`
- Permissions: `booking:view` / `booking:manage`; `customer:view` / `customer:manage`
- Business rules in `07-business-rules.md` (booking + customer)
- Host loaders `ensureQueryData` + SSR head via `@repo/booking/ssr`
- Legacy calendar behind `ENABLE_LEGACY_CALENDAR` (default `false`)

## Done baseline (đừng phá)

- Booking: list/create/detail tabs (passengers/flights/payment/documents/history)
- Customer CRUD: list/search/filter/sort, detail, form, soft-delete (`deleted_at`)
- Mock services + Zod + domain rules; Vitest (+ RTL smokes); Playwright stubs

## Out of scope

- Real GDS / payment gateway / Module Federation remote
- Customer future: timeline, booking history, loyalty, tags, CRM, merge, audit (see `12-customer.md`)

## Open questions

- _(none blocking)_

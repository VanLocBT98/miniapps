# Database (Postgres)

## Conventions

- PostgreSQL
- snake_case columns
- plural table names
- UUID primary keys

## customers

See `packages/db/drizzle/0000_customers.sql` and Drizzle schema `packages/db/src/schema/customers.ts`.

Soft-delete column `deleted_at` filters list/detail (`IS NULL`). Delete always sets `status = Inactive` and `deleted_at = now()` — row stays in DB, hidden from list/detail. `Inactive` without `deleted_at` still appears in list.

`department` is UI-only (not persisted). `owner` maps to `owner_id` via demo UUID labels in `@repo/db`.

## Local run

```bash
# Start Postgres (idempotent — OK if container already exists)
pnpm db:up

# Push schema + seed (defaults DATABASE_URL to local docker if unset)
pnpm db:push
pnpm db:seed

# App (loads DATABASE_URL from apps/main/.env*)
pnpm dev
```

Open `/customer` — data from Postgres when `DATABASE_URL` is set. Without it, Customer CRUD falls back to in-memory mock.

Connection default: `postgresql://miniapps:miniapps@localhost:5433/miniapps` (host `5433` → container `5432`, tránh conflict với Postgres local).

`pnpm db:up` starts or reuses container `miniapps-postgres`. If `docker compose` is missing from PATH, it falls back to `docker run`.

# MiniApps Platform

SSR Micro Frontend platform built with **TanStack Start** (no Next.js).

The **Main App** is a portal. Mini-apps (Dashboard, Admin, Booking, Portfolio) can run **standalone** or open through the portal with a shared `RuntimeContext` (`STANDALONE` | `PORTAL`).

## Structure

| Path | Role |
|------|------|
| `apps/main` | SSR host / portal |
| `projects/*` | Independently runnable mini apps |
| `packages/*` | Shared UI, auth, config, db, registry, runtime |
| `docs/` | Architecture, guides, sprint notes |

See `docs/FolderStructure.md`, `AGENTS.md`, and `docs/projects/SPRINT3-remote-projects.md`.

## Quick start

```bash
pnpm install
pnpm db:up && pnpm db:seed   # optional — Postgres for Customer CRUD
pnpm dev
```

Open http://localhost:3000

Demo logins:

- `admin@example.com` / `admin`
- `manager@example.com` / `manager`
- `viewer@example.com` / `viewer`

## Portal

- Landing cards load from `@repo/shared/registry` (hosts via `VITE_PROJECT_*_HOST`)
- Open a project: `/project/<id>` → enters the app with `?mode=portal`
- **Back to Home** appears only in portal mode

## Standalone mini apps

```bash
pnpm dev:dashboard
pnpm dev:admin
pnpm dev:booking
pnpm dev:portfolio
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Main SSR app |
| `pnpm db:up` / `db:seed` | Local Postgres + seed |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Vitest |
| `pnpm test:e2e` | Playwright |

## Environment

Copy from `apps/main/.env.development` patterns. Important keys:

- `DATABASE_URL` — optional Postgres for booking customers
- `VITE_PORTAL_HOST` — portal origin
- `VITE_PROJECT_BOOKING_HOST` (and dashboard/admin) — remote deploy origins

Do not commit real secrets; `.env` is gitignored.

## License

Private.

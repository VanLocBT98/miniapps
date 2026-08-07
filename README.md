# MiniApps Platform

SSR Micro Frontend platform built with **TanStack Start** (no Next.js).

The **Main App** is a portal. Mini-apps (Dashboard / Project A, Admin / Project B, Booking / Project C, Portfolio) run **standalone** or through the portal with a shared `RuntimeContext` (`STANDALONE` | `PORTAL`).

Repository: [VanLocBT98/miniapps](https://github.com/VanLocBT98/miniapps)

## Structure

| Path                 | Role                                              |
| -------------------- | ------------------------------------------------- |
| `apps/main`          | SSR host / portal (Vercel: Main)                  |
| `projects/dashboard` | Project A                                         |
| `projects/admin`     | Project B                                         |
| `projects/booking`   | Project C                                         |
| `projects/portfolio` | Additional mini-app                               |
| `packages/*`         | Shared UI, auth, config, db, API client, registry |
| `.github/workflows`  | Enterprise CI/CD                                  |

See `docs/FolderStructure.md`, [Deployment.md](./Deployment.md), and [Environment.md](./Environment.md).

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

## Local development

| Command                            | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `pnpm dev`                         | Main SSR app                             |
| `pnpm dev:dashboard`               | Project A standalone                     |
| `pnpm dev:admin`                   | Project B standalone                     |
| `pnpm dev:booking`                 | Project C standalone                     |
| `pnpm build` / `pnpm build:all`    | Turbo builds                             |
| `pnpm build:changed`               | Build only apps changed vs `origin/main` |
| `pnpm lint` / `typecheck` / `test` | Quality gates                            |
| `pnpm test:e2e`                    | Playwright                               |
| `pnpm security:audit`              | Critical dependency audit                |

API base URL is **`VITE_API_URL`** (development default `http://localhost:3001`). See [Environment.md](./Environment.md).

## CI/CD (automatic after GitHub push)

1. Open a PR → **CI** (lint, types, tests, Playwright smoke, changed builds) + **Preview** Vercel URLs on the PR.
2. Merge to **`main`** → **Production Deploy** of changed apps only.
3. Frontends connect to **api-mini-apps** via env vars (no code change between environments).

Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_MAIN`, `VERCEL_PROJECT_PROJECT_A|B|C`. Details in [Deployment.md](./Deployment.md).

## Portal

- Landing cards from `@repo/shared/registry` (`VITE_PROJECT_*_HOST`)
- `/project/<id>` → portal mode (`?mode=portal`)
- **Back to Home** only in portal mode

## Docker

```bash
docker compose up -d postgres          # DB on localhost:5433
docker compose --profile app up --build  # production image
```

## License

Private.

# Deployment

Enterprise CI/CD for the MiniApps monorepo: GitHub Actions → Vercel CLI (`pull` → `build` → `deploy` → `promote`).

## Branch strategy

| Branch      | Purpose      | Deploy                |
| ----------- | ------------ | --------------------- |
| `feature/*` | Feature work | Preview via PR only   |
| `develop`   | Integration  | CI + optional staging |
| `release/*` | Release prep | CI + preview          |
| `hotfix/*`  | Hotfixes     | CI + preview          |
| `main`      | Production   | Production deploy     |

Never deploy production from feature branches. Always use Pull Requests into `main` / `develop`.

## Applications (independent Vercel projects)

| Spec name | Package           | Root directory       | GitHub secret              |
| --------- | ----------------- | -------------------- | -------------------------- |
| Main      | `@repo/main`      | `apps/main`          | `VERCEL_PROJECT_MAIN`      |
| Project A | `@repo/dashboard` | `projects/dashboard` | `VERCEL_PROJECT_PROJECT_A` |
| Project B | `@repo/admin`     | `projects/admin`     | `VERCEL_PROJECT_PROJECT_B` |
| Project C | `@repo/booking`   | `projects/booking`   | `VERCEL_PROJECT_PROJECT_C` |

Each app owns its own `vercel.json`. Domains are configured in the Vercel dashboard (never hardcode URLs in app code).

## GitHub Actions

| Workflow | File                             | Trigger                         |
| -------- | -------------------------------- | ------------------------------- |
| CI       | `.github/workflows/ci.yml`       | PR + push to protected branches |
| Preview  | `.github/workflows/preview.yml`  | Pull requests                   |
| Deploy   | `.github/workflows/deploy.yml`   | Push to `main`                  |
| Release  | `.github/workflows/release.yml`  | Tags `v*.*.*`                   |
| Security | `.github/workflows/security.yml` | PR, push, weekly                |

### CI gates (block merge)

1. Install pnpm + restore caches (pnpm + Turbo)
2. Lint (Main + Project A/B/C + shared packages; Portfolio excluded until cleaned up)
3. Typecheck (deploy packages + shared; Main host typecheck deferred — Vite build is the ship gate)
4. Unit tests
5. Coverage thresholds (`@repo/shared` API client)
6. Playwright smoke (`e2e/smoke.spec.ts`)
7. Build **changed** apps only (`turbo run build --filter=…`)
8. Upload build artifacts

### Changed apps

`scripts/ci/detect-changed-apps.mjs` path-filters deployable apps. Shared `packages/**` or lockfile changes rebuild all deployable apps.

```bash
pnpm build:changed
# or
pnpm turbo run build --filter=@repo/dashboard
```

### Preview flow

1. Detect changed apps
2. Per app: `vercel pull` → `vercel build` → `vercel deploy --prebuilt`
3. Comment Preview URLs on the PR

### Production flow (main only)

1. Detect changed apps (path filters)
2. Per app: `vercel pull --environment=production` → `vercel build --prod` → `vercel deploy --prebuilt --prod` → `vercel promote`
3. Manual: Actions → Production Deploy → choose `main|project-a|project-b|project-c|all`

## Vercel project setup

1. Create four Vercel projects linked to this repo.
2. Set **Root Directory** to `apps/main`, `projects/dashboard`, `projects/admin`, `projects/booking`.
3. Copy each project’s ID into GitHub Secrets.
4. Set `VERCEL_TOKEN` and `VERCEL_ORG_ID` on the repository.
5. Configure production / preview env vars in Vercel (see [Environment.md](./Environment.md)).

## Rollback

1. Vercel Dashboard → Project → Deployments → promote a previous successful deployment, **or**
2. Re-run Production Deploy with an earlier commit SHA (`workflow_dispatch` after checkout pin), **or**
3. `vercel promote <deployment-url> --token=$VERCEL_TOKEN` with the last-known-good URL.

## Docker (optional / self-host)

```bash
# Postgres only (local default)
pnpm db:up

# Production image + Postgres
docker compose --profile app up --build

# Development image
docker compose --profile dev up --build
```

Multi-stage `Dockerfile` targets: `development`, `build`, `production` (health checks included).

## Cache strategy

- **pnpm**: `actions/setup-node` `cache: pnpm`
- **Turbo**: `.turbo` restored via `actions/cache`
- **GitHub Actions**: concurrency groups cancel superseded PR runs

## Troubleshooting

| Symptom                                   | Fix                                                             |
| ----------------------------------------- | --------------------------------------------------------------- |
| Preview job fails “Missing GitHub secret” | Add `VERCEL_PROJECT_*` secrets                                  |
| Build works locally, fails on Vercel      | Align Node 22 / pnpm 11.20; check Root Directory                |
| API calls hit wrong host                  | Set `VITE_API_URL` in Vercel env (see Environment.md)           |
| CI builds all apps                        | Shared package or lockfile changed — expected                   |
| Playwright flaky                          | Check `webServer` timeout; smoke suite only in CI               |
| `vercel promote` warns                    | Deployment may already be production; verify alias in dashboard |

## End-to-end automation

After secrets and Vercel projects exist:

1. Push a branch and open a PR → CI + Preview URLs
2. Merge to `main` → Production deploy of changed apps
3. Frontends talk to `api-mini-apps` via `VITE_API_URL` with no code changes

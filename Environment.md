# Environment configuration

Never hardcode API or deployment URLs in feature code. Use environment variables and the typed client from `@repo/shared/api`.

## Backend: api-mini-apps

| Environment | `VITE_API_URL`                             |
| ----------- | ------------------------------------------ |
| Development | `http://localhost:3001`                    |
| Staging     | `https://staging-api-mini-apps.vercel.app` |
| Production  | `https://api-mini-apps.vercel.app`         |

Optional `VITE_APP_ENV`: `development` | `staging` | `production`  
If `VITE_API_URL` is unset, `resolveApiBaseUrl()` picks the default host for that mode.

### Typed client

```ts
import { createApiClient, getApiClient, resolveApiBaseUrl } from '@repo/shared/api'

const api = getApiClient({
  env: import.meta.env as Record<string, string | undefined>,
})

await api.get('/health')
```

## Public (Vite) variables

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `VITE_API_URL`         | Backend base URL (`api-mini-apps`)         |
| `VITE_APP_ENV`         | `development` \| `staging` \| `production` |
| `VITE_APP_NAME`        | Product name                               |
| `VITE_APP_URL`         | Public origin of this frontend             |
| `VITE_PORTAL_HOST`     | Main portal origin                         |
| `VITE_PROJECT_*_HOST`  | Optional remote mini-app hosts             |
| `VITE_SENTRY_DSN`      | Optional — observability bootstrap         |
| `VITE_ENABLE_DEVTOOLS` | React Query / Router devtools              |

## Server variables (Main / SSR)

| Variable              | Description                         |
| --------------------- | ----------------------------------- |
| `DATABASE_URL`        | Postgres (booking customers)        |
| `SESSION_SECRET`      | Session signing (≥16 chars)         |
| `APP_URL` / `API_URL` | Server-side companions to Vite vars |
| `AUTH_COOKIE_NAME`    | Session cookie name                 |

## GitHub Secrets

| Secret                     | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `VERCEL_TOKEN`             | Vercel CLI auth                             |
| `VERCEL_ORG_ID`            | Vercel team / org                           |
| `VERCEL_PROJECT_MAIN`      | Main app project id                         |
| `VERCEL_PROJECT_PROJECT_A` | Dashboard (Project A)                       |
| `VERCEL_PROJECT_PROJECT_B` | Admin (Project B)                           |
| `VERCEL_PROJECT_PROJECT_C` | Booking (Project C)                         |
| `GITHUB_TOKEN`             | Provided by Actions (PR comments, releases) |

Never commit secrets. `.env` and `.env.*.local` are gitignored.

### Optional GitHub Variables (non-secret)

| Variable                  | Suggested value                            |
| ------------------------- | ------------------------------------------ |
| `VITE_API_URL_STAGING`    | `https://staging-api-mini-apps.vercel.app` |
| `VITE_API_URL_PRODUCTION` | `https://api-mini-apps.vercel.app`         |

## Local development

```bash
pnpm install
cp apps/main/.env.development apps/main/.env.local   # optional overrides
pnpm db:up && pnpm db:seed                           # optional Postgres
pnpm dev                                             # http://localhost:3000
```

Point `VITE_API_URL` at a local `api-mini-apps` (`http://localhost:3001`) or leave the development default.

## Staging / Production on Vercel

Set per-project Environment Variables in the Vercel dashboard (Production / Preview):

- Production: `VITE_API_URL=https://api-mini-apps.vercel.app`, `VITE_APP_ENV=production`
- Preview: `VITE_API_URL=https://staging-api-mini-apps.vercel.app`, `VITE_APP_ENV=staging`

CI passes the same values during `vercel build` when GitHub Variables are set.

## Coverage thresholds

Configured in `packages/shared/vitest.config.ts` for the API client package. CI fails if coverage drops below the configured lines/functions/branches/statements thresholds. Raise thresholds as tests grow.

## Observability

- Production builds emit **source maps** (`build.sourcemap: true`).
- `bootstrapObservability()` in the Main app prepares Sentry/OTel hooks via `@repo/shared/observability` without coupling feature modules.
- Set `VITE_SENTRY_DSN` when wiring a real Sentry SDK in `apps/main/src/lib/observability.ts`.

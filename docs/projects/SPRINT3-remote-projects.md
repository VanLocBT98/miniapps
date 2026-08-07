# Sprint 3 — Remote Projects Integration

## Goal

Main App is a **portal**. Each mini-app remains an independent SSR app that can also be opened through the portal. Business pages stay unaware of Module Federation / Single-SPA — they only read `RuntimeContext`.

## Concepts

| Piece | Package | Role |
|--------|---------|------|
| `ApplicationMode` | `@repo/shared/runtime` | `STANDALONE` \| `PORTAL` |
| `RuntimeProvider` / `useRuntime` | `@repo/shared/runtime` | Detect mode from path/query; expose `portalHost`, `currentProject` |
| Project registry | `@repo/shared/registry` | Catalog + env hosts; cached; not hardcoded in UI |
| Portal landing cards | `apps/main` | Load registry → Open → `/project/$projectId` |
| SEO helpers | `@repo/shared/seo` | `pageSeoToHead` for title/description/canonical/OG/Twitter |

## Registry & hosts

Catalog lives in `@repo/shared/registry` (`PROJECT_CATALOG`). Hosts come from env:

```bash
VITE_PORTAL_HOST=http://localhost:3000
VITE_PROJECT_DASHBOARD_HOST=https://dashboard.vercel.app
VITE_PROJECT_ADMIN_HOST=https://admin.vercel.app
VITE_PROJECT_BOOKING_HOST=https://booking.vercel.app
```

(Alias naming like `PROJECT_A_HOST` can map onto these keys in deploy config.)

`loadProjectRegistry({ env })` merges catalog + hosts. UI calls `getPortalRegistry()` — never hardcodes cards.

## Routing

| Mode | Example |
|------|---------|
| Standalone | `https://booking.vercel.app/detail/1` |
| Portal entry | `https://main.vercel.app/project/booking` → enters local mount with `?mode=portal&portalHost=…` |
| Portal deep (local) | same app origin + project `basePath` + portal query |

Today, portal entry **redirects into the in-process package mount** so SSR SEO on Main stays intact. When only a remote `host` is configured (no local package), the portal redirects to that origin with portal query flags.

Future: reverse-proxy or Module Federation can replace the redirect without changing page components (they only use `useRuntime()`).

## Navigation

- **PORTAL** → “Back to Home” visible in `AppHeader` (uses `portalHomePath`)
- **STANDALONE** → button hidden

Detection (no hardcoding):

1. Path `/project/:projectId/...`
2. Query `mode=portal` or `portal=1`
3. Else `STANDALONE`

## SEO

Each project keeps owning `head()` metadata. Portal routes emit registry-based title/description/canonical/OG/Twitter. Use `@repo/shared/seo` `pageSeoToHead` for consistency.

## Errors

Unavailable / unknown registry id → `ProjectUnavailable` (Retry + Return Home). Portal must not crash.

## Performance

- Registry cached in memory (TTL)
- Landing cards prefetch portal + remote origin on hover/focus
- Do not download every project bundle on first paint

## Future migration

Keep boundaries:

- **Registry** → remote manifest / edge config
- **RuntimeContext** → federation bootstrap props
- **Portal route** → iframe / proxy / import-map host

Business features (booking, admin, …) should only depend on `@repo/shared/runtime` + `@repo/ui`, not on how the portal embeds them.

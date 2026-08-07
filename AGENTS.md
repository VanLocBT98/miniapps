# AGENTS.md — Development Contract

> **Authority**: This document is the single source of truth for how humans and AI agents build, change, and review this repository.
> **Audience**: Staff engineers, feature engineers, and coding agents.
> **Phase**: Phase 1 — Contract only. Do not generate application code until architecture (Phase 2) is approved against this file.
> **Last verified dependency snapshot**: 2026-08-06 (always re-verify before installing).

---

## 0. Mission Statement

Build a **modern SSR React platform without Next.js**, using **TanStack Start** as the application framework, organized as a **Micro Frontend–ready monorepo**.

Multiple **mini applications** (projects) must be developable independently and later mounted into one **Main App** with SSR, streaming, shared shell concerns, and isolated business logic.

This is an architecture experiment that must remain **maintainable, type-safe, and migration-ready** for Module Federation later — **without adopting Module Federation now**.

### Non-goals (current phase)

- Next.js / Remix / Astro as the app framework
- Module Federation / Webpack remotes in v1
- Backend-for-everything (full BFF) before product domains exist
- Shared global mutable state as the default integration pattern
- “Quick demo” architecture that cannot scale to many teams

### Success criteria

| Criterion | Definition of done |
|-----------|-------------------|
| SSR | Full-document SSR from TanStack Start |
| Streaming | Progressive HTML streaming with Suspense boundaries |
| Type-safe routing | TanStack Router end-to-end (params, search, loaders) |
| Type-safe API | Zod-validated inputs/outputs + typed server functions / query keys |
| Modular MFE | Each project installable via `createProject()` / `registerProject()` |
| DX | pnpm workspace, strict TS, ESLint, Prettier, Husky, Vitest, Playwright |
| Migration path | Clear package boundaries that map 1:1 to future federated remotes |

---

## 1. Role of This Document

Every contributor and agent **must**:

1. Read this file before generating or modifying code.
2. Prefer scalable architecture over shortcuts.
3. Explain **why** for structural decisions (packages, boundaries, SSR strategy).
4. Never skip architecture discussion when changing folder layout, dependency graphs, or SSR boundaries.
5. Re-verify **latest stable** package versions before writing or updating any `package.json`.
6. Follow the phased execution plan (Section 24). Do not jump ahead.

If a proposed change conflicts with this contract, **stop and resolve the conflict in writing** (update this file or reject the change) before coding.

---

## 2. Execution Phases (Mandatory Order)

| Phase | Deliverable | Exit criteria |
|-------|-------------|----------------|
| **1** | `AGENTS.md` (this file) | Contract reviewed; no app code yet |
| **2** | Architecture design (`Architecture.md`) | Boundaries, SSR model, project contract agreed |
| **3** | Folder structure (`FolderStructure.md` + empty trees) | Paths match architecture |
| **4** | Root + package `package.json` files | Versions verified same day |
| **5** | Install dependencies (`pnpm install`) | Lockfile committed; scripts resolve |
| **6** | Tooling (TS, ESLint, Prettier, Tailwind, Vitest, Playwright, Husky) | `pnpm lint`, `pnpm typecheck`, `pnpm test` run |
| **7** | Main App shell (TanStack Start) | SSR hello path works |
| **8** | First Mini App (e.g. `dashboard`) | Registered into Main App |
| **9** | SSR integration (streaming, loaders, prefetch, SEO) | Checklists in Sections 16–18 pass |
| **10** | Validation | Full checklists green; docs complete |

**Rule**: At every phase, document **why** decisions were made. Never skip architecture discussion.

---

## 3. Preferred Tech Stack (Pinned Intent)

Always use the **latest stable** release at install time. The versions below were verified on **2026-08-06** and are a **snapshot for orientation only** — re-run `npm view <pkg> version` (or `pnpm view`) before generating `package.json`.

| Concern | Choice | Snapshot (2026-08-06) | Why |
|---------|--------|----------------------|-----|
| App framework | TanStack Start (`@tanstack/react-start`) | `1.168.37` (RC, API stable) | SSR + streaming + server functions on TanStack Router; not Next.js |
| Router | TanStack Router (`@tanstack/react-router`) | `1.170.20` | Type-safe routes, loaders, search params |
| Language | TypeScript | `5.x` (`7.0.2` latest on npm; use Start/Vite-compatible stable — prefer latest that peers allow) | Strict types across packages |
| Build | Vite | `8.2.0` | Official Start build path; fast HMR |
| UI library | React | `19.2.8` | Concurrent features, Suspense, Compiler readiness |
| Data | TanStack Query | `5.101.4` | Cache, prefetch, SSR hydration |
| Tables | TanStack Table | `9.0.0` | Headless, composable |
| Forms | TanStack Form | `1.33.3` | Headless + Zod adapters |
| Validation | Zod | `4.3.3` | Runtime + type inference |
| Client state | Zustand | `5.0.14` | Small, opt-in shared state |
| Styling | **Tailwind CSS v4** (chosen) | `4.3.3` | Preferred #1; CSS-first, excellent Vite DX |
| Icons | Lucide React | `0.x` / `1.28.0` | Tree-shakeable SVG icons |
| Animation | Motion (`motion`) | `13.0.0` | Modern Motion API (formerly Framer Motion) |
| Unit/integration | Vitest + Testing Library | Vitest `4.1.10`, RTL `16.3.2` | Vite-native tests |
| E2E | Playwright | `@playwright/test` `1.62.1` | Cross-browser SSR + hydration checks |
| Lint/format | ESLint + Prettier | ESLint `10.8.0`, Prettier `3.9.6` | Consistent style |
| Git hooks | Husky + lint-staged | Husky `9.1.7`, lint-staged `17.3.0` | Pre-commit quality gate |
| Package manager | **pnpm** | `11.20.0` | Strict workspaces, efficient linking |
| React Compiler | `babel-plugin-react-compiler` | `1.0.0` | Prefer compiler-compatible patterns |

### Styling decision (locked)

**Use Tailwind CSS v4 only.** Do not introduce Panda CSS or UnoCSS unless this contract is amended.

**Why Tailwind v4**: first preference in product requirements; excellent Vite integration; utility-first fits shared UI packages; CSS-first config reduces JS config drift across mini apps.

### Framework notes

- TanStack Start is **Release Candidate** but feature-complete with a stable API surface. Track upstream release notes on every upgrade.
- Prefer **Vite** as the Start build tool (not Rsbuild) unless a documented need forces otherwise.
- **Do not** use React Server Components as the default architecture until Start’s RSC story is production-stable for this monorepo. Prefer loaders + server functions + streaming Suspense for v1.

---

## 4. Repository Topology (Target)

```text
miniApps/                          # monorepo root
├── AGENTS.md                      # this contract
├── README.md
├── Architecture.md                # Phase 2
├── FolderStructure.md             # Phase 3
├── DevelopmentGuide.md
├── pnpm-workspace.yaml
├── package.json
├── turbo.json                     # optional; add if multi-package scripts need orchestration
├── apps/
│   └── main/                      # Main App — TanStack Start host
├── projects/                      # Mini applications (installable)
│   ├── dashboard/
│   ├── admin/
│   ├── booking/
│   ├── blog/
│   └── profile/
├── shared/                        # Cross-cutting product shared code (not publishable UI kit)
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── api/
│   ├── constants/
│   └── config/
└── packages/                      # Hard boundaries / tooling / design system
    ├── ui/                        # Shared UI primitives (design system)
    ├── config/                    # Shared app config helpers
    ├── eslint/                    # Shared ESLint configs
    └── tsconfig/                  # Shared TSConfigs
```

### Mini app internal layout (BASIC-APP)

Every `projects/<name>` follows the BASIC-APP shape:

`src/{assets,components,layouts,pages,router,shared/{configs,constants,locales,services,stores,types,utils}}` plus `pipelines/`, `public/`, `sdk/`, multi-env `.env*`, and `project.ts` for host registration.

### Why this split

| Layer | Purpose | Coupling |
|-------|---------|----------|
| `apps/main` | Host shell: SSR entry, layout chrome, auth gate, project registry | Depends on projects + packages |
| `projects/*` | Domain mini apps | Depend on `packages/*` and optionally `shared/*`; **never** on other projects |
| `shared/*` | Thin product-level shared helpers (auth helpers, env parsing, i18n glue) | No domain business rules |
| `packages/*` | Versionable, strict boundaries (UI kit, tooling) | No knowledge of any mini app |

**Forbidden**:

- `projects/booking` importing from `projects/admin`
- Domain logic living in `apps/main`
- UI primitives duplicated in every project instead of `packages/ui`
- Circular dependencies between packages

---

## 5. Micro Frontend Platform Contract

Module Federation is **out of scope for v1**. Architecture must still behave like a MFE platform.

### 5.1 Project manifest

Every mini app **must** export a project definition:

```ts
// projects/<name>/src/project.ts
import type { MiniProject } from '@shared/project-contract' // conceptual path

export const project = createProject({
  id: 'dashboard',
  name: 'Dashboard',
  version: '0.1.0',
  basePath: '/dashboard',
  routes: () => import('./routes'),
  navigation: () => import('./navigation'),
  permissions: () => import('./permissions'),
  layout: () => import('./layout'),
  services: () => import('./services'),
  translations: () => import('./translations'),
})
```

### 5.2 Required project surface

| Export | Responsibility |
|--------|----------------|
| `routes` | Route tree fragment(s) for TanStack Router composition |
| `navigation` | Nav items (label, path, icon, order, permission keys) |
| `permissions` | Permission keys + optional guards metadata |
| `layout` | Optional project shell (nested layout route) |
| `services` | Domain service factories (API clients, server fns) — no React |
| `translations` | i18n namespaces for this project |

### 5.3 Registration API

Main App discovers installed projects via an explicit registry (auto-discovery by workspace package convention):

```ts
registerProject(project)
// or
createProject({ ... }) // returns ProjectDefinition used by registerProject
```

**Discovery rule (v1)**:

1. Each `projects/*` package exports `project` from its package entry.
2. `apps/main` imports the installed project packages listed in its `package.json` dependencies / workspace protocol.
3. A central `registerInstalledProjects()` calls `registerProject` for each.
4. Optional later: codegen that scans workspace packages with `"miniapp": true` in `package.json`.

**Why not auto-magic filesystem scanning at runtime?** SSR, bundling, and type-safety require static import graphs. Convention + workspace deps keep the graph explicit and Compiler/Vite friendly.

### 5.4 Isolation rules

| Concern | Shared? | Where |
|---------|---------|-------|
| Routing composition | Yes (host merges trees) | `apps/main` |
| UI primitives | Yes | `packages/ui` |
| Authentication session | Yes | `shared` + Main App middleware |
| Domain business logic | **No** | Owning `projects/*` only |
| Cross-project state | Avoid; allow only via documented shared stores | `shared` with explicit owners |
| HTTP / server functions | Per-project + shared auth middleware | project `api/` / `services/` |

### 5.5 Module Federation migration path (future)

Design so each `projects/<name>` can become a remote with minimal change:

1. Keep **one public entry** per project (`project.ts` + route tree).
2. Avoid host-only relative imports into projects.
3. Keep shared runtime deps (`react`, `react-dom`, router, query) as **peerDependencies** of projects.
4. Do not bake host paths into project code (`@/apps/main/...` forbidden inside projects).
5. Prefer URL-based navigation and typed route IDs over imperative cross-project imports.

When MF is introduced later, `registerProject` can load remote manifests instead of static workspace imports — **the project surface stays the same**.

---

## 6. Feature-First Architecture (Inside Each Project)

Inside every mini app:

```text
projects/dashboard/
├── package.json
├── tsconfig.json
├── src/
│   ├── project.ts                 # createProject() export
│   ├── routes/                    # TanStack Router route files
│   ├── features/                  # Feature modules (primary unit of work)
│   │   └── bookings-list/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── api/
│   │       ├── types/
│   │       ├── utils/
│   │       └── index.ts           # public feature API only
│   ├── components/                # Project-local shared UI (not design system)
│   ├── hooks/
│   ├── api/                       # Project-level API / server functions
│   ├── types/
│   ├── navigation.ts
│   ├── permissions.ts
│   ├── layout.tsx
│   ├── services/
│   └── translations/
└── tests/
```

### Feature rules

1. **Features own their UI + data + types** for that capability.
2. Cross-feature imports go through the feature’s **public `index.ts`** only.
3. Prefer moving shared-within-project code to `components/` / `hooks/` only after **2+ features** need it.
4. Do not create deep `utils/helpers/lib` dumping grounds.
5. Routes stay thin: compose features, wire loaders, define search schemas.

---

## 7. Naming Conventions

### 7.1 Folders

| Pattern | Rule | Example |
|---------|------|---------|
| Packages / apps | `kebab-case` | `apps/main`, `projects/booking` |
| Features | `kebab-case` | `features/user-profile` |
| Route segments | match URL segment style | `routes/bookings/$bookingId` |
| Tests colocated | `*.test.ts(x)` next to unit OR under `__tests__/` | `Button.test.tsx` |
| E2E | `*.spec.ts` under `e2e/` | `e2e/dashboard.spec.ts` |

### 7.2 Files

| Kind | Convention | Example |
|------|------------|---------|
| React component | `PascalCase.tsx` | `BookingCard.tsx` |
| Hook | `useCamelCase.ts` | `useBookingFilters.ts` |
| Utility | `camelCase.ts` or `kebab-case.ts` (pick one per package; default **kebab-case** for non-React) | `format-currency.ts` |
| Types | `*.types.ts` or inside feature `types.ts` | `booking.types.ts` |
| Zod schemas | `*.schema.ts` | `booking.schema.ts` |
| Constants | `*.constants.ts` | `booking.constants.ts` |
| Server functions | `*.server.ts` or `api/*.ts` with clear server boundary | `create-booking.server.ts` |
| Query modules | `*.queries.ts` | `bookings.queries.ts` |
| Test | matches source | `BookingCard.test.tsx` |

### 7.3 Symbols

| Kind | Convention |
|------|------------|
| Components | `PascalCase` |
| Hooks | `useXxx` |
| Types / interfaces | `PascalCase`; prefer `type` over `interface` unless declaration merging is required |
| Enums | Avoid; prefer union types + `as const` objects |
| Zod schemas | `xxxSchema` / `XxxSchema` consistently; inferred type `Xxx` |
| Query keys | factory object `xxxKeys` |
| Constants | `UPPER_SNAKE` only for true constants; otherwise `camelCase` |
| Project ids | `kebab-case` string literals (`'dashboard'`) |

---

## 8. Component Conventions

1. **Function components only.** No class components.
2. **One primary component per file.** Subcomponents allowed if tiny and private.
3. Props: explicit `type XxxProps = { ... }`. No `React.FC` (weaker children typing / noise).
4. Prefer **composition** over prop explosion (`children`, slots, render props sparingly).
5. Keep components **small** (< ~150 lines preferred; split earlier if mixed concerns).
6. No business API calls directly in presentational components — use hooks/features.
7. Design-system components live in `packages/ui` and must be **headless-friendly** / accessible by default.
8. Project components must not re-implement `packages/ui` primitives.
9. Client-only APIs (`window`, `localStorage`, browser observers) must be isolated behind `useEffect` / client-only components with clear SSR guards.
10. Prefer server-friendly rendering: avoid unnecessary `'use client'`-style boundaries; with Start, follow framework directives/patterns when introduced — default to isomorphic components.

### Do / Don’t — Components

```tsx
// ✅ DO — thin route, feature owns UI
function BookingsPage() {
  return <BookingsListFeature />
}

// ❌ DON’T — fat page with duplicated fetch + UI + permissions
```

```tsx
// ✅ DO
type ButtonProps = { variant?: 'primary' | 'secondary'; children: React.ReactNode }

// ❌ DON’T
const Button: React.FC<any> = (props) => { ... }
```

---

## 9. Hook Conventions

1. Name: `use` + domain + purpose (`useBookingSearchParams`).
2. One hook = one concern.
3. Hooks may compose Query / Form / Zustand; they must not import other projects.
4. Return stable, typed objects. Prefer descriptive keys over positional tuples unless idiomatic (`useState`).
5. Encapsulate side effects; expose minimal surface.
6. SSR-safe: no unconditional browser API access at module top-level or during render.
7. Shared hooks → `shared/hooks` or `packages/ui` only when truly cross-project.

---

## 10. API & Server Function Conventions

### 10.1 Principles

1. **Zod at the boundary** — validate all external input (search params, server function args, HTTP bodies).
2. Prefer **TanStack Start Server Functions** for app-internal mutations/queries that need server privileges.
3. Use **API / server routes** for external webhooks, public HTTP, or non-Start clients.
4. Never trust client-sent permissions; enforce on server with shared auth middleware.
5. Map domain errors to typed error results; do not leak stack traces to clients.

### 10.2 Suggested layout

```text
features/x/api/
  x.schema.ts
  x.queries.ts
  x.mutations.ts
  x.server.ts
```

### 10.3 TanStack Query conventions

1. **Query key factories** per domain:

```ts
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: BookingFilters) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
}
```

2. Colocate `queryOptions` / `mutationOptions` with the feature.
3. Use Query for **server state**; Zustand for **client UI state** only.
4. Prefetch in route loaders where it improves SSR TTFB / streaming.
5. Dehydrate/hydrate Query cache per Start + Query SSR guidance (implement in Phase 9).
6. No anonymous string keys scattered in components.

### 10.4 Forms

- TanStack Form + Zod schemas.
- Schema is source of truth; infer form input types from Zod.
- Reuse schemas between client validation and server functions.

---

## 11. State Management Rules

| State type | Tool | Examples |
|------------|------|----------|
| Server/async | TanStack Query | bookings list, user profile from API |
| URL state | TanStack Router search params (+ Zod) | filters, pagination, tabs |
| Local UI | `useState` / `useReducer` | open/closed, ephemeral input |
| Cross-route client UI | Zustand (sparingly) | sidebar collapsed, wizard draft |
| Auth session | Shared auth module + server middleware | session user, tokens (httpOnly cookies preferred) |

**Do not** put server entities into Zustand “because it’s easier”.

**Do not** create a mega global store for all mini apps.

---

## 12. Routing Rules (TanStack Router + Start)

1. Routes are the application contract — keep them typed.
2. Validate search params with Zod.
3. Loaders for data needed before meaningful paint; Suspense for deferrable streams.
4. Every meaningful route subtree gets:
   - pending / loading UI
   - error boundary
   - optional not-found handling
5. Code-split by route by default (lazy route components).
6. Main App owns root layout, auth gate, and project mount points.
7. Mini apps contribute route trees under their `basePath`.
8. No hard-coded absolute URLs in features when a typed `Link` / route API exists.

---

## 13. SSR / Streaming / Hydration Rules

### Must support

- Full-document SSR
- Streaming SSR
- Hydration without visual thrash
- Lazy loading / route-level code splitting
- Route-level pending states
- Error boundaries
- Suspense boundaries
- Data prefetch (loaders + Query)
- SEO-friendly rendering (title, meta, canonical where applicable)

### Hard rules

1. **No `window` / `document` / `localStorage` during SSR render.** Guard or defer.
2. Avoid `typeof window !== 'undefined'` sprinkled randomly — centralize browser checks / client-only components.
3. Render **deterministic** HTML for the same request inputs (watch dates, random IDs, locale).
4. Prefer streaming with explicit Suspense boundaries around slow panels.
5. Keep root shell fast: auth + chrome first; defer heavy widgets.
6. Images/fonts: use modern best practices (appropriate sizes, no layout shift).
7. Secrets never in client bundles. Server-only modules must stay server-only.
8. Prefer isomorphic data loaders over client `useEffect` fetching for primary content (SEO + DX).

### SEO checklist (minimum)

- Unique titles per route
- Meta description where product requires
- Semantic headings / landmarks
- SSR content for indexable primary text
- Correct status codes for not-found / errors (Phase 9)

---

## 14. Styling Rules (Tailwind CSS v4)

1. Tailwind v4 CSS-first configuration (e.g. `@import "tailwindcss"`).
2. Design tokens (colors, spacing, typography) defined once and consumed by `packages/ui` + apps.
3. No ad-hoc inline styles except dynamic measured values.
4. No CSS Modules / styled-components unless an exception is documented.
5. Prefer utility composition + `cn()` helper (clsx + tailwind-merge) in `packages/ui`.
6. Motion for intentional animation only — no decorative noise on every element.
7. Respect reduced-motion preferences.

---

## 15. TypeScript Rules

1. `strict: true` everywhere.
2. **`no any`**. Use `unknown` + narrowing. Exceptional `any` requires justification comment and must not cross package boundaries.
3. Prefer **inference** over explicit types when clarity doesn’t suffer.
4. Share types via Zod inference (`z.infer<>`) at IO boundaries.
5. Use path aliases (absolute imports) — see Section 20.
6. `satisfies` for config objects.
7. Avoid enums; prefer unions.
8. Don’t export types that aren’t part of a package’s public API.
9. Enable consistent unused checks; no dead exports in public barrels.
10. React Compiler compatibility: avoid patterns that break purity/memoization assumptions (side effects during render, unstable mutable captures). Prefer simple, compiler-friendly components over hand-memoization unless proven necessary.

---

## 16. Error Handling & Logging

### Errors

1. Domain errors are typed (`AppError`, `AuthError`, `NotFoundError`, etc.) in shared package.
2. Map unknown errors at boundaries; log with correlation IDs when available.
3. User-facing messages are safe and i18n-ready; developer details stay in logs.
4. Route error components for recoverable UI failures.
5. Server functions: validate → authorize → execute → map result/error.

### Logging

1. Use a shared logger abstraction (no raw `console.log` in production paths).
2. Levels: `debug | info | warn | error`.
3. Include: request id, project id, route id when available.
4. Never log secrets, tokens, or PII beyond what policy allows.
5. Browser logging must be environment-gated.

---

## 17. Environment Variables

1. Use `.env` files locally; never commit secrets.
2. Prefix public client vars per Start/Vite convention (typically `VITE_` — confirm against Start docs at implementation time).
3. Validate env with Zod at startup (`shared/config` or `packages/config`).
4. Document every variable in `DevelopmentGuide.md`.
5. Server-only secrets must not be imported by client entry graphs.
6. Per-project env keys should be namespaced (`BOOKING_API_URL`, etc.) when colliding risk exists.

---

## 18. Performance Contract

Optimize for:

- SSR time to first byte / first meaningful stream chunk
- Bundle splitting per route / project
- Tree shaking (ESM, side-effect-free packages)
- Lazy imports for heavy features
- Caching (HTTP + Query)
- Prefetching (intent-based links, loader prefetch)
- React Compiler-friendly code

### Performance checklist (PR)

- [ ] Heavy deps are route-lazy or project-lazy
- [ ] No accidental client import of server-only modules
- [ ] Lists virtualize when large (when required)
- [ ] Images sized; no huge static imports
- [ ] Query keys stable; no over-fetch storms
- [ ] Avoid blocking the root shell on non-critical data
- [ ] Measure before micro-optimizing (`useMemo`/`useCallback` not by default)

---

## 19. Accessibility Contract

- [ ] Keyboard operable for interactive UI
- [ ] Focus visible
- [ ] Correct roles / labels (`aria-*` only when native semantics insufficient)
- [ ] Color contrast meets WCAG AA for product UI
- [ ] Do not convey meaning by color alone
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Forms associate labels and error messages
- [ ] Route changes announce meaningfully where applicable

`packages/ui` components are expected to be accessible by default.

---

## 20. Imports, Aliases, Barrels

### Absolute imports

Use package names / TS path aliases — no deep relative `../../../`.

Examples (final alias map defined in Phase 6):

```ts
import { Button } from '@repo/ui'
import { createProject } from '@repo/shared/project'
import { useBookingList } from '../features/bookings-list'
```

### Import order (Prettier / ESLint enforced)

1. Side-effect imports
2. Node / framework builtins
3. External packages
4. Internal `@repo/*` / workspace packages
5. Absolute app aliases
6. Relative imports
7. Type-only imports (`import type`) grouped consistently
8. Styles last (if any)

### Barrel exports

- Allowed at package public entry and feature `index.ts`.
- **Do not** create barrels that re-export entire trees and destroy tree-shaking.
- Prefer explicit named exports.
- No default exports except where a framework file requires it.

---

## 21. Testing Contract

### Layers

| Layer | Tool | What |
|-------|------|------|
| Unit | Vitest | utils, schemas, pure logic |
| Component | Vitest + Testing Library | UI behavior |
| Integration | Vitest | feature hooks + query/msw |
| E2E | Playwright | SSR pages, navigation, auth smoke |

### Rules

1. Critical domain logic must have unit tests.
2. Shared UI primitives need interaction/a11y tests.
3. Each mini app should ship at least one Playwright smoke for its `basePath`.
4. Prefer testing behavior over implementation details.
5. Deterministic tests: no flaky timers/network without control.
6. Do not hit real production APIs in CI.

### Testing checklist (PR)

- [ ] New logic covered or justified why not
- [ ] Snapshots only when valuable (prefer assertions)
- [ ] E2E updated for user-visible routing/auth changes

---

## 22. Git, Commits, Branches

### Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, releasable |
| `feat/<area>-<short>` | Features |
| `fix/<area>-<short>` | Bug fixes |
| `chore/<short>` | Tooling / deps |
| `docs/<short>` | Documentation |

Prefer short-lived branches. Mini-app work stays inside that project’s package when possible.

### Commit messages (Conventional Commits)

```text
feat(dashboard): add bookings list filters
fix(main): hydrate query cache on SSR
chore(deps): bump tanstack start
docs(agents): clarify project registration
refactor(ui): split Button variants
test(booking): cover price schema edge cases
```

Rules:

- Present tense, imperative
- Scope = package/app/project id when possible
- No secret material in commit messages

### PR expectations

- Small, reviewable diffs
- Architecture changes update `Architecture.md` / this file
- Include checklist results relevant to the change

---

## 23. Code Review Checklist

### Architecture

- [ ] No illegal cross-project imports
- [ ] New shared code has a clear owner and boundary
- [ ] MFE surface (`routes/navigation/permissions/...`) still valid
- [ ] SSR boundaries respected

### Quality

- [ ] No `any`
- [ ] Zod at IO boundaries
- [ ] Errors handled
- [ ] Naming conventions followed
- [ ] Absolute imports
- [ ] No dead barrels / circular deps

### UX / A11y / Perf

- [ ] Loading / error / empty states
- [ ] Accessibility checklist considered
- [ ] Performance checklist considered

### Tests / DX

- [ ] Tests added/updated
- [ ] Env vars documented if added
- [ ] Docs updated when contracts change

---

## 24. Do and Don’t

### Do

- Treat `AGENTS.md` as law until amended
- Verify latest stable versions before writing `package.json`
- Keep mini apps independently understandable
- Use feature-first folders
- Prefer typed loaders + server functions
- Compose projects through `registerProject`
- Write for React Compiler & SSR first
- Explain **why** on structural PRs
- Keep Main App thin

### Don’t

- Use Next.js
- Introduce Module Federation in v1
- Share domain logic across projects via deep imports
- Fetch primary SEO content only in `useEffect`
- Dump everything into `shared`
- Use `any` / disable strictness to “move fast”
- Commit secrets
- Generate the entire monorepo in one unreviewable blast without phases
- Copy outdated tutorial stacks (Pages Router patterns, old Tailwind v3-only setups, Framer package name when `motion` is current, etc.)

---

## 25. Documentation Set (Required Artifacts)

| File | Phase | Purpose |
|------|-------|---------|
| `AGENTS.md` | 1 | Development contract (this file) |
| `Architecture.md` | 2 | Deep architecture: SSR model, registry, auth, data flow diagrams |
| `FolderStructure.md` | 3 | Exact tree + ownership rules |
| `DevelopmentGuide.md` | 6+ | Setup, scripts, env, workflows |
| `README.md` | 4–7 | Human entrypoint: what/why/how to run |
| `docs/projects/<id>/REQUIREMENTS.md` | ongoing | Product requirements for mini-app `<id>` (source of truth for future work) |
| `docs/projects/<id>/CHANGELOG.md` | ongoing | Process / change log for that mini-app (newest first) |

### Per-project docs workflow

1. Put **current + near-future** requirements in `docs/projects/<id>/REQUIREMENTS.md` (living index). Large specs → `docs/projects/<id>/requirements/*.md`.
2. Put **executable work** in `docs/projects/<id>/requirements/ACTIONS.md`. Full process: `docs/projects/PROCESS.md`. Run with `pnpm req:start <id>` or chat “chạy requirements <id>”.
3. Agents implement **one ACTION at a time**, then `pnpm req:done <id> <actionId>` + CHANGELOG.
4. See `docs/projects/README.md`. Rules: `.cursor/rules/req-actions.mdc`.

Agents must keep these documents consistent when changing architecture.

---

## 26. Agent Operating Rules (AI Coding Assistants)

1. **Phase discipline**: If Phase N is incomplete, do not silently start Phase N+2.
2. **Ask before large rewrites** of architecture after Phase 2 is approved.
3. **Never invent dependency versions** — verify with registry.
4. **Prefer editing existing contracts** over proliferating new markdown unless requested.
5. When implementing, match naming/import/query conventions in this file exactly.
6. On uncertainty (auth vendor, i18n library, deploy target), propose options with trade-offs; do not silently lock irreversible choices without recording them in `Architecture.md`.
7. Staff-engineer mode: push back on shortcuts that break modularity or SSR correctness.

### Open decisions to resolve in Phase 2 (do not block Phase 1)

- Auth provider (custom cookies vs Auth.js vs vendor)
- i18n library (`i18next`, `typesafe-i18n`, etc.)
- Monorepo orchestration (`pnpm` scripts only vs Turborepo)
- Deploy target (Node server, Cloudflare, etc.) compatible with TanStack Start
- Whether `shared/` is a single package or multiple `@repo/shared-*` packages

---

## 27. First Concrete Deliverables After This File

1. **Phase 2** — Write `Architecture.md` covering:
   - Request lifecycle (SSR → stream → hydrate)
   - Project registry sequence diagrams
   - Auth & permission enforcement
   - Query SSR dehydration strategy
   - Package dependency graph
   - Federation migration map
2. Review architecture against this contract.
3. Only then generate folders and manifests.

---

## 28. Appendix — Why TanStack Start (Decision Record)

**Decision**: Use TanStack Start instead of Next.js.

**Why**:

- Router-first application model aligned with type-safe routing goals
- First-class SSR + streaming + server functions without adopting Next.js conventions
- Vite-based DX and portable deployment story
- Fits monorepo mini-app composition better than App Router file ownership fights
- Matches experimental MFE host/project separation while keeping one SSR runtime in v1

**Consequences**:

- Team must learn Start + Router idioms (loaders, server functions, middleware)
- Ecosystem smaller than Next.js — pin versions, read changelogs
- RSC remains experimental; v1 relies on loaders/streaming rather than RSC-heavy design

---

## 29. Appendix — Why Not Module Federation Yet

**Decision**: Delay Module Federation.

**Why**:

- Need correct package boundaries, SSR story, and DX first
- Federation adds runtime complexity (shared singletons, version skew, SSR remote loading)
- Workspace packages already enable independent development with stronger type-safety

**Bridge**: `createProject` / `registerProject` public surface + peerDependency discipline = future remotes.

---

## 30. Change Control

Amendments to this contract require:

1. Explicit documentation update in this file
2. Note in PR description: `AGENTS.md contract change`
3. Follow-up updates to `Architecture.md` / guides when impacted

---

**End of Phase 1 contract.**  
Next: Phase 2 — `Architecture.md` (design only, still no application source code).

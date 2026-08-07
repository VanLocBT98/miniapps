# Folder Structure

## Monorepo

```text
apps/main/                 # SSR host (TanStack Start)
projects/
  dashboard/               # Mini app (BASIC-APP layout)
  admin/
  booking/
  portfolio/               # Public portfolio (data-driven JSON)
docs/
  ai/
    PORTFOLIO.md           # Token-efficient AI context for portfolio
  ui/
  shared/                  # Cross-app platform kit (auth, project contract, api)
  config/
  eslint-config/
  tsconfig/
docs/
```

## Mini app layout (every `projects/*`)

Mirrors the legacy BASIC-APP shape so teams can migrate and develop independently:

```text
projects/<name>/
  pipelines/               # Project-level CI snippets (optional)
  public/
    images/
    svgs/
  sdk/                     # Project SDK / generated clients (optional)
  src/
    assets/
    components/            # Project-local UI
    layouts/
    pages/                 # Route page modules
    router/                # Route tree + registration helpers
    shared/
      configs/
      constants/
      locales/
      services/
        apis/
          apis.ts
          query-keys.ts
        auth.ts            # Project auth helpers (roles scoped here)
      stores/
      types/
      utils/
    App.tsx                # Standalone shell (independent `pnpm dev`)
    index.css
    main.tsx
    vite-env.d.ts
    project.ts             # createProject() export for Main App
  .env
  .env.sit
  .env.uat
  .env.prod
  eslint.config.js
  index.html
  package.json
  README.md
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
```

### Mapping notes

| BASIC-APP | Platform role |
|-----------|----------------|
| `pages/` | Feature screens; Main App mounts via project routes |
| `router/` | Standalone router + `buildRoutes` for host composition |
| `shared/services/apis` | TanStack Query options + fetch wrappers |
| `shared/stores` | Zustand (UI state only) |
| `project.ts` | MFE registration contract (`createProject`) |
| Yarn lock | Replaced by workspace `pnpm-lock.yaml` |

Host app (`apps/main`) owns SSR, streaming, shared chrome, and `registerProject()`.

# Portfolio — Changelog / process log

> Newest entries first.

## 2026-08-06 — Per-project docs workflow + header back link

- **Why**: Track requirements/process per mini-app; easy return to host home from portfolio.
- **What**: Added `docs/projects/*` workflow; header **← Platform** → `/`.
- **Files**: `docs/projects/**`, `projects/portfolio/src/components/molecules/PortfolioHeader.tsx`
- **Follow-ups**: Keep REQUIREMENTS updated when product asks for new sections/styles.
- **Requirements**: `REQUIREMENTS.md` seeded as `active`.

## 2026-08-06 — Host style fix for `/portfolio`

- **Why**: On `:3000/portfolio`, Tailwind only scanned Main App → missing utilities / `pf-*` styles.
- **What**: Host `@source` for `projects/` + `packages/ui`; import `portfolio.css`; eager `@repo/portfolio/styles.css`; Vite `workspace-at-alias` for `@/*` in mini-apps.
- **Files**: `apps/main/src/styles/app.css`, `apps/main/vite.config.ts`, `apps/main/src/routes/portfolio.tsx`, `projects/portfolio/package.json` (`./styles.css`)
- **Follow-ups**: Same `@source` pattern for future mini-app-only utilities.

## 2026-08-06 — Portfolio mini-app (initial)

- **Why**: Public Leo portfolio as BASIC-APP MFE on TanStack Start host.
- **What**: JSON + Zod, sections, Three.js starfield, public `/portfolio`, white/primary typography tokens.
- **Files**: `projects/portfolio/**`, `apps/main/src/routes/portfolio.tsx`, `docs/ai/PORTFOLIO.md`
- **Follow-ups**: Content re-sync from GitHub/live → JSON + bump `meta.version`.

# Development Guide

## Prerequisites

- Node.js 22+
- pnpm 11.20+

## Setup

```bash
pnpm install
cp apps/main/.env apps/main/.env.local # optional overrides
pnpm dev
```

## AI context files (save tokens)

| Topic | Read this first |
|-------|-----------------|
| Portfolio CV/content | `docs/ai/PORTFOLIO.md` + `projects/portfolio/src/shared/data/portfolio.json` |
| Folder contracts | `docs/FolderStructure.md` |
| Architecture | `docs/Architecture.md` |
| Agent rules | `AGENTS.md` |

Do not paste full JSON into prompts — point the agent at these paths.

## Environment files

| File | Purpose |
|------|---------|
| `.env` | Shared defaults |
| `.env.local` | Local secrets (gitignored) |
| `.env.development` | Dev |
| `.env.production` | Prod |
| Project `.env.sit` / `.env.uat` / `.env.prod` | Mini-app env flavors |

Validate with `@repo/config` Zod schemas.

## Adding a mini app

1. Copy `projects/dashboard` as a template (BASIC-APP layout)
2. Implement `src/project.ts` with `createProject`
3. Add workspace dependency in `apps/main/package.json`
4. Register in `apps/main/src/projects/installed.ts`
5. Add thin host routes under `apps/main/src/routes/_app/<id>/`

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @repo/main build
```

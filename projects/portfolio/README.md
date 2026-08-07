# Portfolio mini app

Port of `turboMonorepo_project/apps/portfolio` into BASIC-APP + TanStack stack.

## AI / content

- **Canonical data**: `src/shared/data/portfolio.json`
- **Agent guide**: `docs/ai/PORTFOLIO.md` (repo root docs)

Edit JSON for content. Do not hardcode CV text in components.

## Run

```bash
pnpm --filter @repo/portfolio dev
# http://localhost:5177
```

Host mount: `http://localhost:3000/portfolio` (public, no login).

# Portfolio AI Context (token-efficient)

> **Requirements (source of truth)**: `docs/projects/portfolio/REQUIREMENTS.md`  
> **Process log**: `docs/projects/portfolio/CHANGELOG.md`  
> **For AI agents**: Prefer reading those + this cheat-sheet instead of re-asking for CV content.
> Do **not** paste the full JSON into prompts — reference paths.

## Canonical sources

| Source | URL |
|--------|-----|
| GitHub profile | https://github.com/VanLocBT98 |
| Live portfolio | https://van-loc-portfolio.vercel.app/ |
| Data file | `projects/portfolio/src/shared/data/portfolio.json` |

## Identity (from GitHub)

- **Name**: Văn Lộc / Van Loc (Leo) Nguyen
- **Nickname**: Leo
- **Title**: Front-end Developer
- **Company**: TripOTA
- **Location**: District 1, HCM city
- **Email**: vanlocforwork.nv@gmail.com
- **Site title**: Leo Portfolio

## Files

| Path | Purpose |
|------|---------|
| `projects/portfolio/src/shared/data/portfolio.json` | Single source of truth |
| `projects/portfolio/src/shared/types/portfolio.ts` | Zod schemas |
| `src/components/organisms/Three*.tsx` / `StarField.tsx` | Three.js background |
| `public/lottie/*.json` | Optional lottie assets (not loaded by default) |

## Style tokens (text ↔ Three background)

- **Body / titles**: trắng (`#fff`) — phân cấp bằng `font-weight` (light 300 → bold 700)
- **Primary** (giữ): `#a5b4fc` / soft `#c7d2fe` — chỉ dùng cho accent (tên, role, brand, icon, label nổi)
- Classes: `.pf-text` / `.pf-text-medium` / `.pf-text-semibold` / `.pf-text-bold` / `.pf-primary`
- Cards: glass; background veil trong `ThreeBackground.tsx`

## Edit rules

1. Content / identity / SEO copy → `portfolio.json` only
2. Three.js tunables → `portfolio.json` → `three`
3. UI → `src/components/**`
4. Re-sync from GitHub/live site → update JSON, bump `meta.version`

## Quick facts

- Package: `@repo/portfolio`
- Public route: `/portfolio`
- Standalone: `pnpm dev:portfolio`

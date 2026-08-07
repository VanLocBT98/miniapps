# Portfolio — Requirements (living / future-facing)

> Status: `active`  
> Last updated: 2026-08-06  
> Package: `@repo/portfolio` · Code: `projects/portfolio`  
> Cheat-sheet: `docs/ai/PORTFOLIO.md`  
> **Rule**: Chỉ giữ hiện tại + tương lai gần. Lịch sử → `CHANGELOG.md`.

## North star

Public Leo portfolio trên Main App (`/portfolio`), content-driven từ JSON, chữ trắng + accent primary trên nền Three.js.

## Current focus (next / in-flight)

- _(trống — gửi yêu cầu mới vào đây hoặc `features/<slug>.md`)_

## Standing constraints (vẫn phải giữ)

- Public SSR `/portfolio` (không login); header **← Platform** → `/`
- Content / SEO / Three knobs → `projects/portfolio/src/shared/data/portfolio.json` (+ bump `meta.version` khi re-sync)
- UI: body/titles trắng + `font-weight`; primary `#a5b4fc` / soft `#c7d2fe` (accent only); classes `.pf-*` dưới `.portfolio-root`
- Host Tailwind phải `@source` `projects/` + load `portfolio.css` (styles không được “mất” trên `:3000`)
- BASIC-APP + `AGENTS.md`; không nhét React component vào dehydrated router context
- Nguồn: GitHub VanLocBT98 / van-loc-portfolio.vercel.app

## Done baseline (đừng phá)

- Sections: Hero, Summary, Skills, Experience, Projects, Contact
- Three.js starfield client-only + reduced-motion
- Zod + `portfolioQueryOptions` / `@repo/portfolio/apis`

## Out of scope (hiện tại)

- CMS editor, auth gate, Module Federation remote

## Open questions

- Lottie `public/lottie` — có load mặc định không?

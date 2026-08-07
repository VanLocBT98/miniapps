# SSR

| Concern | Requirement |
|---------|-------------|
| Booking List | SSR |
| Booking Detail | SSR |
| Streaming | Supported |
| Hydration | Supported |
| Route loader | Required |
| Prefetch | Required |
| SEO | Detail metadata rendered server-side |

## Notes

- Use TanStack Start / Router loaders on host routes to `ensureQueryData`.
- Do not put non-serializable React components into dehydrated router context.
- Detail `head()` / meta: booking number, status, title from loader data.
- List `head()` via `bookingListHead`; detail + nested tabs via `bookingDetailHead` (`@repo/booking/ssr`).
- Loader coverage checklist: `projects/booking/src/shared/ssr/loader-checklist.ts` (unit-tested).

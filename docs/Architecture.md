# Architecture

## Host + mini apps

The Main App (`apps/main`) is a TanStack Start SSR host. Mini apps (`projects/*`) are workspace packages that:

1. Follow the BASIC-APP folder layout
2. Export `createProject()` from `src/project.ts`
3. Run standalone via Vite (`pnpm --filter @repo/<id> dev`)
4. Mount into the host through `apps/main/src/projects/installed.ts`

## Registration

```ts
registerProject(project)
```

The host discovers navigation, permissions, layouts, providers, and page loaders from registered projects. Thin route files under `apps/main/src/routes/_app/*` wire URL paths to project pages and prefetch Query data for SSR.

## SSR data

- `getRouter()` creates a per-request `QueryClient`
- `setupRouterSsrQueryIntegration` handles dehydrate/hydrate
- Route loaders call `queryClient.ensureQueryData(...)`

## Auth

Mock cookie session via TanStack Start server functions (`loginFn`, `logoutFn`, `getSessionFn`, `refreshSessionFn`). Replace the mock user store with a real API without changing route guards.

## Federation migration

Each project already has a single public entry (`project.ts`) and peer-friendly React/Query deps. Later remotes can replace static workspace imports inside `installed.ts` without changing the project surface.

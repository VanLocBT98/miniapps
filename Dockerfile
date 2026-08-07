# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/main/package.json apps/main/
COPY packages/config/package.json packages/config/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY projects/dashboard/package.json projects/dashboard/
COPY projects/admin/package.json projects/admin/
COPY projects/booking/package.json projects/booking/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/projects ./projects
COPY . .
RUN pnpm --filter @repo/main... build

FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/main/dist ./apps/main/dist
COPY --from=build /app/apps/main/package.json ./apps/main/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
EXPOSE 3000
WORKDIR /app/apps/main
CMD ["pnpm", "start"]

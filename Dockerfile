# syntax=docker/dockerfile:1
# Multi-stage: deps → build → production runner (+ optional development target)

ARG PNPM_VERSION=11.20.0
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc turbo.json ./
COPY apps/main/package.json apps/main/
COPY packages/config/package.json packages/config/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/db/package.json packages/db/
COPY projects/dashboard/package.json projects/dashboard/
COPY projects/admin/package.json projects/admin/
COPY projects/booking/package.json projects/booking/
COPY projects/portfolio/package.json projects/portfolio/
RUN pnpm install --frozen-lockfile

# --- Development image ---
FROM deps AS development
COPY . .
ENV NODE_ENV=development
ENV VITE_API_URL=http://host.docker.internal:3001
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
CMD ["pnpm", "--filter", "@repo/main", "dev", "--host", "0.0.0.0"]

# --- Production build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/projects ./projects
COPY . .
ARG VITE_API_URL=https://api-mini-apps.vercel.app
ARG VITE_APP_ENV=production
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=@repo/main

# --- Production runner ---
FROM node:${NODE_VERSION}-alpine AS production
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate \
  && apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/apps/main/dist ./apps/main/dist
COPY --from=build /app/apps/main/package.json ./apps/main/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
WORKDIR /app/apps/main
CMD ["pnpm", "start"]

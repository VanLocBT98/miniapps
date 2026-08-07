import { z } from 'zod'

const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') return value
    return value === 'true' || value === '1'
  })

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url().default('http://localhost:3000'),
  API_URL: z.url().default('http://localhost:3000/api'),
  SESSION_SECRET: z.string().min(16).default('dev-session-secret-change-me'),
  AUTH_COOKIE_NAME: z.string().default('mfe_session'),
  /** Optional — when set, customer CRUD uses Postgres via @repo/db */
  DATABASE_URL: z.string().min(1).optional(),
})

export const publicEnvSchema = z.object({
  VITE_APP_NAME: z.string().default('MiniApps Platform'),
  VITE_APP_URL: z.string().default('http://localhost:3000'),
  VITE_API_URL: z.string().default('/api'),
  VITE_ENABLE_DEVTOOLS: booleanFromString.default(true),
  /** Portal origin (Main App). */
  VITE_PORTAL_HOST: z.string().optional(),
  VITE_PROJECT_DASHBOARD_HOST: z.string().optional(),
  VITE_PROJECT_ADMIN_HOST: z.string().optional(),
  VITE_PROJECT_BOOKING_HOST: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type PublicEnv = z.infer<typeof publicEnvSchema>

export function getServerEnv(
  env: Record<string, string | undefined> = process.env,
): ServerEnv {
  return serverEnvSchema.parse({
    NODE_ENV: env.NODE_ENV,
    APP_URL: env.APP_URL,
    API_URL: env.API_URL,
    SESSION_SECRET: env.SESSION_SECRET,
    AUTH_COOKIE_NAME: env.AUTH_COOKIE_NAME,
    DATABASE_URL: env.DATABASE_URL || undefined,
  })
}

export function getPublicEnv(env: Record<string, string | undefined> = {}): PublicEnv {
  return publicEnvSchema.parse({
    VITE_APP_NAME: env.VITE_APP_NAME,
    VITE_APP_URL: env.VITE_APP_URL,
    VITE_API_URL: env.VITE_API_URL,
    VITE_ENABLE_DEVTOOLS: env.VITE_ENABLE_DEVTOOLS,
    VITE_PORTAL_HOST: env.VITE_PORTAL_HOST || undefined,
    VITE_PROJECT_DASHBOARD_HOST: env.VITE_PROJECT_DASHBOARD_HOST || undefined,
    VITE_PROJECT_ADMIN_HOST: env.VITE_PROJECT_ADMIN_HOST || undefined,
    VITE_PROJECT_BOOKING_HOST: env.VITE_PROJECT_BOOKING_HOST || undefined,
  })
}

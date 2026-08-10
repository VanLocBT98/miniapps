import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: ReturnType<typeof postgres> | null = null
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function hasDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(env.DATABASE_URL?.trim())
}

function isNeonOrPooledUrl(url: string) {
  return url.includes('neon.tech') || url.includes('-pooler.') || url.includes('sslmode=')
}

export function getDb(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl?.trim()) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!db) {
    const pooled = isNeonOrPooledUrl(databaseUrl)
    // Vercel serverless + Neon pooler: keep pool tiny and disable prepared statements.
    client = postgres(databaseUrl, {
      max: pooled ? 1 : 10,
      prepare: pooled ? false : undefined,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: pooled ? 'require' : undefined,
    })
    db = drizzle(client, { schema })
  }
  return db
}

export async function closeDb() {
  if (client) {
    await client.end({ timeout: 5 })
    client = null
    db = null
  }
}

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

export function getDb(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl?.trim()) {
    throw new Error('DATABASE_URL is not set')
  }
  if (!db) {
    client = postgres(databaseUrl, { max: 10 })
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

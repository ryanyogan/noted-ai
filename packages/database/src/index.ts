import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema'

export type Database = DrizzleD1Database<typeof schema>

// Create database instance from D1 binding
export function createDb(d1: D1Database): Database {
  return drizzle(d1, { schema })
}

// Re-export schema and types
export * from './schema'
export { schema }

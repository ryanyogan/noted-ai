import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const folders = sqliteTable('folders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  parentId: text('parent_id'), // Self-referencing for nested folders
  name: text('name').notNull(),
  icon: text('icon'), // Emoji or lucide icon name
  color: text('color'), // Hex color for folder
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => [
  index('folders_user_idx').on(table.userId),
  index('folders_parent_idx').on(table.parentId),
])

export type Folder = typeof folders.$inferSelect
export type NewFolder = typeof folders.$inferInsert

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  folderId: text('folder_id'), // Nullable - notes can be in inbox (no folder)
  
  // Content
  title: text('title').notNull().default('Untitled'),
  content: text('content'), // JSON string of Tiptap document
  contentText: text('content_text'), // Plain text extraction for full-text search
  summary: text('summary'), // AI-generated summary
  
  // Organization
  isInbox: integer('is_inbox', { mode: 'boolean' }).default(true), // Quick capture goes to inbox
  isPinned: integer('is_pinned', { mode: 'boolean' }).default(false),
  isArchived: integer('is_archived', { mode: 'boolean' }).default(false),
  isTrashed: integer('is_trashed', { mode: 'boolean' }).default(false),
  
  // Metadata
  wordCount: integer('word_count').default(0),
  readingTimeMinutes: integer('reading_time_minutes').default(0),
  
  // AI features
  embeddingId: text('embedding_id'), // Reference to Vectorize embedding
  autoTags: text('auto_tags'), // JSON array of AI-suggested tags
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  trashedAt: integer('trashed_at', { mode: 'timestamp' }),
}, (table) => [
  index('notes_user_idx').on(table.userId),
  index('notes_folder_idx').on(table.folderId),
  index('notes_inbox_idx').on(table.userId, table.isInbox),
  index('notes_updated_idx').on(table.userId, table.updatedAt),
])

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert

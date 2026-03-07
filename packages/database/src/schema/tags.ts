import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core'

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  color: text('color'), // Hex color for tag pill
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => [
  index('tags_user_idx').on(table.userId),
])

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

// Junction table for note-tag relationship
export const noteTags = sqliteTable('note_tags', {
  noteId: text('note_id').notNull(),
  tagId: text('tag_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => [
  primaryKey({ columns: [table.noteId, table.tagId] }),
  index('note_tags_note_idx').on(table.noteId),
  index('note_tags_tag_idx').on(table.tagId),
])

export type NoteTag = typeof noteTags.$inferSelect
export type NewNoteTag = typeof noteTags.$inferInsert

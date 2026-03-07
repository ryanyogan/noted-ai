import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Better-auth manages its own tables (user, session, account, verification)
// We extend with app-specific user preferences
export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id').primaryKey(),
  theme: text('theme', { enum: ['light', 'dark', 'system'] }).default('system'),
  editorFontSize: integer('editor_font_size').default(16),
  sidebarCollapsed: integer('sidebar_collapsed', { mode: 'boolean' }).default(false),
  showWordCount: integer('show_word_count', { mode: 'boolean' }).default(true),
  focusMode: integer('focus_mode', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type UserPreferences = typeof userPreferences.$inferSelect
export type NewUserPreferences = typeof userPreferences.$inferInsert

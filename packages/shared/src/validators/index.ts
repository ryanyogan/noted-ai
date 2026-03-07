import { z } from 'zod'

// Note validators
export const createNoteSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().optional(), // JSON string of Tiptap document
  folderId: z.string().optional(),
  isInbox: z.boolean().optional().default(true),
})

export const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(500).optional(),
  content: z.string().optional(),
  folderId: z.string().nullable().optional(),
  isInbox: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
})

export const deleteNoteSchema = z.object({
  id: z.string(),
  permanent: z.boolean().optional().default(false), // Soft delete by default
})

// Folder validators
export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

export const updateFolderSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  parentId: z.string().nullable().optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sortOrder: z.number().int().optional(),
})

// Tag validators
export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

export const updateTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

// Note tag association
export const noteTagSchema = z.object({
  noteId: z.string(),
  tagId: z.string(),
})

// Search
export const searchNotesSchema = z.object({
  query: z.string().min(1).max(500),
  folderId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  includeArchived: z.boolean().optional().default(false),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
})

// Auth validators
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).optional(),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// User preferences
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  editorFontSize: z.number().int().min(12).max(24).optional(),
  sidebarCollapsed: z.boolean().optional(),
  showWordCount: z.boolean().optional(),
  focusMode: z.boolean().optional(),
})

// Export types from validators
export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>
export type CreateFolderInput = z.infer<typeof createFolderSchema>
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type NoteTagInput = z.infer<typeof noteTagSchema>
export type SearchNotesInput = z.infer<typeof searchNotesSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>

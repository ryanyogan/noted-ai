// Tiptap document types
export interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

export interface TiptapNode {
  type: string
  content?: TiptapNode[]
  text?: string
  attrs?: Record<string, unknown>
  marks?: TiptapMark[]
}

export interface TiptapMark {
  type: string
  attrs?: Record<string, unknown>
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// User types
export interface User {
  id: string
  email: string
  name?: string
  displayName?: string
  image?: string
  createdAt: Date
}

export interface UserSession {
  user: User
  session: {
    id: string
    expiresAt: Date
  }
}

// Theme
export type Theme = 'light' | 'dark' | 'system'

// Note view types
export type NoteView = 'grid' | 'list'
export type NoteSortBy = 'updatedAt' | 'createdAt' | 'title'
export type SortOrder = 'asc' | 'desc'

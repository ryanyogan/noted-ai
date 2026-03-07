# Noted - ADHD-Friendly Note Taking App

## Project Overview

Noted is a full-stack note-taking application designed specifically for users with ADHD. It features a beautiful block-based editor, AI-powered features, real-time collaboration, and an intuitive organization system.

## Architecture

### Monorepo Structure
```
noted/
├── apps/
│   ├── web/              # TanStack Start main application
│   └── collab-worker/    # Durable Objects for real-time collaboration
├── packages/
│   ├── database/         # @noted/database - Drizzle schemas & queries
│   ├── auth/             # @noted/auth - better-auth configuration
│   └── shared/           # @noted/shared - Types & validators
```

### Tech Stack
- **Framework**: TanStack Start (React 19, SSR)
- **Styling**: Tailwind CSS v4
- **Editor**: Tiptap (ProseMirror-based)
- **Auth**: better-auth (native D1 support)
- **Database**: Cloudflare D1 + Drizzle ORM
- **Vector Search**: Cloudflare Vectorize
- **AI**: Cloudflare Workers AI
- **Real-time**: Durable Objects + Yjs
- **Build**: Turborepo + pnpm

## Development Guidelines

### ALWAYS use Context7 for documentation
When working with any library, ALWAYS use the Context7 MCP tools to look up current documentation:

1. First resolve the library ID:
   ```
   mcp_context7_resolve-library-id(libraryName: "tanstack start", query: "your question")
   ```

2. Then query the docs:
   ```
   mcp_context7_query-docs(libraryId: "/websites/tanstack_start_framework_react", query: "your question")
   ```

### Key Library IDs for Context7
- TanStack Start: `/websites/tanstack_start_framework_react`
- Drizzle ORM: `/drizzle-team/drizzle-orm-docs`
- better-auth: `/better-auth/better-auth`
- Tiptap: `/ueberdosis/tiptap-docs`

### Use Cloudflare MCP for Cloudflare features
Always use `mcp_cloudflare-docs_search_cloudflare_documentation` for:
- D1 database patterns
- Workers AI usage
- Vectorize setup
- Durable Objects patterns
- Best practices

## Code Patterns

### Server Functions (TanStack Start)
Always use `createServerFn` for server-side operations:

```typescript
import { createServerFn } from '@tanstack/react-start'

export const getNotes = createServerFn({ method: 'GET' }).handler(async () => {
  // Server-only code here
  return db.select().from(notes).all()
})

// In route loader:
export const Route = createFileRoute('/notes')({
  loader: () => getNotes(),
})
```

### Database Access
Import from the shared database package:

```typescript
import { db } from '@noted/database'
import { notes, users } from '@noted/database/schema'
```

### Authentication
Use better-auth patterns:

```typescript
// Server-side auth check in server function
import { auth } from '@noted/auth/server'

const getSession = createServerFn().handler(async ({ request }) => {
  return auth.api.getSession({ headers: request.headers })
})
```

## Features to Implement

### Core (MVP)
- [ ] Authentication (email/password)
- [ ] Block-based Tiptap editor with slash commands
- [ ] Notes CRUD with auto-save
- [ ] Folders and tags organization
- [ ] Inbox/quick capture
- [ ] Dark/light mode
- [ ] Mobile-responsive design

### AI Features
- [ ] Smart semantic search (Vectorize + embeddings)
- [ ] Note summarization (Workers AI)
- [ ] Writing assistant (expand, fix grammar)
- [ ] Auto-tagging suggestions
- [ ] Daily digest generation

### Real-time
- [ ] WebSocket sync via Durable Objects
- [ ] Yjs-based CRDT for conflict-free editing
- [ ] Presence awareness (cursors, selections)

## Cloudflare Resources Required
- D1 Database: `noted-db`
- Vectorize Index: `notes-embeddings`
- Workers AI binding: `AI`
- Durable Object: `NoteRoom` (for collab)

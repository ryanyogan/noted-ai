# Noted - ADHD-Friendly Note-Taking App

## Project Overview

An ADHD-friendly note-taking application with Notion-style clean, minimal design, featuring a Tiptap block editor with AI-powered features.

## Tech Stack

- **Framework**: TanStack Start (SSR)
- **Monorepo**: pnpm workspaces + Turborepo
- **Database**: Cloudflare D1 + Drizzle ORM
- **Auth**: better-auth with email/password
- **UI**: shadcn/ui with Notion-style customizations
- **Editor**: Tiptap (planned)
- **AI**: Cloudflare Workers AI + Vectorize (planned)
- **State**: TanStack Query with SSR hydration

## Project Structure

```
/home/ryan/personal/noted/
├── pnpm-workspace.yaml
├── turbo.json                    # Only apps run dev
├── package.json
│
├── packages/
│   ├── database/
│   │   └── src/schema/           # Drizzle schemas (notes, folders, tags, user_preferences)
│   └── shared/
│       └── src/                  # Types and validators
│
└── apps/web/
    ├── wrangler.jsonc            # D1 binding: noted-db
    ├── .dev.vars                 # BETTER_AUTH_SECRET
    │
    └── src/
        ├── styles.css            # Notion color palette
        ├── lib/
        │   ├── auth.ts           # better-auth config with D1
        │   ├── session.ts        # getSession, ensureSession server functions
        │   └── utils.ts
        ├── components/
        │   ├── ui/               # shadcn components (Notion-styled)
        │   └── layout/
        │       ├── PublicHeader.tsx
        │       └── AppSidebar.tsx
        └── routes/
            ├── __root.tsx
            ├── _public.tsx       # Public layout
            ├── _public/
            │   ├── index.tsx     # Landing page (Notion-styled)
            │   ├── login.tsx     # Login (Notion-styled)
            │   └── register.tsx  # Register (Notion-styled)
            ├── app.tsx           # Authed layout
            ├── app/
            │   └── index.tsx     # Dashboard (placeholder)
            └── api/
                ├── auth/$.tsx    # better-auth handler
                └── migrate.tsx   # D1 migration endpoint
```

## Design System

Using Notion-style design:
- **Light mode**: Background #ffffff, Text #37352f, Border #e9e9e7
- **Dark mode**: Background #191919, Text #e6e6e4, Border #373737
- **Accent**: Blue #2383e2
- **No gradients** - clean, minimal, content-focused
- **Border radius**: 3px (Notion-style)

## Key Discoveries

1. **better-auth D1**: Pass D1 binding directly, use `getMigrations()` for schema
2. **TanStack Start cookies**: Requires `tanstackStartCookies()` plugin (last)
3. **Migration endpoint**: `/api/migrate` POST to run better-auth migrations
4. **Server-only auth**: `auth.ts` imports `cloudflare:workers`, accessed via server functions

## Completed

- [x] Monorepo structure (pnpm workspaces, turborepo)
- [x] `@noted/database` package with Drizzle schemas
- [x] `@noted/shared` package with types/validators
- [x] D1 database created (`noted-db`)
- [x] shadcn/ui initialized with `~/` alias
- [x] TanStack Query with SSR integration
- [x] better-auth configured with D1 + tanstackStartCookies
- [x] Session helpers using server functions
- [x] Auth API route (`/api/auth/*`)
- [x] Migration endpoint (`/api/migrate`)
- [x] Auth flow working (registration + sign-in tested)
- [x] Notion-style CSS variables and color palette
- [x] Notion-style button variants
- [x] Landing page with Notion aesthetic
- [x] Login page with Notion styling
- [x] Register page with Notion styling
- [x] Card component updated for Notion look
- [x] Input component updated for Notion style
- [x] AppSidebar updated (gradients removed, Notion blue #2383e2)
- [x] PublicHeader updated (gradients removed)
- [x] Dashboard colors fixed (slate -> CSS variables)
- [x] Root layout using CSS variables (bg-background, text-foreground)
- [x] BlockNote editor (`@blocknote/shadcn`) - Notion-style block editor
- [x] Notes CRUD server functions (`src/lib/notes.ts`)
- [x] NoteEditor component with auto-save (BlockNote)
- [x] Note route (`/app/note/$noteId`) with SSR disabled
- [x] Dashboard with notes list and create note functionality
- [x] Dashboard route loader - prefetch notes using `ensureQueryData` with TanStack Query

## In Progress

- [ ] Folders and Tags - CRUD for organization

## Completed Recently

- [x] Replaced Tiptap with BlockNote for better Notion-style block editing
- [x] Dashboard route loader - prefetch notes using `ensureQueryData` with TanStack Query
- [x] D1 migrations applied locally

## Next Steps (in order)

1. **Add error handling** - pendingComponent and error boundary for note route
2. **Folders and Tags** - CRUD for organization

## Future Phases

- Semantic search with Cloudflare Vectorize
- AI summarization with Workers AI
- Auto-tagging
- Real-time collaboration (Yjs)

---

## BlockNote Editor

### Installed Packages

```
@blocknote/core
@blocknote/react
@blocknote/shadcn
```

### Editor Features (Built-in)

BlockNote provides these features out of the box:
- **Block-based editing** - Notion-style blocks with drag handles
- **Slash commands** - Type `/` to access all block types
- **Formatting toolbar** - Appears on text selection
- **Block types**: Headings (H1-H3), paragraphs, bullet/numbered lists, checkboxes, code blocks, images, etc.
- **Keyboard shortcuts** - Standard formatting shortcuts
- **Dark mode support** - Automatic theme detection

### Component: `src/components/editor/NoteEditor.tsx`

```tsx
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

export function NoteEditor({ initialContent, onSave }) {
  const editor = useCreateBlockNote({ initialContent });
  
  useEditorChange(() => {
    debouncedSave(editor.document);
  }, editor);
  
  return <BlockNoteView editor={editor} theme={isDark ? "dark" : "light"} />;
}
```

### Content Format (BlockNote JSON)

BlockNote uses an array of blocks (different from Tiptap's doc structure):

```json
[
  {
    "id": "abc123",
    "type": "heading",
    "props": { "level": 1 },
    "content": [{ "type": "text", "text": "Note Title" }],
    "children": []
  },
  {
    "id": "def456",
    "type": "paragraph",
    "props": {},
    "content": [{ "type": "text", "text": "Content here..." }],
    "children": []
  }
]
```

### Database Schema

`packages/database/src/schema/notes.ts`:
- `content: text` - JSON string of BlockNote blocks array
- `contentText: text` - Plain text extraction for search

### Future: Real-time Collaboration

BlockNote supports Yjs for real-time collaboration:
1. Install: `@blocknote/yjs yjs y-websocket`
2. Use `YjsProvider` with BlockNote editor
3. Set up WebSocket provider (Cloudflare Durable Objects or external)

## Commands

```bash
# Development
pnpm dev                    # Start dev server

# Database
pnpm db:generate            # Generate migrations
curl -X POST http://localhost:5173/api/migrate  # Run migrations

# Build
pnpm build                  # Build all
```

## Important Notes

- **Path alias**: Use `~/` not `@/` for imports
- **No APIs**: Use `createServerFn` for server functions (except auth routes)
- **Session**: Fetch in layout `beforeLoad`, access via `Route.useRouteContext()`
- **Editor**: BlockNote with `ssr: false` on the note route
- **Turbo**: Only apps run `dev`, packages just build
- **D1 Migrations**: Use `pnpm wrangler d1 migrations apply noted-db --local` from apps/web

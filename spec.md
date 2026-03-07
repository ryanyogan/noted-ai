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

## In Progress

- [ ] AppSidebar needs Notion styling update (has gradient, needs cleanup)

## Next Steps (in order)

1. **Update AppSidebar** - Remove gradients, apply Notion styling
2. **Install Tiptap** - `@tiptap/react`, `@tiptap/starter-kit`, extensions
3. **Notes CRUD** - Create `src/lib/notes.ts` server functions
4. **Editor components** - Build `NoteEditor`, `EditorBubbleMenu`, `SlashCommandMenu`
5. **Note route** - Create `/app/note/$noteId` with `<ClientOnly>` wrapper
6. **Dashboard** - Update to show note list with TanStack Query

## Future Phases

- Semantic search with Cloudflare Vectorize
- AI summarization with Workers AI
- Auto-tagging
- Real-time collaboration

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
- **Editor**: Must use `<ClientOnly>` wrapper (Tiptap is client-only)
- **Turbo**: Only apps run `dev`, packages just build

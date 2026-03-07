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
- [x] Tiptap packages installed (react, starter-kit, placeholder, task-list, suggestion)
- [x] Tiptap v3 extensions (image, youtube, highlight, link, bubble-menu, floating-menu)
- [x] Notes CRUD server functions (`src/lib/notes.ts`)
- [x] NoteEditor component with auto-save
- [x] SlashCommandMenu with full commands (headings, lists, task list, quote, code, divider, image, youtube)
- [x] EditorBubbleMenu (bold, italic, strike, code, highlight, link)
- [x] Note route (`/app/note/$noteId`)
- [x] Dashboard with notes list and create note functionality
- [x] Editor CSS styles (placeholder, typography, slash menu, bubble menu)

## In Progress

- [ ] Fix note creation/loading bug (Tiptap SSR hydration issue)

## Known Issues

### Note Creation Bug (Unresolved)

**Symptom**: Clicking "New Note" creates the note but the `/app/note/$noteId` page shows a spinner/loading state instead of the editor.

**Root Causes Identified**:

1. **Tiptap SSR Hydration** - Tiptap editor renders on server but can't hydrate properly on client. Need to add `immediatelyRender: false` to useEditor config in `NoteEditor.tsx`.

2. **D1 Migration Missing** - The notes table schema may not be applied to D1. Need to run:
   ```bash
   cd packages/database && pnpm db:generate
   curl -X POST http://localhost:3000/api/migrate
   ```

3. **No Error Handling** - The note route loader doesn't handle errors gracefully. Need to add `pendingComponent` and `errorComponent`.

**Fix Required in `NoteEditor.tsx`**:
```typescript
const editor = useEditor({
  // ... extensions
  immediatelyRender: false,  // <-- Add this for SSR compatibility
  // ... rest of config
})
```

## Next Steps (in order)

1. **Fix Tiptap SSR issue** - Add `immediatelyRender: false` to useEditor config
2. **Run D1 migrations** - Apply notes table schema to D1 database
3. **Add error handling** - pendingComponent and error boundary for note route
4. **Test full editor flow** - Create notes, slash commands, bubble menu, auto-save
5. **Folders and Tags** - CRUD for organization

## Future Phases

- Semantic search with Cloudflare Vectorize
- AI summarization with Workers AI
- Auto-tagging
- Real-time collaboration (Yjs)

---

## Tiptap Editor Implementation Plan

### Already Installed Packages

```
@tiptap/react
@tiptap/starter-kit
@tiptap/pm
@tiptap/extension-placeholder
@tiptap/extension-task-item
@tiptap/extension-task-list
@tiptap/suggestion
```

### Additional Packages to Install

```bash
pnpm add @tiptap/extension-image @tiptap/extension-youtube @tiptap/extension-highlight @tiptap/extension-link tippy.js --filter @noted/web
```

### Editor Features

#### Core Extensions (via StarterKit)
- Headings (H1, H2, H3)
- Bullet lists, Numbered lists
- Blockquote, Code block, Horizontal rule
- Bold, Italic, Strike, Code (inline)
- Undo/Redo, Dropcursor, Gapcursor

#### Additional Extensions
- **TaskList + TaskItem** - Checkbox/todo lists (already installed)
- **Placeholder** - "Type '/' for commands..." (already installed)
- **Image** - Image blocks with resize
- **YouTube** - Video embeds
- **Highlight** - Text highlighting
- **Link** - Hyperlinks

### Components to Build

#### 1. `src/components/editor/NoteEditor.tsx`
Main editor wrapper with:
- Tiptap `useEditor` hook
- StarterKit + extensions configured
- Debounced auto-save (1000ms)
- Save on blur and before unload
- Notion-style typography (use `.prose-noted` from styles.css)

#### 2. `src/components/editor/SlashCommandMenu.tsx`
Slash command popup using `@tiptap/suggestion`:

| Command | Icon | Description |
|---------|------|-------------|
| Heading 1 | H1 | Large section heading |
| Heading 2 | H2 | Medium section heading |
| Heading 3 | H3 | Small section heading |
| Bullet List | • | Create a bullet list |
| Numbered List | 1. | Create a numbered list |
| Task List | ☐ | Track tasks with checkboxes |
| Quote | " | Capture a quote |
| Code Block | </> | Add a code snippet |
| Divider | — | Visual divider |
| Image | 🖼 | Upload or embed image |
| YouTube | ▶ | Embed YouTube video |

Use `tippy.js` for positioning. Filter commands by typed query.

#### 3. `src/components/editor/EditorBubbleMenu.tsx`
Floating toolbar on text selection:
- Bold, Italic, Strikethrough
- Code (inline)
- Highlight
- Link (prompt for URL)

### Auto-Save Implementation

```typescript
// Pattern: Debounced save with flush on blur/unload
const debouncedSave = useMemo(
  () => debounce(async (content, noteId) => {
    await updateNote({ id: noteId, content })
  }, 1000),
  []
)

// In useEditor config:
onUpdate: ({ editor }) => {
  debouncedSave(editor.getJSON(), noteId)
}

// Flush on blur
editor.on('blur', () => debouncedSave.flush())

// Flush before unload
window.addEventListener('beforeunload', () => debouncedSave.flush())
```

### Notes CRUD Server Functions

Location: `apps/web/src/lib/notes.ts`

```typescript
// getNotes() - List user's notes (with filters)
// getNote(id) - Single note by ID
// createNote() - Create new note, return ID
// updateNote({ id, title?, content? }) - Update note
// deleteNote(id) - Soft delete (move to trash)
// permanentlyDeleteNote(id) - Hard delete
```

### Note Route Structure

```
/app/note/$noteId.tsx
```

- Fetch note in `loader` (server function)
- Wrap editor in `<ClientOnly>` component
- Inline title editing (contentEditable or separate input)
- Auto-save status indicator ("Saving...", "Saved")

### Database Schema (Already Exists)

`packages/database/src/schema/notes.ts`:
- `content: text` - JSON string of Tiptap document
- `contentText: text` - Plain text for search
- Ready for future Yjs state storage

### Content Format (Tiptap JSON)

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Note Title" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Content here..." }]
    },
    {
      "type": "taskList",
      "content": [
        {
          "type": "taskItem",
          "attrs": { "checked": false },
          "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Todo" }] }]
        }
      ]
    }
  ]
}
```

### Future: Yjs Collaboration

When ready to add real-time collaboration:

1. Install: `@tiptap/extension-collaboration yjs y-websocket`
2. Store Yjs state: Add `yjsState: blob` column to notes table
3. Disable StarterKit history: `history: false`
4. Add Collaboration extension with Y.Doc
5. Set up WebSocket provider (Cloudflare Durable Objects or external)

### CSS for Editor

Add to `styles.css`:

```css
/* Tiptap placeholder */
.tiptap p.is-editor-empty:first-child::before {
  color: var(--muted-foreground);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Slash command menu */
.slash-menu {
  @apply bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[280px] max-h-[300px] overflow-y-auto;
}

.slash-menu-item {
  @apply flex items-center gap-3 w-full px-3 py-2 rounded-[3px] text-left transition-colors duration-75;
}

.slash-menu-item:hover,
.slash-menu-item.is-selected {
  @apply bg-accent;
}

/* Bubble menu */
.bubble-menu {
  @apply flex items-center gap-1 bg-popover border border-border rounded-lg shadow-lg p-1;
}

.bubble-menu button {
  @apply p-1.5 rounded-[3px] hover:bg-accent transition-colors duration-75;
}

.bubble-menu button.is-active {
  @apply bg-accent text-[#2383e2];
}
```

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
- **Editor**: Use `immediatelyRender: false` in useEditor config for SSR compatibility
- **Turbo**: Only apps run `dev`, packages just build

---

## Session Notes (March 7, 2026)

### Files Created
- `apps/web/src/lib/notes.ts` - Notes CRUD server functions (getNotes, getNote, createNote, updateNote, trashNote, restoreNote, deleteNote)
- `apps/web/src/components/editor/NoteEditor.tsx` - Main Tiptap editor with auto-save
- `apps/web/src/components/editor/EditorBubbleMenu.tsx` - Selection toolbar (bold, italic, strike, code, highlight, link)
- `apps/web/src/components/editor/SlashCommandMenu.tsx` - Slash commands extension with tippy.js
- `apps/web/src/routes/app/note/$noteId.tsx` - Note page with title editing and editor

### Files Modified
- `apps/web/src/routes/app/index.tsx` - Dashboard with notes list and "New Note" button
- `apps/web/src/styles.css` - Added comprehensive editor CSS (placeholder, typography, menus)
- `apps/web/package.json` - Upgraded to Tiptap v3.20.1, added all extensions
- `apps/web/src/components/layout/AppSidebar.tsx` - Removed gradients, Notion blue
- `apps/web/src/components/layout/PublicHeader.tsx` - Removed gradients
- `apps/web/src/routes/__root.tsx` - Fixed body classes to use CSS variables

### Tiptap v3.20.1 Packages Installed
```
@tiptap/core
@tiptap/react  
@tiptap/pm
@tiptap/starter-kit
@tiptap/extension-placeholder
@tiptap/extension-task-item
@tiptap/extension-task-list
@tiptap/suggestion
@tiptap/extension-image
@tiptap/extension-youtube
@tiptap/extension-highlight
@tiptap/extension-link
@tiptap/extension-bubble-menu
@tiptap/extension-floating-menu
tippy.js (v6.3.7)
```

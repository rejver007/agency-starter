# Agency Starter

A production-ready starting point for agency web projects built with **Next.js 15**, **Payload CMS 3**, and **PostgreSQL**.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3 |
| Database | PostgreSQL |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Language | TypeScript |
| Package manager | pnpm |

## What's Included

- **Page builder** — flexible hero + blocks system (CTA, Content, Media, Archive, Form, Banner, Code)
- **Blog** — Posts collection with categories, SEO, live preview, draft/publish
- **Forms** — drag-and-drop form builder with submission storage
- **Search** — full-text search across posts
- **SEO** — meta title/description/image per page and post
- **Redirects** — CMS-managed redirects with ISR revalidation
- **Live preview** — preview draft content in the browser
- **Docker** — local PostgreSQL via docker-compose

## Quick Start

```bash
# 1. Clone
git clone https://github.com/rejver007/agency-starter my-project
cd my-project

# 2. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL

# 3. Start local database
docker-compose up -d

# 4. Install dependencies
pnpm install

# 5. Create and run initial migration
pnpm payload migrate:create --name initial
pnpm payload migrate

# 6. Regenerate Payload types (requires DB connection)
pnpm payload generate:types

# 7. Start dev server
pnpm dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

## Localization

Multi-language support is included but disabled. To enable it, uncomment the `localization` block in `src/payload.config.ts`:

```typescript
localization: {
  locales: [
    { label: 'English', code: 'en' },
    { label: 'Finnish', code: 'fi' },
  ],
  defaultLocale: 'en',
  fallback: true,
},
```

## Adding a New Collection

1. Create `src/collections/MyCollection.ts`
2. Import and add it to the `collections` array in `src/payload.config.ts`
3. Run `pnpm payload migrate:create --name add-my-collection`
4. Run `pnpm payload migrate`
5. Run `pnpm payload generate:types`

## Adding a New Block

1. Create `src/blocks/MyBlock/config.ts` (Payload config) and `src/blocks/MyBlock/Component.tsx` (React component)
2. Add the block config to the `blocks` array in `src/collections/Pages/index.ts`
3. Add a case to `src/blocks/RenderBlocks.tsx`

## After Config Changes

Whenever you modify `src/payload.config.ts` (add/remove collections, fields, globals), regenerate types:

```bash
pnpm payload generate:types
```

## Tests

```bash
# Unit + integration
pnpm test:int

# End-to-end
pnpm test:e2e
```

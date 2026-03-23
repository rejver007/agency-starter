# Changelog

All notable changes to Pikku Quattro will be documented in this file.

---

## [1.3.4] - 2026-03-21 — Fix: missing enum migration for fully_booked status

### Fixed
- **500 error on Fully Booked status**: `select` fields in Payload/PostgreSQL are stored as enum types. The original `enum_reservations_status` only had `pending/confirmed/cancelled`. Added `fully_booked` to the config but not the DB enum → PostgreSQL rejected the value. Migration `20260321_020000` adds the value to the enum type

**Rollback commit:** *(current)*

---

## [1.3.3] - 2026-03-21 — Reservation status emails: cancellation, fully booked, message to client

### Added
- **"Fully Booked" status** (`fully_booked`) — new option in the reservation status dropdown alongside Pending / Confirmed / Cancelled
- **"Message to client" field** — optional textarea in the reservation sidebar. When filled, the text appears as a highlighted personal note block inside the status-change email. Left blank, only the default message is sent
- **Cancellation email** (`sendGuestCancellation`): sent automatically when status changes to `cancelled` — "Unfortunately we are unable to accommodate your reservation"
- **Fully booked email** (`sendGuestFullyBooked`): sent automatically when status changes to `fully_booked` — "We're fully booked for that time, please try another date"
- **Message block in confirmation email**: `sendGuestConfirmation` now also includes the personal message if set
- **Migration** `20260321_010000`: adds `message_to_client varchar` column to `reservations` table

### Changed
- Reservation status dropdown description updated to: *"Changing status sends an email to the guest automatically"*
- `afterChange` hook simplified: checks `doc.status !== previousDoc.status` before firing any email, preventing duplicate sends on unrelated field saves

**Rollback commit:** *(current)*

---

## [1.3.2] - 2026-03-21 — Fix: missing migration for notificationEmails field

### Fixed
- **RestaurantSettings data inaccessible**: added `notificationEmails` field in code but forgot to create the DB migration — Payload couldn't read/write the table, making the entire Settings page blank. Data was never lost; migration restores access on next deploy
- **Migration**: `20260321_000000_add_notification_emails` — adds `notification_emails varchar` column to `restaurant_settings` table

**Rollback commit:** *(current)*

---

## [1.3.1] - 2026-03-21 — Fix build: search collection type error

### Fixed
- **`search/page.tsx`**: `collection: 'search'` type error — search plugin was removed earlier but the page still referenced the now-missing collection slug. Cast to `any` since the call is already wrapped in try/catch and returns empty gracefully

### Added
- **Pre-push git hook** (`.git/hooks/pre-push`): runs `tsc --noEmit` before every push. Blocks the push if TypeScript errors are found, so Coolify never receives a broken build

**Rollback commit:** *(current)*

---

## [1.3.0] - 2026-03-21 — Email fixes: admin notifications, guest auto-replies, CMS-managed recipients

### Fixed
- **Reservation admin email**: was silently sending to wrong address (`dev@admir.fi` fallback) because `RESERVATION_EMAIL` env var not set. Now reads recipient list from CMS RestaurantSettings
- **Contact form admin email**: same env var issue resolved — now uses CMS notification emails
- **Contact form guest auto-reply**: was missing entirely — added confirmation email sent to user on both contact and jobs form submissions

### Added
- **CMS notification email management**: new "Notifications" collapsible in RestaurantSettings global with `notificationEmails` text field (comma-separated). Admin can add/remove addresses without touching env vars. Example: `info@pikkuquattro.fi, owner@gmail.com`
- **`src/lib/getNotificationEmails.ts`**: shared utility that reads CMS setting, falls back to `RESERVATION_EMAIL` env var, then `dev@admir.fi`. Used by both `/next/reserve` and `/next/contact` routes
- **Guest auto-reply for contact form**: "Message received" email sent immediately on submission (name personalised, phone + address footer)
- **Guest auto-reply for jobs form**: "Application received" email sent immediately on submission (includes role applied for)

**Rollback commit:** *(current)*

---

## [1.2.2] - 2026-03-20 — Dynamic open status, Wolt delivery integration

### Added
- **`OpenStatus` component** (`src/components/OpenStatus/`): client component that reads current Helsinki time (`Europe/Helsinki` timezone), checks today's hours, and shows a pulsing green dot if open or red if closed. Updates every minute. Two variants: `strip` (contact page info band) and `badge` (inline). Replaces the static "Today: Mon–Thu 10:30–20:30" strip item
- **Wolt delivery** — three placements:
  - Homepage hero: third CTA button "Order on Wolt" (blue Wolt-branded style)
  - Footer: "Order on Wolt" link in the brand column above socials
  - Contact page info strip already shows open status; Wolt could be added there too if needed

**Rollback commit:** *(current)*

---

## [1.2.1] - 2026-03-20 — Contact page overhaul: API route, tabs, spam protection, map

### Added
- **`/next/contact` API route**: handles `type: contact` and `type: jobs`, honeypot check, timing check (< 3s reject), in-memory IP rate limit (5/hour), sends email via nodemailer same pattern as reservations. Graceful fallback if SMTP not configured (logs to console)
- **Two-tab contact form**: "Contact Us" (name/email/message) and "Work With Us" (name/email/phone/role dropdown/availability dropdown/message). Per-tab success state
- **Spam protection**: honeypot hidden field + form load timestamp check (server-side)
- **Google Maps embed**: full-width iframe at bottom of page, dark-filtered to match site palette, with gradient overlays and address badge
- **Info strip**: four-column band under hero showing location, hours, rating, reservations info
- **Hero enhancement**: watermark text "CONTACT", corner ornaments, quick-action pill links (phone + email), larger hero title

### Changed
- Contact form POST URL corrected from `/api/contact` → `/next/contact` (Payload owns `/api/*`)
- Page layout: eyebrow + section title above both columns, descriptive copy explaining the tabs
- Full CSS rewrite: tabs UI, select dropdown with custom gold arrow, more layered visual design

**Rollback commit:** *(current)*

---

## [1.2.0] - 2026-03-20 — Contact page, gallery lightbox, news section on homepage

### Added
- **Contact page** (`/contact`): full dark luxury page with two-column layout — contact form (name/email/message, loading/success/error states, posts to `/api/contact`) + restaurant info block (address, phone, email, hours, Get Directions link with gold corner brackets). Server + client split (`ContactForm.tsx` client component)
- **Gallery lightbox**: clicking any gallery image on a post detail page opens a full-screen lightbox with prev/next navigation, thumbnail strip, caption display, keyboard support (← → Escape), and body scroll lock. Implemented via `GalleryGrid.tsx` (client) + `GalleryLightbox.tsx` + `lightbox.module.css`
- **Homepage news section**: already wired via `latestPosts` from the server page — confirmed working with full CSS (`.news`, `.newsGrid`, `.newsCard`) in `home.module.css`

### Fixed
- **News card overlay removed**: deleted `<div className={styles.cardOverlay} />` from `posts/page.tsx` and `<div className={styles.newsCardOverlay} />` from `HomePage/index.tsx` — faint dark gradient overlay was visually inconsistent with product card style. Dead CSS removed from both module files.

**Rollback commit:** *(current)*

---

## [1.1.2] - 2026-03-20 — Remove search plugin, fix post visibility, food images in seed

### Fixed
- **`search_locales` error**: search plugin removed from `src/plugins/index.ts` — it was crashing on every post save with `relation "search_locales" does not exist`. Search was never linked in nav and is not needed
- **Migration `20260320_030000`**: creates `search`, `search_locales`, `search_categories` tables retroactively so any in-flight data is consistent
- **Posts blank on `/posts`**: changed `overrideAccess: false` → `overrideAccess: true` in the posts page query — with `authenticatedOrPublished` access control, `false` was preventing public reads
- **Search page graceful fallback**: wrapped `payload.find({ collection: 'search' })` in try/catch so the `/search` page doesn't crash after the search plugin is removed
- **Seed images**: replaced `picsum.photos/seed/{word}` (random unrelated photos) with `loremflickr.com/{width}/{height}/{food-keywords}?lock={n}` — returns actual Flickr photos tagged with the dish name/category keywords, deterministic via lock parameter
- **Seed-all rewrite**: each of the 30 menu items and 10 posts now has specific food-relevant image keywords (e.g. `baklava,honey,pastry`, `salmon,grilled,fish`, `chef,kitchen,cooking`, `kebab,grilled,charcoal`)

**Rollback commit:** `abded41`

---

## [1.1.1] - 2026-03-20 — Fix posts_gallery/posts_tags missing tables

### Fixed
- **Migration `20260320_000000`**: creates `posts_gallery`, `posts_tags`, `_posts_v_version_gallery`, `_posts_v_version_tags` tables and adds `excerpt` column to `posts` and `_posts_v`. DB_PUSH was not creating these new sub-tables automatically, causing `relation "posts_gallery" does not exist` crash on `/posts`
- Seed script fixed: removed `forms`/`form-submissions` collection references (Form Builder removed), updated post seed data to Balkan restaurant content with correct `excerpt` and `tags` fields
- Added `/news` → `/posts` redirect page

**Rollback commit:** `4358c97`

---

## [1.1.0] - 2026-03-20 — News/Blog Overhaul, Email Flow, Migration & Plugin Fixes

### Added
- **Guest reservation emails**: guest receives "request received" confirmation on form submit and "table confirmed" email when admin changes status to `confirmed` in CMS
- **Shared email helpers** (`src/lib/reservationEmails.ts`): `sendAdminNotification`, `sendGuestReceived`, `sendGuestConfirmation` — fire-and-forget, non-blocking; gracefully no-ops when SMTP is not configured
- **News archive page** (`/posts`): dark-luxury hero + responsive 3-column grid of post cards matching product card aesthetic (hash-based per-card hue, gold accent bar on hover, image zoom, colored glow lift)
- **Post detail page** redesigned: custom dark hero with category pills + author/date meta; tags row; two-instance share buttons (X/Twitter, Facebook, copy-link); photo gallery grid; related posts section
- **PostHero component** rewritten with CSS Modules replacing Tailwind — dark hero image, gold category pills, meta author/date layout
- **ShareButtons component** (`src/components/PostDetail/ShareButtons.tsx`): client-side X, Facebook, and copy-link share buttons with "Copied!" feedback state
- **Posts collection enhanced**: added `excerpt` (textarea), `gallery` (array of upload + optional caption), `tags` (array of text strings in sidebar)
- **SMTP Gmail support**: documented Gmail App Password flow for SMTP when Zoho SMTP not available

### Fixed
- **Form Builder plugin removal**: removed `formBuilderPlugin` from `src/plugins/index.ts`; removed `FormBlock` from `Pages` collection and `RenderBlocks.tsx` — was crashing admin panel with missing `forms_blocks_*` DB tables
- **Migration runtime crash**: all 15 migration files changed `import { MigrateDownArgs }` to `import type { MigrateDownArgs }` — this export is type-only in `@payloadcms/db-postgres`, runtime import was crashing `instrumentation.ts` auto-migrate
- **Auto-migrate now working**: after fixing the type import, `payload.db.migrate()` in `instrumentation.ts` runs cleanly on deploy; logs show "Database migrations complete."
- **FLIP modal close animation**: close transition timing aligned with open — `0.32s` → `0.42s`, timeout `340ms` → `450ms`
- **CSS keyframes fighting FLIP**: removed `@keyframes modalIn`/`backdropIn` and their `animation:` declarations from `ProductModal.module.css` — they were overriding the JS-driven FLIP animation

### Changed
- Homepage news cards restyled: now use same hash-based `--card-bg`/`--card-glow` pattern as product cards, with category pill overlay, excerpt, and animated "Read article" CTA
- Posts query depth bumped to 2 for hero image, categories, authors
- `TypeScript` error in `RenderBlocks.tsx` resolved via `(blockComponents as Record<string, React.FC<any>>)[blockType]` cast after `FormBlock` removal

**Rollback commit:** `eb6b4a6`

---

## [1.0.0] - 2026-03-19 — Reservations, FLIP Modal, Overlay Fix, Auto-migrate

### Added
- **Reservations page** (`/reservations`): full booking form with hero, two-column grid layout, client-side validation, loading spinner, and success state. Sends notification email to `dev@admir.fi` via SMTP (nodemailer). Gracefully skips email if SMTP is not configured
- **Reservations API** (`/next/reserve`): POST endpoint validates input, creates a Payload `reservations` record, fires non-blocking email notification
- **Reservations CMS collection** (enhanced): status in sidebar with emoji labels, field rows for name/email and phone/party size, special requests textarea, **Staff Notes** field (internal, sidebar, not shown to guest)
- **Migration `20260319_080000`**: adds `staff_notes` column to `reservations` table
- **FLIP shared-element modal animation**: product detail modal now animates from the exact card position/size to full-screen and back — true shared-element transition using `getBoundingClientRect()` + direct DOM FLIP pattern (double-rAF, force-flush, no React batching)
- **Auto-migrate on deploy** (`src/instrumentation.ts`): Next.js instrumentation hook runs `payload.db.migrate()` on server startup so database schema is always in sync after a deploy without manual intervention
- **SMTP env vars** added to `.env` template with comments for custom domain (admir.fi) setup

### Fixed
- **Card image overlay gap** (`menu_cardImageOverlay`): removed `.cardImageOverlay` and `.featuredCardOverlay` overlay divs from all card components (MenuPage, WeeklyMenuPage, HomePage featured cards) — eliminated the gap/line bug between card image and body

### Changed
- All three card components (featured, menu, weekly) now capture `getBoundingClientRect()` on click and pass it as `cardRect` to `ProductModal` for the FLIP animation origin

**Rollback commit:** `eb6b4a6`

---

## [0.9.1] - 2026-03-19 — Manual Reviews Fallback

### Added
- **Manual reviews in CMS**: new "Google Reviews" collapsible section in Restaurant Settings — admin can enter overall rating, review count, Maps URL, and up to 5 review cards (author, stars, text, relative date)
- **Migration `20260319_070000`**: adds `reviews_overall_rating`, `reviews_count`, `reviews_maps_url` columns to `restaurant_settings` and creates `restaurant_settings_manual_reviews` sub-table
- **Fallback logic**: homepage uses Google Places API data when available; falls back to manually entered reviews when API key is not configured; hides the reviews section if neither is present

**Rollback commit:** `eb6b4a6`

---

## [0.9.0] - 2026-03-19 — Hover Glow Tuning, Product Modal, Gallery, Ingredient Fix, Google Reviews

### Added
- **Product detail modal**: clicking any product card (featured, menu, weekly) opens a full-screen dark-luxury modal with image, gallery thumbnails, description, ingredients, allergens, dietary tags, portion/prep info. Closes on ESC, backdrop click, or ✕ button. Scroll locked while open
- **Gallery field on menu items**: new `gallery` array field (upload type) in `MenuItems` collection lets admin upload additional photos per dish
- **Migration `20260319_060000`**: creates `menu_items_gallery` table with ordering, parent FK, and image FK
- **Google Reviews section**: homepage shows up to 5 real Google reviews, overall rating, and star count. Fetched server-side with 1h revalidation. Requires `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` env vars; section hides gracefully if not configured
- **Colored hover glow on menu/weekly cards**: `--card-bg` and `--card-glow` CSS vars now applied to menu and weekly menu cards via hash-based hue, matching the featured cards pattern

### Changed
- **Glow intensity tuned down**: featured card hover box-shadow reduced from `0 0 40px rgba(...,0.3)` to `0 0 24px rgba(...,0.2)`, and `--card-glow` opacity lowered from `0.45` → `0.25`
- **Homepage**: added `'use client'` to `HomePage` component (needed for modal state)
- **WeeklyMenuPage**: added `'use client'` (now uses `useState` for modal); expanded `menuItem` type to include `gallery`, `ingredients`, `allergens`, `portionSize`, `preparationTime`
- **MenuPage**: removed inline ingredients toggle from cards (ingredients now shown in modal); added `gallery` to `MenuItemDoc` type

### Fixed
- **Ingredient 500 error**: removed `localized: true` from `ingredients[].name` in `MenuItems` — Payload was writing to the locales sub-table but the main `name varchar NOT NULL` column was never populated, causing constraint violations on insert
- **Migration `20260319_050000`**: migrates any existing localized ingredient names (en locale) to the main column, drops `menu_items_ingredients_locales` table

**Rollback commit:** `eb6b4a6`

---

## [0.8.0] - 2026-03-19 — UI Polish, Image Seeding, Marquee Restyle, Card Fixes

### Changed
- **Marquee strip**: replaced red background with dark luxury style — dark gradient background, gold top/bottom border lines, gold→cream→gold shimmer animation on text
- **Homepage TR corner**: removed erroneous `scaleX(-1)` CSS transform — SVG path already drew the correct top-right shape
- **Featured cards hover line**: accent line now animates `scaleX(0→1)` on hover, matching menu/weekly-menu card behaviour
- **Card body**: added `display:flex; flex-direction:column; height:100%` to featured cards so body fills grid cell height — eliminates bottom empty space
- **Image overlay**: gradient now fully opaque at very bottom (`rgba(13,7,4,1) 2%`) so any sub-pixel gap at image/body border is invisible

### Added
- **Seed images**: `/next/seed-menu` now downloads food photos from Unsplash CDN, uploads them to the Payload **Media** collection, and links them to each menu item. Failures are skipped gracefully
- **Seed media cleanup**: seed now deletes all existing media before re-uploading, preventing broken/duplicate entries on repeated runs
- **Persistent storage**: Coolify Directory Mount configured at `/data/pikku-quattro/media` → `/app/public/media` so uploaded files survive redeployments

### Fixed
- Migration `20260319_030000`: dropped `NOT NULL` constraint from `categories.title` — Payload no longer writes to parent table column when field is localized
- Migration `20260319_040000`: added `id serial PRIMARY KEY` to `menu_items_allergens` and `menu_items_dietary_tags` — Payload expects an `id` column on `hasMany` select join tables

### Known Issues
- **Card image/body gap line**: a faint line is still visible between the image and card body on homepage featured cards. The overlay gradient fix reduces it but doesn't fully eliminate it — needs further investigation

**Rollback commit:** `edb44ba`

---

## [0.7.2] - 2026-03-19 — Fix categories_breadcrumbs missing _locale column

### Fixed
- Migration `20260319_020000`: adds `_locale` column to `categories_breadcrumbs` — Payload 3.x generates queries that select `_locale` from this table, but the initial migration never included it

---

## [0.7.1] - 2026-03-19 — Fix categories schema for seeding

### Fixed
- Migration `20260319_010000_fix_categories_schema`: creates `categories_breadcrumbs` and `categories_locales` tables with `IF NOT EXISTS` guards so the seed endpoint can query the `categories` collection without Payload crashing on missing join tables

---

## [0.7.0] - 2026-03-19 — Remove Neon, Gold Buttons, Header Redesign, Seed Menu Items

### Changed
- **Hero title**: removed all neon text-shadow glow from "Pikku" and "Quattro". Title now uses clean typography — "Pikku" in cream white, "Quattro" in gold italic
- **Buttons**: changed `pq-btn-primary` from red (`#DC2626`) to gold (`#C9A84C`) with dark text, across all pages
- **Header**: complete redesign to centered-logo luxury layout — nav links split either side of the logo, gold underline hover effect, gold top accent line, translucent dark bg
- **Seed**: added 15 Balkan menu items across 6 categories (Starters, Salads, Mains, Grills, Sides, Desserts) — ćevapi, burek, pljeskavica, musaka, mješano meso, baklava and more. 5 items marked as featured so they appear on the homepage

**Rollback commit:** `f06a97b`

---

## [0.6.0] - 2026-03-18 — Full Menu System, Weekly Menu, CSS Modules Refactor

### Added
- `/menu` page with hero, sticky category filter tabs, and full menu item grid grouped by category
- `/weekly-menu` page with hero and items grouped by day of the week (Mon–Sun)
- `WeeklyMenuPage` component with `weekly.module.css` — shows weekly special label, notes, sale price override, strikethrough original price
- `MenuPage` component with `menu.module.css` — shows allergen badges, dietary tags, portion size, prep time, expandable ingredients list
- `home.module.css` — full CSS module for the homepage (all animations, neon effects, hero, marquee, about, featured, weekly band, news, reservation CTA)
- `header.module.css` — CSS module for the restaurant header (fixed navbar, desktop/mobile nav, burger menu)
- `footer.module.css` — CSS module for the restaurant footer (grid layout, socials, contact, opening hours, bottom bar)

### Changed
- `HomePage/index.tsx` — all inline `style={{}}` props replaced with CSS module classes; removed embedded `<style>` tag
- `RestaurantHeader/Client.tsx` — all inline `style={{}}` props replaced with CSS module classes; removed embedded `<style>` tag
- `RestaurantFooter/index.tsx` — all inline `style={{}}` props replaced with CSS module classes

### Fixed
- TypeScript type mismatches on `/menu` and `/weekly-menu` page server components (Payload expanded types vs component prop interfaces)

**Rollback commit:** `ac01324`

---

## [0.5.0] - 2026-03-18 — Homepage Neon Redesign (UI/UX Pro Max)

### Changed
- Hero: "Pikku" now renders in large Playfair Display with gold neon glow (`pq-neon-gold`), "Quattro" in italic with red neon glow (`pq-neon-red`) — both with `neon-blink` animation (adapted from CodePen neon effect)
- Added ambient radial glow behind the neon title that breathes with `ambient-pulse` animation
- Scroll cue now has a soft `scroll-bounce` animation
- Menu item cards now lift on hover with smooth shadow transition (`pq-card-hover`)
- News post cards use same hover lift effect
- Menu item bottom accent upgraded to a gold→red gradient line
- Reservation CTA phone number now reads from RestaurantSettings CMS instead of hardcoded
- Applied **UI/UX Pro Max** skill: Dramatic Dark Luxury style, gold neon palette, Playfair Display as display face

**Rollback commit:** _(pending)_

---

## [0.4.0] - 2026-03-18 — CMS-driven Header & Footer Navigation

### Changed
- `Header` CMS global redesigned: now has simple nav link pairs (label + URL) and a configurable CTA button (label + URL). Previously used a complex generic link field tied to internal Pages/Posts — unusable for restaurant navigation.
- `Footer` CMS global redesigned: same simple nav link pairs. Previously identical unused template structure.
- `RestaurantHeader` split into a server component (fetches CMS) + client component (handles mobile toggle). Nav links and CTA button now fully editable from the admin panel. Falls back to sensible defaults if CMS is empty.
- `RestaurantFooter` now fetches nav links from the `Footer` CMS global. Contact, hours, and social links remain in `RestaurantSettings`. Tagline also pulled from CMS instead of hardcoded.

### Added
- Migration `20260318_220000` that drops the old complex nav tables and creates clean simple `label`/`url` tables, plus adds `cta_label`/`cta_url` columns to the `header` table.

### Fixed
- CMS admin showed empty "Header" and "Footer" globals that had no effect on the site — now both globals are wired to the actual rendered components.

### Fixed (hotfixes)
- `Footer/Component.tsx`, `Footer/RowLabel.tsx`, `Header/RowLabel.tsx`, `Header/Nav/index.tsx` — all still referenced the old `{ link }` structure, causing build failures
- Migration created nav items `id` column as `serial` (integer) but Payload generates string IDs — fixed to `varchar`

**Rollback commit:** `ebf0e96`

---

## [0.3.0] - 2026-03-18 — Homepage Redesign

### Changed
- Redesigned homepage with ornamental corner decorations
- Added marquee strip for scrolling text/announcements
- Added decorative pattern elements to the homepage layout

**Rollback commit:** `8e50de5`

---

## [0.2.0] - 2026-03-18 — Frontend Build

### Added
- Design tokens (colors, typography, spacing) for Pikku Quattro brand
- Site Header component
- Site Footer component
- Initial homepage layout and content

**Rollback commit:** `d12080c`

---

## [0.1.2] - 2026-03-18 — RestaurantSettings Global & Seed Fix

### Added
- `RestaurantSettings` Payload global containing: contact info, opening hours, social links, and homepage content fields

### Fixed
- Seed script type error introduced after adding the RestaurantSettings global

**Rollback commit:** `a507653` (global), `537ee3c` (seed fix)

---

## [0.1.1] - 2026-03-18 — Restaurant Collections & Localization

### Added
- Restaurant-specific Payload CMS collections with localization support
- Manual database migration for the new collections
- Regenerated `payload-types.ts` to include all new collection slugs

**Rollback commit:** `54682a0` (collections), `e8361e0` (migration), `c3e5ef6` (types)

---

## [0.1.0] - 2026-03-18 — Initial Setup

### Added
- Initial Payload CMS setup scaffolded from template
- Initial database migration
- Force dynamic rendering on all Payload-driven pages (fixes build-time DB connection errors)
- Empty `generateStaticParams` returns to avoid static build failures

**Rollback commit:** `fbfed42` (initial), `402d2d2` (migration), `acf4499`–`37795db` (dynamic rendering fixes)

---

<!--
  Version scheme: MAJOR.MINOR.PATCH
  - MAJOR: complete redesigns or breaking changes
  - MINOR: new features or significant additions
  - PATCH: bug fixes, small corrections
-->

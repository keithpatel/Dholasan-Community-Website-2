# Plan: Make Every Part of the Dholasan Website Editable From the Admin Panel

> Project location: `Dholasan-Community-Website-2/` (this is the real, git-tracked app; the root folder is an older/partial copy).
> Goal: You should be able to change **any** text, image, link, or setting from the admin panel — **without ever editing code again**.

---

## 1. Current State (what the admin panel already does well)

The existing admin panel already covers a lot:

| Section | Editable from admin? |
|---|---|
| News, Events, Gallery, Businesses, Festivals (full CRUD, EN + GU) | ✅ Yes |
| Hero title/subtitle/image, contact info, social links | ✅ Yes |
| About history, key facts, connectivity | ✅ Yes |
| Community governance, education, healthcare | ✅ Yes |
| Change password, export/import JSON, reset to defaults | ✅ Yes |
| Cloud storage (Firebase Auth login + Firestore) | ✅ Yes |

---

## 2. Gap Analysis — What is STILL Hardcoded (must edit code today)

| # | Area | Where it's hardcoded | Example |
|---|---|---|---|
| 1 | **Site name / branding** | `components/Header.tsx:42`, `index.html` `<title>` | "Dholasan" / "ધોળાસણ" |
| 2 | **Navigation menu** (links + labels + order) | `components/Header.tsx:7-15` (`navLinks` array) | Home, About, Community, Events… |
| 3 | **Footer text** | `components/Footer.tsx` | "Dholasan Village", tagline, quick links, copyright |
| 4 | **Every page heading + intro paragraph + CTA button text** | `pages/HomePage.tsx`, `AboutPage.tsx`, `CommunityPage.tsx`, `EventsPage.tsx`, `GalleryPage.tsx`, `BusinessesPage.tsx`, `ContactPage.tsx` | "Explore Our Village", "Latest News", "Our History", "Get in Touch", form labels, "Completed", empty-state messages… |
| 5 | **Google Maps embed URL** | `AboutPage.tsx:70`, `ContactPage.tsx:75` | iframe `src` |
| 6 | **Gallery categories** | `types.ts:26` (union type) + `GalleryPage.tsx:14`, `ManageGallery.tsx:10` | "Festivals", "Daily Life", "Scenery" — cannot add new ones |
| 7 | **Brand colors / fonts / theme** | `index.html` `tailwind.config` (brand-orange, brand-blue…) | colors are compiled at runtime via CDN config |
| 8 | **Image uploads** | All pages — images are URL-only | placeholders from `picsum.photos`; no way to upload a real photo |
| 9 | **Contact form submissions** | `pages/ContactPage.tsx:16-23` | just an `alert()`, nothing is stored or viewable |
| 10 | **Reorder / drag-drop** | `DataTable.tsx` | promised in plan checklist but never built |
| 11 | **Event real dates** | `ManageEvents.tsx` | date is free text, admin must manually tick "isPast" |

---

## 3. Proposed Improvements (phased)

> **Status: Phase 1 ✅ done · Phase 2 ✅ done · Phase 3 ⏳ in progress** (theme colors + backups done; see "Implementation Status" below)

### Phase 1 — "Everything text-based becomes editable" (highest value)

**1.1 Expand the settings data model** — `types.ts`
Add to `SiteSettings`:
- `siteName: TranslatableString` (used in header + title)
- `siteTagline: TranslatableString`
- `navLinks: NavLinkItem[]` where `NavLinkItem = { id, label: TranslatableString, path, enabled }`
- `mapEmbedUrl: string`
- `labels: Record<string, TranslatableString>` — a dictionary for **every** heading, intro, CTA, button, and empty-state string across the site.

**1.2 Centralize all UI copy** — refactor `Header`, `Footer`, and all 7 public pages to read from `siteSettings.labels` (via a helper like `useContent().getLabel('home.heroCta')`) instead of inline `t({...})`. After this, **100% of visible text is data, not code.**

**1.3 New admin sections** (in `SiteSettings.tsx` or a new page):
- **Navigation** — add / edit / remove / reorder / hide nav items (EN + GU).
- **Branding** — site name, tagline, logo image URL.
- **Page Copy / Labels** — a grouped, searchable list of every label with EN/GU tabs.
- **Map** — Google Maps embed URL field.
- **Footer** — tagline, quick-link headings, copyright line.

**1.4 Make gallery categories data-driven**
- Store `galleryCategories: { id, label: TranslatableString }[]` in settings.
- Update `GalleryPage` filters and `ManageGallery` dropdown to read from settings.
- Admin can now add/rename/delete categories without touching the type.

### Phase 2 — "Real features" (image, messages, dates, reorder)

**2.1 Image upload** via Firebase Storage (`firebase/storage`). Add a "Upload" button next to every URL field (`ImagePreview.tsx`) → uploads to Storage → pastes the download URL. Keeps URL fallback for power users.

**2.2 Contact form inbox**
- On submit, save message to Firestore (`content/contactMessages` collection — or `messages` doc array).
- New admin page **"Messages"** — view, mark read, delete, export.

**2.3 Real event dates** — keep the EN/GU display text but also store an ISO `eventDate`; auto-compute `isPast`, sort upcoming/past automatically.

**2.4 Drag-and-drop reorder** — add `onReorder` to `DataTable` and a sort-handle to News, Gallery, Businesses (the feature the plan originally promised).

### Phase 3 — "Polish & trust"

**3.1 Theme / color customizer** — accent colors (orange/blue) as admin-editable hex values applied through CSS variables so the whole site recolors live.

**3.2 Firestore hardening**
- Move Firebase config to `.env` (keys are currently committed in `firebase.ts`).
- Tighten `firestore.rules` (read public, write only for known admin UIDs — currently *any signed-in user* can write).
- Add a `content/versioning` doc: keep the last N backups automatically; one-click rollback from admin.

**3.3 Dashboard polish** — show Firestore sync status, last edited timestamps, unread message count, and a "storage/sync" health card.

**3.4 Optional** — multi-admin/roles, draft→publish toggle for news, per-page hide/show.

---

## 4. Concrete Implementation Steps

### Step 0 — Decide scope with you (see Open Questions)
Before writing code I need answers on scope, image upload, and message inbox.

### Step 1 — Data layer (`types.ts`, `data/contentStore.ts`, `data/content.ts`)
- Extend `SiteSettings`, add `NavLinkItem`, `LabelKey` types, `galleryCategories`, `labels`, `mapEmbedUrl`, `siteName`, `siteTagline`.
- Update `defaultSiteSettings` with sensible defaults; keep existing stored data compatible (migration merge: new keys default, old keys preserved).

### Step 2 — Label system
- Add `getLabel(key)` to `ContentContext`.
- Sweep public pages replacing `t({en, gu})` literals with `getLabel('page.section')`.

### Step 3 — Header / Footer / navigation
- Header reads `siteName`, `navLinks` from settings; renders only enabled links; links still map to existing routes.
- Footer reads tagline, quick links, copyright from settings.

### Step 4 — New admin editors
- Extend `SiteSettings.tsx` (or add `ManageNavigation.tsx`, `ManageLabels.tsx`, `ManageMessages.tsx` + routes in `App.tsx` + sidebar items in `AdminLayout.tsx`).

### Step 5 — Gallery categories → data-driven
- `types.ts` category → string; filters/dropdowns read from settings.

### Step 6 — Firebase upgrades
- Storage upload util + wire into `ImagePreview`.
- Contact messages write/read; new Messages admin page.
- `.env` config + `firestore.rules` tightening + auto-versioning.

### Step 7 — Verify
- `npm run build` clean. ✅
- `npx tsc --noEmit` clean. ✅
- Manual test pass: change every label/heading/nav/category from admin → confirm public site reflects instantly (Firestore realtime). ⏳

---

## 7. Implementation Status

**Done:**
- `types.ts` — added `NavLinkItem`, `GalleryCategoryItem`, `ThemeColors`, `ContactMessage`, `BackupSnapshot`; `SiteSettings` extended with `siteName`, `siteTagline`, `navLinks`, `mapEmbedUrl`, `galleryCategories`, `labels`, `footerTagline`, `footerCopyright`, `themeColors`.
- Label dictionary (`defaultLabels`) with full EN/GU copy for every public page; `getLabel(key)` in `ContentContext`.
- `Header`/`Footer` read site name, nav links, tagline, copyright from settings.
- All 7 public pages refactored to `getLabel`; Gallery filters and ManageGallery categories are data-driven from settings.
- New admin pages: `ManageNavigation` (add/edit/reorder/hide), `ManageLabels` (grouped/searchable EN+GU), `ManageMessages` (read/unread/delete/export). Routes + sidebar wired.
- **Images are URL-only** (user decision): the "Upload Image" button and all Firebase Storage code were removed because Storage now requires the Blaze (paid) plan — no free tier since Feb 2026. Paste any image URL from a free host instead.
- Contact form now saves real submissions to a `contactMessages` Firestore collection (public `create` allowed, admin-only read/manage) + localStorage mirror + realtime listener.
- Real event dates (`eventDate`) with auto `isPast`.
- Reorder (▲/▼) via `DataTable.onReorder` on News, Events, Businesses, Gallery.
- Theme colors editable from admin (hex → CSS variables, live recolor).
- Automatic backups (max 15) on every save with one-click restore in Settings; `content/backups` doc + localStorage.
- Dashboard: Firestore sync status pill + unread messages card.
- `.env` with Firebase config (env-var overrides in `firebase.ts`); `firestore.rules` updated (public read of content, auth write; contactMessages create-any).
- `npm run build` and `npx tsc --noEmit` both pass clean.

**Remaining / optional:**
- Tighten `firestore.rules` `content` writes from "any signed-in user" to explicit admin UIDs.
- Manual end-to-end test pass on the live site.
- Optional Phase 3.4 extras (multi-admin/roles, draft→publish, per-page hide/show).

---

## 8. Open Questions (need your answers before building)

1. **Image upload**: Do you want real photo upload (Firebase Storage — recommended) or keep URL-only for now?
2. **Contact form**: Should submitted messages be saved and viewable in a new "Messages" section of the admin? (Currently the form just shows an alert.)
3. **Scope**: Do you want *everything* (Phases 1–3) or start with Phase 1 (all text/nav/branding editable)?
4. **Theme colors**: Let admin change accent colors, or keep fixed branding?

---

## 6. Files Affected (high level)

- Modify: `types.ts`, `data/contentStore.ts`, `data/content.ts`, `context/ContentContext.tsx`, `components/Header.tsx`, `components/Footer.tsx`, all 7 public pages, `App.tsx`, `components/admin/AdminLayout.tsx`, `pages/admin/SiteSettings.tsx`, `components/admin/ImagePreview.tsx`, `components/admin/DataTable.tsx`
- New: `pages/admin/ManageNavigation.tsx`, `pages/admin/ManageLabels.tsx`, `pages/admin/ManageMessages.tsx`, `.env` file
- Config: `firestore.rules`

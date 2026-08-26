# Dholasan Community Web Portal

Welcome to the official web portal for **Dholasan Village, Gujarat**.

> 💡 **Active Project Directory**: All active code, components, pages, context, and admin panel tools are located inside the [`Dholasan-Community-Website-2/`](./Dholasan-Community-Website-2/) folder.

---

## 📂 Project Structure

```
DHOLASAN/
└── Dholasan-Community-Website-2/       <-- ACTIVE PROJECT ROOT
    ├── components/
    │   ├── Header.tsx                  (Public header with live brand edit)
    │   ├── Footer.tsx                  (Public footer with live contact edit)
    │   ├── PageHeader.tsx              (Bilingual page headers)
    │   ├── LiveEventBanner.tsx         (Live YouTube stream broadcast banner)
    │   ├── GlobalSearchModal.tsx       (Ctrl+K quick search across the site)
    │   ├── admin/                      (Full admin panel tables & modals)
    │   │   ├── visual-editor/          (⚡ Live Visual Click-to-Edit & Toolbar)
    │   │   │   ├── LiveEditToolbar.tsx
    │   │   │   ├── EditableWrapper.tsx
    │   │   │   └── QuickEditDrawer.tsx
    │   │   └── blocks/                 (Page block property editors)
    │   └── blocks/                     (Public page block renderer)
    ├── context/
    │   ├── AuthContext.tsx             (Admin login authentication)
    │   ├── ContentContext.tsx          (Global content state & Firebase sync)
    │   ├── LanguageContext.tsx         (English / Gujarati switcher)
    │   ├── ThemeContext.tsx            (Light / Dark mode)
    │   └── LiveEditContext.tsx         (⚡ Visual inline live edit mode)
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── AboutPage.tsx
    │   ├── CommunityPage.tsx
    │   ├── EventsPage.tsx
    │   ├── GalleryPage.tsx
    │   ├── BusinessesPage.tsx
    │   ├── ContactPage.tsx
    │   └── admin/                      (Admin dashboard, page builder, settings)
    ├── data/
    │   ├── content.ts                  (Default bilingual village data)
    │   └── contentStore.ts             (LocalStorage engine with auto-backup)
    ├── docs/                           (Architecture & feature documentation)
    ├── public/                         (Static assets & favicon)
    ├── App.tsx                         (Routing & Public/Admin layout wrapper)
    ├── index.html                      (App HTML entry)
    ├── package.json                    (Dependencies & scripts)
    └── vite.config.ts                  (Vite bundler configuration)
```

---

## 🚀 Running the Project Locally

To run the project in development mode:

```bash
cd Dholasan-Community-Website-2
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Admin Panel & Live Visual Editor

1. **Admin Dashboard**: Go to `/#/admin` to log in with your admin credentials.
2. **Live Visual Editor**: Click **"🎨 Live Visual Editor"** in the admin dashboard (or toggle **Edit Mode: ON** on the live site).
3. **Click to Edit**: Hover over any section, banner, or text to see the outline and click to edit it live in real-time.
4. **Device Preview**: Switch between **Desktop 💻**, **Tablet 📱**, and **Mobile 📲** views directly from the top toolbar.

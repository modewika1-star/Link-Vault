# Link Vault implementation plan

## Goal
Turn the current React/Vite starter into a useful, responsive bookmark manager based on the inspected Figma "Desktop Light mode" frame. Keep the Figma file read-only.

## Design facts available
- Sidebar width: approximately 256px; background #F8FAFC; border #E2E8F0.
- Sidebar brand mark: 32px square with an 8px radius; icon: 16px.
- Sidebar header height: approximately 56px.
- Main header: white translucent surface, 24px horizontal padding, 448px maximum search width.
- Colors: #F8FAFC, #FFFFFF, #E2E8F0, #0F172B, #45556C, #90A1B9, #314158.
- Font family: Segoe UI; labels 12px; navigation labels 14px; brand 16px.
- Sidebar sections: Smart Views (All Bookmarks, Favorites), Collections (Frontend & React, AI & Tools, Reading List).
- Search placeholder: "Search titles, URLs, notes..."; sort default: "Newest First".

## Architecture
- React Router remains the application shell.
- Zustand persists links and collections to localStorage. This is intentionally browser/device-local, not cross-account cloud sync.
- Formik + Yup validate create/edit forms.
- Pure link filtering/sorting functions are isolated and covered with Node's built-in test runner.
- React Icons provide interface glyphs; site favicons are loaded dynamically with a safe fallback.

## Scope
- CRUD links; HTTP(S)-only URLs; notes; collection assignment; favorites.
- Smart views, collection filters, full-text search and sort modes.
- Create/delete collections.
- Export/import JSON backup.
- Responsive sidebar and mobile layout.
- Accessible dialogs, labels, focusable controls, and keyboard close behavior.
- Empty states and action feedback.

## Verification
- Run `npm test`, `npm run lint`, and `npm run build` after pulling.
- Manually verify add/edit/delete/favorite, search, sorting, collection CRUD, reload persistence, and backup import/export in the browser.

# LinkVault

A responsive bookmark manager based on the inspected Figma **Desktop Light mode** frame. Built with React, Vite, Zustand, Formik, Yup, Tailwind CSS, and custom CSS.

## Workspace features

- Add, edit, and delete bookmarks.
- Save notes and assign bookmarks to collections.
- Favorite bookmarks and filter by Favorites.
- Create, rename, and delete collections.
- Search titles, URLs, and notes.
- Sort by newest, oldest, title A–Z, and title Z–A.
- Switch between grid and list layouts.
- Switch between light and dark appearance.
- Open Settings to change and persist appearance and layout preferences.
- Import and export a JSON backup for bookmarks and collections.
- Original Figma SVG icons and project images, with graceful icon/favicon fallbacks.
- Responsive desktop, tablet, and mobile layout.

## Demo account screens

The app includes visual sign-in, registration, password-reset, and sign-out flows. These screens validate email shape, password length, and confirmation fields. A successful sign-in/register stores only a demo profile (name and email) in browser storage. **No password is stored, no real authentication provider is connected, and no reset email is sent.**

Any syntactically valid email and password meeting the form rules can be used to preview the demo flow.

## Data and privacy

Bookmarks, collections, theme preferences, and the demo profile are stored in the current browser's localStorage. They are not synchronized between devices or browsers. Use **Export backup** and **Import backup** to move bookmark data.

The initial workspace contains seven sample bookmarks across three collections to illustrate the Figma layout. Sample React, Tailwind CSS, and Hugging Face cards use original Figma project image assets when those files are downloaded; otherwise, the site favicon or icon fallback is shown.

## Original Figma assets

Run this PowerShell script from the project root to download the image and SVG assets that were extracted from the Figma source:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-figma-assets.ps1
```

The script places files in `public/assets/figma/`. Figma asset links are temporary and may expire; the script reports any files it cannot download.

## Getting started

Requirements: Node.js 22.12+ (or another Vite-supported version) and npm.

```bash
npm install
npm run dev
```

## Verification commands

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Project structure

```text
src/
├── app/                         # App routes
├── components/                  # Shared Figma asset icon wrapper
├── features/
│   ├── auth/
│   │   ├── store/                # Demo profile session, no passwords
│   │   └── validation/           # Login/register/reset schemas
│   ├── links/
│   │   ├── components/           # Bookmark cards and forms
│   │   ├── services/             # Prepared API service
│   │   ├── store/                # Bookmark and collection state
│   │   ├── utils/                # Search, sorting, display helpers
│   │   └── validation/           # Bookmark validation
│   └── settings/
│       ├── components/           # Appearance and layout settings
│       └── store/                # Persisted theme and view preferences
├── lib/                          # Axios client
├── pages/                        # Workspace and account screens
└── styles/                       # Design tokens

public/assets/figma/              # Downloaded original Figma assets
scripts/                           # PowerShell asset helper
tests/                             # Node test suites
docs/superpowers/plans/             # Implementation plans
```

## Tech stack

| Library | Role |
|---|---|
| React | UI components |
| React Router DOM | Workspace and account routes |
| Zustand | Persisted bookmark, demo-profile, and preference state |
| Formik | Form state and submission |
| Yup | Form validation |
| Tailwind CSS v4 + custom CSS | Styling and responsive layouts |
| React Icons | Interface icon fallbacks |
| Vite | Development and production build |
| Oxlint | Static code checks |
| Node.js test runner | Unit tests |

## Backup format

JSON backups contain the app name, version, export timestamp, collections, and bookmarks. Import validates each URL, merges collections by name, and skips duplicate URLs.

## Important notes

- Only HTTP and HTTPS bookmark URLs are accepted.
- Demo account screens are not production authentication.
- No passwords or API secrets are stored by the demo account flow.
- Local browser storage is not a cloud database or multi-device sync.

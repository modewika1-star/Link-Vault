# LinkVault

A responsive bookmark manager built with React, Vite, Zustand, Formik, Yup, and Tailwind CSS. The interface follows the inspected Figma **Desktop Light mode** design: a 256px navigation sidebar, Smart Views, Collections, a searchable header, sorting controls, and bookmark cards.

## Features

- Add, edit, and delete bookmarks.
- Validate titles and allow only HTTP/HTTPS URLs.
- Add notes and assign bookmarks to collections.
- Mark bookmarks as favorites and use the Favorites smart view.
- Create, rename, and delete collections.
- Search bookmark titles, URLs, and notes.
- Sort by newest, oldest, title A–Z, or title Z–A.
- Import and export a JSON backup containing bookmarks and collections.
- Responsive sidebar and layout for smaller screens.
- Dynamic website favicons with a local icon fallback.
- Automatic persistence in browser localStorage.

## Important storage note

This version stores data in the current browser on the current device. It does not include user accounts, a hosted database, or automatic synchronization between browsers/devices. Use **Export backup** and **Import backup** to move your data.

The first run includes seven example bookmarks across three collections to demonstrate the designed layout. You can edit or delete them like any other bookmark.

## Tech Stack

| Library | Usage |
|---|---|
| React | Component-based interface |
| React Router DOM | Client-side routing |
| Zustand | Application state and persisted bookmarks |
| Formik | Bookmark forms |
| Yup | Validation |
| Tailwind CSS v4 | Utility CSS integration |
| Custom CSS | Figma-aligned layout and responsive styling |
| React Icons | Interface icons |
| Axios | Prepared HTTP client for a future API integration |
| Vite | Development server and production build |
| Oxlint | Static code checks |
| Node.js test runner | Unit tests for search and sorting utilities |

## Getting Started

Requirements: Node.js 22.12+ (or a Vite-supported Node.js version) and npm.

```bash
npm install
npm run dev
```

## Scripts

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Project Structure

```text
src/
├── app/                         # Application routing
├── features/links/
│   ├── components/
│   │   ├── CollectionModal.jsx
│   │   ├── LinkCard.jsx
│   │   └── LinkModal.jsx
│   ├── services/                # Prepared API service layer
│   ├── store/                   # Zustand state and local persistence
│   ├── utils/                   # Search, sorting, and display helpers
│   └── validation/              # Yup schemas
├── lib/                         # Axios client
├── pages/                       # Route-level pages and layout styles
├── styles/                      # Design tokens
├── App.jsx
├── index.css
└── main.jsx

docs/
└── superpowers/plans/            # Implementation plan
tests/                            # Node.js unit tests
```

## Data backup format

Backups are JSON files containing the app name, version, export timestamp, collections, and bookmarks. Import merges records into the current vault and skips duplicate URLs.

## Security and privacy

- Only HTTP and HTTPS bookmark links are accepted.
- Imported JSON is validated before records are added.
- No user credentials or API secrets are required for local use.
- Do not commit real environment secrets. Use `.env.example` as the variable template.

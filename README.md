# LinkVault

LinkVault is a responsive bookmark manager built with React and Vite. It keeps links, notes, favorites, and collections in the browser, with a clean desktop and mobile workspace.

## Features

- Add, edit, and delete bookmarks.
- Save descriptions and personal notes.
- Organize bookmarks into named, color-coded collections.
- Mark favorites, search saved content, and sort by date or title.
- Switch between grid and list views.
- Switch between light and dark themes.
- Fetch a page title, description, and cover image when a public preview is available.
- Manage bookmarks and collections from Settings.
- Use the demo sign-in, registration, and password recovery screens to preview the account UI.

> Account screens are a front-end demo. No real account, password, email verification, or social sign-in is created. Bookmarks and preferences are saved only in the current browser.

## Run locally

Use Node.js 22.12 or later and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the project before sharing it:

```bash
npm test
npm run lint
npm run build
```

## Libraries used in this project

| Library | How LinkVault uses it |
|---|---|
| `react` and `react-dom` | Build the workspace, bookmark cards, dialogs, and account screens. |
| `react-router-dom` | Navigate between the workspace, sign-in, registration, password recovery, and not-found screens. |
| `zustand` | Hold bookmarks, collections, demo session state, and user preferences. The persist middleware saves the relevant state in localStorage. |
| `formik` | Manage the bookmark, collection, and account forms, including field state and submission. |
| `yup` | Validate URLs, required fields, email addresses, and password rules before forms are submitted. |
| `axios` | Request public page metadata from the Microlink preview endpoint when the user chooses Fetch Preview. |
| `tailwindcss` and `@tailwindcss/vite` | Load Tailwind CSS v4 in the Vite build. Utility classes are available alongside the project's component styles. |
| `react-icons` | Provide interface icons and fallbacks when an original Figma SVG cannot load. |
| `vite` and `@vitejs/plugin-react` | Run the local development server and build the React application. |
| `oxlint` | Check JavaScript and React code for common issues. |
| Node.js test runner | Run the unit tests in the `tests/` folder without an extra test framework. |

## Project structure

```text
src/
├── app/                       # Route definitions
├── components/                # Shared interface components
├── features/
│   ├── auth/                  # Demo account state and validation
│   ├── links/                 # Bookmark and collection UI, state, and validation
│   └── settings/              # Theme and layout preferences
├── lib/                       # Configured Axios client and text formatting helper
├── pages/                     # Workspace and account pages
└── styles/                    # Shared design tokens

public/assets/figma/           # Original interface icons and sample artwork
tests/                         # Unit tests
scripts/                       # Optional Figma asset download helper
```

## Design system

Shared colors, spacing, sizing, typography, border radii, and shadows are defined in `src/styles/design-tokens.css`. Component styles should use those variables instead of introducing new one-off visual values. The same file exposes the core colors, type, spacing, radius, and shadow tokens to Tailwind through `@theme inline`.

## Data and privacy

Bookmarks, collections, theme preferences, and the demo profile are stored in the current browser's localStorage. They are not synchronized between browsers or devices. The page-preview request sends the URL entered by the user to the Microlink service to retrieve public metadata.

The initial workspace includes sample links and collections so the interface is populated on first launch. Users can remove or edit these examples in the workspace.

## GitHub

Repository: https://github.com/modewika1-star/Link-Vault

The repository is public. Install dependencies with `npm ci`; the `node_modules/` directory and local environment files are excluded by `.gitignore`.

## Notes

- Only HTTP and HTTPS bookmark URLs are accepted.
- The demo account screens do not provide production authentication.
- No API server or cloud database is connected to bookmark storage.

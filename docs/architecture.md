# Project architecture

## Application entry

- `src/main.jsx` mounts the React application.
- `src/app/router.jsx` defines the workspace and account routes.
- `src/pages/` contains page-level components.

## Features

Feature code stays together under `src/features/`:

- `auth/` stores the demo profile and account validation schemas.
- `links/` owns bookmark and collection dialogs, cards, state, and validation.
- `settings/` owns the theme and layout preferences.

## Shared code

- `src/components/` contains UI pieces shared across pages.
- `src/lib/` contains the Axios client and small text-formatting helper.
- `src/styles/design-tokens.css` is the source of truth for the visual system.

## State and data

Zustand stores bookmarks, collections, the demo session, and appearance preferences. Persisted state uses localStorage, so data stays in the current browser. Account screens are a UI preview and are not connected to an authentication provider.

The bookmark preview action calls Microlink through Axios to read public page metadata. No bookmark API or server-side database is currently connected.

## Styling

Tailwind CSS v4 is loaded through the Vite plugin. The existing Figma-matched layouts use component CSS, with colors, sizing, spacing, typography, radii, and shadows shared through the central design-token file. New styles should use those tokens rather than adding one-off values.

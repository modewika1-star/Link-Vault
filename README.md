# Link Vault

A link management application built with React and Vite.

## Tech Stack

| Library | Usage |
|---|---|
| React | Builds reusable interface components |
| React DOM | Renders the React application |
| React Router DOM | Handles client-side navigation and routes |
| Axios | Provides a centralized HTTP client for API requests |
| Zustand | Manages shared application state and persisted saved links |
| Formik | Handles form state, submission, and user input |
| Yup | Validates link titles and HTTP(S) URLs |
| Tailwind CSS | Provides utility-first styling |
| React Icons | Supplies interface icons |
| Vite | Runs the development server and creates production builds |
| Oxlint | Checks JavaScript and React code quality |

## Getting Started

### Requirements

- Node.js (a current supported LTS version)
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run lint checks

```bash
npm run lint
```

## Project Structure

```text
src/
├── app/                  # Application setup and routing
├── assets/               # Images, icons, and fonts
├── components/           # Reusable UI and shared components
├── features/
│   └── links/
│       ├── components/   # Link feature components
│       ├── hooks/        # Feature-specific hooks
│       ├── services/     # Link API operations
│       ├── store/        # Link state management
│       └── validation/   # Form validation schemas
├── hooks/                # Shared custom hooks
├── layouts/              # Page layouts
├── lib/                  # Configured third-party clients
├── pages/                # Route-level pages
├── stores/               # Shared application stores
├── styles/               # Design tokens and styling
├── utils/                # Shared utility functions
├── App.jsx
├── index.css
└── main.jsx

public/
└── assets/               # Static public assets

docs/                     # Project documentation
```

## Library Usage

### React Router DOM

Routes are configured in `src/app/router.jsx`. Add new route components there.

### Axios

The configured Axios instance is in `src/lib/axios.js`. Set `VITE_API_BASE_URL` in your local environment when an API endpoint is available. The current interface uses local browser storage and does not require an API.

### Zustand

The links store is in `src/features/links/store/useLinksStore.js`. It provides actions to add and remove links and persists the saved links in browser `localStorage`.

Saved links are local to the current browser and device. They are not synchronized across accounts or devices. Clearing this site's browser storage removes the saved links.

### Formik

The link form in `src/features/links/components/LinkForm.jsx` uses Formik to manage field values, validation state, and submission.

### Yup

The schema in `src/features/links/validation/linkSchema.js` validates link titles and requires URLs to use the HTTP or HTTPS protocol.

### Tailwind CSS

Tailwind CSS v4 is integrated through the Vite plugin in `vite.config.js`. Global styles are loaded from `src/index.css`.

### React Icons

Icons are imported from `react-icons/fi` where needed.

## Design System

Design tokens are centralized in `src/styles/design-tokens.css`.

The token file defines:

- Colors
- Typography
- Spacing
- Border radii
- Layout dimensions
- Shadows

Use existing design tokens instead of introducing arbitrary repeated design values. Replace starter token values with the approved Figma values during final UI implementation.

## Environment Variables

Copy `.env.example` to `.env` and configure the values required for your local environment.

Never commit real secrets or private environment files.

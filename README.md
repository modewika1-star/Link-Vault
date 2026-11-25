<!-- LinkVault README | crafted for GitHub -->

<div align="center">

# 🔗 LinkVault

### Your personal space for saving, organizing, and revisiting the links that matter.

A responsive bookmark manager with collections, favorites, search, flexible views, and a calm workspace for desktop and mobile.

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=222)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

<br />

**[Explore the repository](https://github.com/modewika1-star/Link-Vault)**

</div>

---

## ✨ About the project

LinkVault helps you keep useful websites, learning resources, articles, and everyday references organized in one place. Instead of leaving links scattered across tabs and messages, you can save each bookmark with its details, group related links into collections, and find them again through search and filters.

The interface is designed around a focused workspace that adapts to different screen sizes and supports both light and dark themes.

## 🚀 Features

| Feature | What it does |
| --- | --- |
| 🔖 **Bookmark management** | Create, edit, and delete saved links. |
| 📝 **Rich link details** | Keep a title, URL, description, notes, and cover image with a bookmark. |
| 🗂️ **Collections** | Group bookmarks into named, color-coded collections. |
| ⭐ **Favorites** | Mark important links and access them quickly. |
| 🔎 **Search and sorting** | Find saved links and sort by newest, oldest, or title. |
| 🧩 **Flexible workspace** | Switch between grid and list layouts. |
| 🌗 **Appearance** | Choose a light or dark theme. |
| ⚙️ **Workspace settings** | Manage bookmarks and collections from the settings interface. |
| 🖼️ **Link previews** | Retrieve page metadata through Microlink and check cover images before saving. |
| 📱 **Responsive UI** | Use the workspace on desktop and mobile screens. |

## 🧭 How it works

1. Add a bookmark with its title, destination URL, description, and cover image.
2. Organize related bookmarks into collections.
3. Mark frequently used resources as favorites.
4. Search, sort, or switch the layout to find what you need.
5. Update your workspace appearance whenever you want.

## 🛠️ Tech stack

| Technology | Role in LinkVault |
| --- | --- |
| **React 19** | Builds the interactive workspace, cards, dialogs, and account screens. |
| **Vite 8** | Provides the development server and production build pipeline. |
| **JavaScript (ES Modules)** | Implements application logic and feature modules. |
| **Tailwind CSS 4** | Provides utility-first styling through the Vite integration. |
| **Zustand** | Manages bookmark, collection, demo-session, and preference state. |
| **React Router** | Handles workspace and account-page navigation. |
| **Formik + Yup** | Manage forms and validate submitted values. |
| **Axios** | Requests page metadata through the configured Microlink integration. |
| **React Icons** | Supplies interface icons and visual fallbacks. |
| **Oxlint** | Checks the codebase for common JavaScript and React issues. |
| **Node.js Test Runner** | Runs the project's tests without an additional test framework. |

## ⚙️ Getting started

### Prerequisites

- Node.js **22.12 or later**
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/modewika1-star/Link-Vault.git

# Move into the project directory
cd Link-Vault

# Install dependencies
npm ci

# Start the development server
npm run dev
```

Vite will print the local development URL in your terminal.

### Production build

```bash
npm run build
npm run preview
```

### Quality checks

```bash
npm test
npm run lint
npm run build
```

## 🗂️ Project structure

```text
src/
├── app/                       # Application routes
├── components/                # Shared interface components
├── features/
│   ├── auth/                  # Demo account state and validation
│   ├── links/                 # Bookmark and collection features
│   └── settings/              # Theme and layout preferences
├── lib/                       # Axios client and text helpers
├── pages/                     # Workspace and account pages
└── styles/                    # Shared design tokens

public/assets/figma/           # Interface icons and sample artwork
tests/                         # Unit tests
scripts/                       # Optional Figma asset helper
```

## 🎨 Design system

The shared visual language lives in `src/styles/design-tokens.css`. It defines the core colors, spacing, sizing, typography, radii, shadows, and responsive breakpoints.

Keeping these values centralized makes the interface easier to maintain and helps components stay visually consistent as the project grows.

## 🔐 Data, privacy & limitations

- Bookmarks, collections, theme preferences, and the demo profile are stored in the current browser using `localStorage`.
- Data is **not** synchronized between browsers or devices.
- Bookmark URL verification and page previews send the URL entered by the user to the Microlink service.
- Cover images are checked by loading them in the browser.
- The sign-in, registration, verification, and password-recovery screens are **front-end demo flows**. They do not create real accounts or provide production authentication.
- No API server or cloud database is connected to bookmark storage.
- The first workspace view includes sample links and collections that can be edited or removed.

> **Please note:** LinkVault is currently a browser-based bookmark manager. Do not use its demo account screens to store real credentials.

## 📌 Project information

| | |
| --- | --- |
| **Repository** | [modewika1-star/Link-Vault](https://github.com/modewika1-star/Link-Vault) |
| **Application type** | Frontend web application |
| **Build tool** | Vite |
| **Styling** | Tailwind CSS v4 + project design tokens |
| **Storage** | Browser localStorage |

---

<div align="center">

Made with ❤️ by **[7ijazi](https://7ijazi.vercel.app/)**

<sub>LinkVault · Keep your useful links close.</sub>

</div>

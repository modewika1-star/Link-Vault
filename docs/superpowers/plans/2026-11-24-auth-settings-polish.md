# LinkVault interaction and account UI refinement

## Goal
Keep the existing Figma-aligned bookmark workspace intact while fixing missing controls and adding clearly labeled, non-production account screens.

## User-approved scope
- Add guest/demo-account sign-in, registration, password-reset, account display, and sign-out screens. These are front-end demonstrations only; they must not claim to authenticate users or send email.
- Validate email addresses and password/confirmation fields with Yup.
- Place account actions directly below the brand/logo in the sidebar.
- Remove the "Saved on this device" card completely.
- Make the sidebar Settings button functional.
- Add light/dark theme and grid/list view controls, persisted locally.
- Keep existing bookmark and collection actions functional.
- Use actual raster assets from the Figma source instead of invented/third-party decorative images; download them into public/assets/figma via a PowerShell helper.

## Implementation
1. Add persistent appearance preferences and demo-session stores.
2. Add Yup schemas and Node tests for demo auth forms.
3. Add AuthPage routes for login, register, forgot password, plus a sign-out screen.
4. Add SettingsModal for appearance and layout controls.
5. Update HomePage with account panel, working Settings, theme/layout controls, remove local-storage notice card, and wire list/grid rendering.
6. Update LinkCard to use locally downloaded Figma assets with graceful favicon fallback.
7. Add PowerShell asset-download helper for the original Figma image and SVG URLs.
8. Run tests, lint, and build locally after the user pulls the changes; verify remote file contents and CI status where available.

## Constraints
- No real identity provider, account database, password storage, or email delivery.
- Never store passwords in localStorage.
- Bookmark/collection data remains browser-local and is not synchronized.
- Do not change the Figma file itself.

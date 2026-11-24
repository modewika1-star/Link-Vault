# Full Arabic/English interface switch

## Summary
Add persisted locale state, a shared translation helper, app-wide document direction, a toolbar language switch, and Arabic strings for every user-facing LinkVault screen. Remove the Your Data/export/import controls as requested.

## Tasks
1. Add the translation dictionary, persisted language preference, and app-root lang/dir handling.
2. Translate HomePage, settings management, bookmark/collection dialogs, bookmark cards, auth screens, and the not-found page.
3. Replace the Your Data toolbar menu with the ع/E toggle and remove the footer export button.
4. Add unit tests for translated labels, interpolation, and English fallback.
5. Verify test, lint, build, CI status, and the latest production deployment.

## Acceptance checks
- English remains the default for existing and new users.
- Selecting Arabic changes all application-owned interface text and switches the document to RTL.
- The toggle shows ع in English mode and E in Arabic mode; switching persists across reloads/routes.
- User-created bookmark and collection content is not modified.
- No Your Data, import/export menu, or footer export button remains.

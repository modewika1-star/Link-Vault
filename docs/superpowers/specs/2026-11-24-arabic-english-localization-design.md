# Arabic and English localization design

## Goal
Provide a complete Arabic/English interface switch for LinkVault and remove the data-export menu from the workspace toolbar.

## Chosen approach
- Store the selected locale with the existing persisted appearance preferences.
- Keep the default locale English to preserve the current first-visit experience.
- Add a compact toggle in the former Your Data toolbar position. It displays **ع** while English is active and **E** while Arabic is active.
- Centralize UI copy in a small translation dictionary and expose a React hook for components.
- Set the document language and direction to Arabic/RTL or English/LTR at the app root.
- Translate all app-owned labels, dialogs, settings, form copy, and feedback while leaving user-created bookmark titles, URLs, notes, and collection names untouched.

## Scope
- Remove the Your Data popover, its export/import actions, and the duplicate footer export action.
- Keep backup data handling in the data store unchanged; only remove the current UI entry points.
- Do not change authentication behavior, bookmark persistence, visual theme, or layout preferences.

# Architecture Notes

## Feature organization

Feature-specific code belongs inside `src/features/<feature-name>/`.

The links feature owns its components, services, state, hooks, and validation rules. This keeps related functionality together and makes future features easier to add.

## Shared code

- `src/components/`: reusable interface components
- `src/hooks/`: shared React hooks
- `src/lib/`: configured external libraries
- `src/stores/`: state shared across multiple features
- `src/utils/`: reusable utility functions
- `src/styles/`: global styles and design tokens

## Design token rules

1. Define shared design values in `src/styles/design-tokens.css`.
2. Prefer semantic tokens such as `brand`, `surface`, and `ink`.
3. Avoid repeating raw color, spacing, radius, and shadow values in components.
4. Replace starter token values with approved Figma values before final UI implementation.

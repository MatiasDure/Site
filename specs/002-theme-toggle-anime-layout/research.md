# Research: Theme Selection And Mobile Anime Layout

## Decision 1: Use a document-level theme attribute with semantic CSS variables

- Decision: Apply the active theme through a root-level attribute such as `data-theme` on the `html` element and define semantic CSS custom properties in `app/globals.css`, which are then surfaced to Tailwind through `@theme inline` tokens.
- Rationale: This keeps the theme model centralized, avoids duplicating light and dark class lists in every component, and lets Tailwind utilities consume semantic tokens such as surface, text, border, and accent colors.
- Alternatives considered:
  - Keep hardcoded `dark:*` utilities everywhere: rejected because the feature needs an explicit visitor-controlled theme rather than system-only dark mode and would require touching many components repeatedly.
  - Create separate theme wrapper classes for each component tree: rejected because it duplicates styling logic and makes future color updates more expensive.

## Decision 2: Use a minimal client component for theme selection and persistence

- Decision: Introduce one small `ThemeToggle` client component that reads and writes a persisted theme preference, updates the root document attribute, and exposes an accessible toggle control in shared navigation.
- Rationale: Theme selection requires browser state and storage, but the rest of the application can remain server components. Limiting client behavior to the toggle preserves the project's server-first architecture.
- Alternatives considered:
  - Convert the layout or navigation tree into large client components: rejected because that sends unnecessary JavaScript and weakens the current server-component boundaries.
  - Use a third-party theming package: rejected because the feature is small and the constitution discourages new dependencies when platform primitives are sufficient.

## Decision 3: Default to system preference until the visitor chooses a theme

- Decision: On first visit, resolve the initial theme from `prefers-color-scheme`; after the visitor chooses light or dark mode, persist that explicit preference in browser storage and keep using it on later visits.
- Rationale: This matches the spec, respects user expectations, and avoids forcing an arbitrary default theme on first load.
- Alternatives considered:
  - Default to light mode for everyone: rejected because it ignores the visitor's device preference.
  - Continuously mirror system preference after explicit selection: rejected because it would override the user's deliberate choice.

## Decision 4: Prevent theme flash with a small bootstrap script in the root layout

- Decision: Add a small inline bootstrap script in `app/layout.tsx` that reads persisted preference before hydration and sets the root theme attribute immediately.
- Rationale: Without an early theme application step, the page can render in the wrong theme and visibly switch after hydration. A tiny bootstrap script avoids that flash while preserving static rendering.
- Alternatives considered:
  - Apply theme only after React hydrates: rejected because it creates a visible flash of the wrong theme.
  - Move theme resolution to runtime server rendering: rejected because it conflicts with the project's static-first constitution.

## Decision 5: Change the anime list to a single-column mobile grid and update image sizing

- Decision: Set the anime list grid to one column on phone-sized viewports and only expand to multiple columns at larger breakpoints, while updating `next/image` `sizes` values to match the new responsive layout.
- Rationale: The current `grid-cols-3` mobile layout compresses cards and cover art too aggressively. A single-column mobile grid directly satisfies the spec and improves readability without changing the number of anime items.
- Alternatives considered:
  - Use horizontal scrolling on mobile: rejected because it adds interaction cost and hides content off-screen.
  - Keep multiple columns but enlarge cards: rejected because it still forces cramped text and image layouts on narrow screens.
# Contract: Theme Preference And Activity Layout UI

## Purpose

Define the visitor-facing behavior and internal UI contract for explicit theme selection and the responsive anime activity grid.

## Theme Preference Contract

### Visitor Control

- The site exposes one visible theme control in shared navigation.
- The control must allow explicit selection between `light` and `dark`.
- The control must be keyboard reachable and provide an accessible label describing the current action.

### Persistence Contract

- The site stores an explicit theme preference in browser storage using one stable key.
- If no stored preference exists, the site resolves the initial theme from `prefers-color-scheme`.
- Once a visitor explicitly chooses a theme, later visits use the stored value until the visitor changes it.

### DOM Styling Contract

- The active theme is exposed on the root document via one stable attribute.
- Shared semantic color tokens are defined for both supported themes.
- Tailwind utility classes in touched components consume semantic tokens rather than duplicating separate light/dark class trees when a token can express the same intent.

## Anime Activity Layout Contract

### Responsive Grid Behavior

- On viewport widths from 320 px through 639 px, the anime grid renders one card per row.
- On larger breakpoints, the grid may expand to multiple columns if card readability is preserved.
- The grid must not introduce horizontal page scrolling in supported mobile widths.

### Card Content Behavior

- Each anime card continues to expose cover art, title, and destination link.
- Card media sizing must match the responsive grid so the browser requests appropriately sized images.
- Long titles must remain visually contained within the card.

## Internal State Contract

```ts
type ThemeMode = 'light' | 'dark';

interface ThemePreference {
  mode: ThemeMode;
  source: 'system' | 'stored' | 'user';
}

interface ResolvedThemeState {
  activeMode: ThemeMode;
  documentAttribute: string;
}
```

## Behavioral Rules

1. Theme changes apply immediately on the current page.
2. Theme changes remain active across navigation.
3. First paint should use the resolved theme rather than flashing the wrong palette.
4. Fallback content in the activity section must remain legible in both themes.
5. The anime section must use one column on mobile even when more than one item is present.
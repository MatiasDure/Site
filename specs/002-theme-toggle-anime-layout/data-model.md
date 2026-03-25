# Data Model: Theme Selection And Mobile Anime Layout

## Entity: ThemePreference

- Purpose: Represents the visitor's chosen appearance mode for the site.
- Fields:
  - `mode`: `"light" | "dark"`. Required. The explicit appearance chosen by the visitor.
  - `source`: `"system" | "stored" | "user"`. Required. Indicates whether the resolved theme came from device preference, a persisted stored value, or an in-session user action.
  - `storageKey`: string. Required. The browser-storage key used to persist the explicit preference.
- Validation rules:
  - `mode` must be limited to `"light"` or `"dark"`.
  - A stored value outside the supported set must be ignored and replaced by the system-derived initial theme.

## Entity: ResolvedThemeState

- Purpose: Represents the theme state applied to the root document at render or hydration time.
- Fields:
  - `activeMode`: `"light" | "dark"`. Required. The mode currently applied to the document.
  - `documentAttribute`: string. Required. The root-level attribute name used to expose theme state to styling.
  - `tokensApplied`: boolean. Required. Indicates whether semantic color variables are available for the active theme.
- State transitions:
  - `system-derived` -> `user-selected`: occurs when the visitor explicitly chooses a theme.
  - `stored` -> `user-selected`: occurs when the visitor changes a previously persisted preference.

## Entity: ThemeTokenSet

- Purpose: Represents the semantic color values consumed by shared UI surfaces.
- Fields:
  - `background`: page background token.
  - `foreground`: primary text token.
  - `surface`: card and elevated surface token.
  - `surfaceMuted`: subdued surface token for chips and secondary blocks.
  - `border`: shared border token.
  - `accent`: primary interactive emphasis token.
  - `accentForeground`: text/icon color on accent surfaces.
  - `mutedForeground`: secondary text token.
- Validation rules:
  - Both light and dark theme token sets must define the same semantic token names.
  - Shared interactive elements must consume semantic tokens rather than hardcoded theme-specific zinc pairs when touched by this feature.

## Entity: AnimeActivityGrid

- Purpose: Represents the responsive layout behavior of the anime cards in the activity section.
- Fields:
  - `mobileColumns`: number. Required. Must resolve to `1` for phone-sized viewports.
  - `tabletColumns`: number. Required. A multi-column value used for medium-width layouts.
  - `desktopColumns`: number. Required. A multi-column value used for wide layouts.
  - `cardImageSizes`: string. Required. Responsive `sizes` mapping aligned with the grid breakpoints.
- Validation rules:
  - `mobileColumns` must remain `1` for supported phone widths.
  - `cardImageSizes` must match the grid's actual breakpoint behavior to avoid oversized or undersized image downloads.

## Relationships

- `ThemePreference` resolves into one `ResolvedThemeState`.
- `ResolvedThemeState` determines which `ThemeTokenSet` is active.
- `AnimeActivityGrid` is independent of theme persistence but must remain visually compatible with both token sets.
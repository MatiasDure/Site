# Quickstart: Theme Selection And Mobile Anime Layout

## Prerequisites

1. Install dependencies with `npm install` if they are not already present.
2. Start from branch `002-theme-toggle-anime-layout`.

## Run The Site

1. Start the development server with `npm run dev`.
2. Open `http://localhost:3000`.
3. Keep browser responsive tools available to verify both desktop and mobile states.

## Validate Primary Scenarios

### Scenario 1: First-load theme follows system preference

1. Clear any stored site theme preference from browser storage.
2. Set the operating system or browser preference to dark mode.
3. Load the site and confirm it opens in dark mode.
4. Repeat with light mode and confirm the site opens in light mode.

### Scenario 2: Theme choice persists across navigation and return visits

1. Open the site and switch the theme using the visible theme control.
2. Navigate from the home page to a domain page and then to a project detail page.
3. Confirm the selected theme remains active on each page.
4. Refresh the page or reopen the site and confirm the same theme is restored.

### Scenario 3: Shared surfaces stay readable in both themes

1. Toggle between light and dark modes on the home page.
2. Inspect navigation, footer, hero copy, project cards, Spotify/anime cards, empty states, and project-detail buttons.
3. Confirm text, borders, backgrounds, and focus states remain legible in both modes.

### Scenario 4: Anime cards stack one-per-row on mobile

1. Set the viewport width between 320 px and 639 px.
2. Scroll to the anime section.
3. Confirm the list renders exactly one anime card per row.
4. Confirm there is no horizontal scrolling and long anime titles remain within the card width.

## Verification Gates

1. Run `npm run lint`.
2. Run `npm run build`.
3. Re-check the home page and at least one project page after both commands succeed.

## Notes

- The preferred implementation is semantic CSS variables plus Tailwind token consumption, not duplicate theme-specific class trees.
- The anime-grid verification should include both populated data and the no-anime fallback state.
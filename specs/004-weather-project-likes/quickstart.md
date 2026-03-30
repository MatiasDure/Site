# Quickstart: Enschede Weather, GitHub Contributions, And Project Likes

## Prerequisites

1. Install dependencies with `npm install`, including `@mariohamann/activity-graph`.
2. Configure Google OAuth2 credentials for the application callback URL.
3. Create a local SQLite database file path for development.
4. Ensure the following environment values exist in `.env.development`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - `GITHUB_USERNAME`
   - `GITHUB_TOKEN`
   - `DATABASE_PATH`
5. Confirm the local deployment target supports a Node runtime and writable access to the configured SQLite file.

## Run The Site

1. Start the development server with `npm run dev`.
2. Open `http://localhost:3000`.
3. Keep a browser session available for Google sign-in testing.

## Validate Primary Scenarios

### Scenario 1: Weather renders on the homepage

1. Open the homepage.
2. Confirm the Enschede weather card renders a readable current-weather summary.
3. Simulate or force an unavailable weather response.
4. Confirm the card falls back to a clear unavailable state without breaking layout.

### Scenario 2: GitHub activity graph renders for the past year

1. Open the homepage section that contains GitHub activity.
2. Confirm the `activity-graph` component renders in a calendar-style columns-by-rows layout.
3. Confirm days with no contributions are still visible as empty or low-activity cells.
4. Confirm the graph styling follows the site's active theme through package theme classes or CSS variable overrides.
5. Simulate or force an unavailable GitHub response.
6. Confirm the grid area falls back to a clear unavailable state.

### Scenario 3: Google sign-in gates like actions

1. Visit the homepage while signed out.
2. Attempt to like a project from a project card.
3. Confirm the site routes the user into Google sign-in rather than recording the like.
4. Complete Google sign-in.
5. Confirm the user returns to a meaningful project-browsing context.

### Scenario 4: Likes stay consistent across cards and detail pages

1. Sign in with Google.
2. Like a project from its card on the homepage or a domain page.
3. Open the corresponding project detail page.
4. Confirm the project detail page reflects the same liked state.
5. Remove the like from the detail page.
6. Return to the card view and confirm the unliked state and like count stay in sync.

### Scenario 5: Project sync keeps Markdown content aligned with SQLite rows

1. Add or update a Markdown project file under `projects/<domain>/`.
2. Run the project synchronization path used by the application.
3. Confirm the corresponding SQLite `Project` row exists with the expected persisted fields and stable ID.

## Verification Gates

1. Run `npm run lint`.
2. Run `npm run build`.
3. Re-run the manual scenarios above after both commands succeed.

## Notes

- Open-Meteo does not require a key for the planned usage, so configuration risk is lower than the GitHub and Google integrations.
- If the contribution graph does not render, verify that the client wrapper imports `@mariohamann/activity-graph` so the custom element is registered before the graph is mounted.
- If the site is deployed to a purely static CDN target, Google OAuth2 and SQLite-backed likes will not function; the feature requires a runtime-capable host.

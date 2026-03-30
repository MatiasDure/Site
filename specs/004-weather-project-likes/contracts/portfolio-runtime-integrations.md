# Contract: Portfolio Runtime Integrations

## Purpose

Define the external service contracts and internal application contracts for weather, GitHub activity, Google-authenticated sessions, project synchronization, and project-like mutations.

## External API Contracts

### Open-Meteo Current Weather

- Endpoint: `GET https://api.open-meteo.com/v1/forecast`
- Query shape:
  - `latitude=<Enschede latitude>`
  - `longitude=<Enschede longitude>`
  - `current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m`
  - `timezone=auto`
- Required outcome:
  - A current-weather payload that can be normalized into `WeatherSnapshot`
- Failure behavior:
  - Any non-usable response yields `status = 'unavailable'`

### GitHub Contribution Calendar

- Endpoint: `POST https://api.github.com/graphql`
- Authentication: GitHub token supplied server-side
- Required query result:
  - User contribution data for the most recent 12 months using `contributionsCollection`
  - Calendar weeks and days sufficient to render a columns-by-rows contribution graph
- Required day fields:
  - `date`
  - `contributionCount`
  - `contributionLevel`
- Failure behavior:
  - Any non-usable response yields an unavailable GitHub contribution state

### Google OAuth2 Sign-In

- Provider: Google OAuth2 through Auth.js
- Required result:
  - Verified Google identity containing at least `email`, `name`, and Google subject identifier
- Required application behavior:
  - Upsert the corresponding `User` row in SQLite
  - Establish an authenticated application session
  - Return the user to the relevant project context when sign-in originated from a like attempt

## Internal Application Contracts

### GitHub Activity Graph Rendering Contract

Component target:

```html
<activity-graph
  range-start="2025-04-01"
  range-end="2026-03-30"
  activity-data="2026-03-01,2026-03-01,2026-03-03"
  activity-levels="0,1,2,3,5"
  first-day-of-week="1"
></activity-graph>
```

Behavioral rules:

1. The graph must be rendered through `@mariohamann/activity-graph` rather than a custom-built contribution grid.
2. `range-start` and `range-end` define the full visible year window and preserve zero-activity days.
3. `activity-data` is a comma-separated list of ISO dates, and a date must appear once per contribution for that day.
4. `activity-levels` defines the graph thresholds and must be chosen once per implementation so color intensity remains consistent.
5. `first-day-of-week` should be `1` to preserve a GitHub-like Monday-first layout unless product direction changes.
6. Theme integration must be done through the package's theme classes or CSS variables without adding a separate CSS file outside `app/globals.css`.

### Project Synchronization Contract

Source input:

```ts
interface MarkdownProjectSource {
  domain: 'web' | 'app' | 'game' | 'embedded';
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
  imageUrl: string;
  demoUrl: string | null;
  repoUrl: string | null;
  htmlBody: string;
}
```

Synchronized output:

```ts
interface PersistedProject {
  id: string;
  domain: 'web' | 'app' | 'game' | 'embedded';
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
  imageUrl: string;
  demoUrl: string | null;
  repoUrl: string | null;
  htmlBody: string;
}
```

Behavioral rules:

1. The same `domain + slug` input must always produce the same `id`.
2. Sync must upsert rather than create duplicate projects.
3. Missing Markdown files must not silently remap likes to a different project.

### Like Snapshot Contract

```ts
interface ProjectLikeSnapshot {
  projectId: string;
  totalLikes: number;
  likedByViewer: boolean;
}
```

Behavioral rules:

1. `likedByViewer` depends on the authenticated session user.
2. `totalLikes` is derived from `UserProjects` row count for the project.
3. Signed-out viewers always receive `likedByViewer = false`.

### Toggle Like Mutation Contract

```ts
interface ToggleProjectLikeInput {
  projectId: string;
}

interface ToggleProjectLikeResult {
  projectId: string;
  likedByViewer: boolean;
  totalLikes: number;
}
```

Behavioral rules:

1. Signed-out callers must be redirected into authentication before mutation succeeds.
2. If no `UserProjects` row exists, the mutation creates one.
3. If a `UserProjects` row already exists, the mutation removes it.
4. The returned snapshot must reflect the post-mutation state.

## Operational Contract

- Google client secrets, GitHub tokens, and database paths remain server-only and are never sent to the browser.
- Weather and GitHub helpers should degrade to unavailable states without throwing uncaught errors into the rendered page.
- The application must continue parsing Markdown projects even if the SQLite synchronization step reports a recoverable issue, but like interactions for unsynchronized projects must fail clearly rather than corrupt data.

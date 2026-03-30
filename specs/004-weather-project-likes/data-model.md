# Data Model: Enschede Weather, GitHub Contributions, And Project Likes

## Entity: User

- Purpose: Represents a signed-in visitor authenticated via Google OAuth2.
- Fields:
  - `id`: GUID. Required. Primary key.
  - `email`: string. Required. Unique. Google account email address used for identity.
  - `name`: string. Required. Display name returned by Google.
  - `googleId`: string. Required. Unique. Stable Google subject identifier.
- Validation rules:
  - `email` must be a valid email address.
  - `email` must be unique across users.
  - `googleId` must be unique across users.
  - `name` must be non-empty after trimming.

## Entity: Project

- Purpose: Represents a portfolio project persisted for relational features while remaining sourced from Markdown files.
- Requested persisted fields:
  - `id`: GUID. Required. Primary key.
  - `title`: string. Required.
  - `description`: string. Required.
  - `featured`: boolean. Required.
  - `tags`: string array. Required. May be empty.
  - `imageUrl`: string. Required.
  - `demoUrl`: string | null. Optional external demo destination.
  - `repoUrl`: string | null. Optional source repository destination.
  - `htmlBody`: string. Required. Sanitized HTML generated from Markdown.
- Additional synchronization metadata needed by the application:
  - `domain`: `'web' | 'app' | 'game' | 'embedded'`. Required. Derived from the file path.
  - `slug`: string. Required. Derived from the Markdown filename.
- Validation rules:
  - `title` and `description` must be non-empty.
  - `imageUrl` must resolve to a non-empty path or URL.
  - `tags` must serialize as an ordered array of strings.
  - `domain + slug` must identify exactly one Markdown source file.
  - `id` must be deterministic for the same `domain + slug` pair.

## Entity: UserProject

- Purpose: Represents one active like from one user to one project.
- Fields:
  - `userId`: GUID. Required. Foreign key to `User.id`.
  - `projectId`: GUID. Required. Foreign key to `Project.id`.
- Validation rules:
  - The pair `userId + projectId` must be unique.
  - Both foreign keys must refer to existing rows before insertion.
- Behavioral rules:
  - Creating a `UserProject` row adds a like.
  - Deleting a `UserProject` row removes a like.
  - Like totals are derived from counting rows per `projectId`.

## Entity: WeatherSnapshot

- Purpose: Represents the current Enschede weather displayed on the homepage.
- Fields:
  - `locationLabel`: string. Required. Visitor-facing location label.
  - `temperatureC`: number. Required.
  - `apparentTemperatureC`: number | null. Optional.
  - `weatherCode`: number. Required. Provider weather-condition code.
  - `isDay`: boolean. Required.
  - `windSpeedKmh`: number | null. Optional.
  - `status`: `'available' | 'unavailable'`. Required.
- Validation rules:
  - `status = 'available'` requires `temperatureC` and `weatherCode`.
  - `status = 'unavailable'` must suppress stale or partial values in the UI.

## Entity: GitHubContributionDay

- Purpose: Represents one day cell in the past-year GitHub contribution grid.
- Fields:
  - `date`: string. Required. ISO calendar date.
  - `contributionCount`: number. Required. Commit/contribution count returned for that day.
  - `activityLevel`: string. Required. Relative intensity bucket used for presentation.
  - `weekday`: number. Required. Calendar row position.
- Validation rules:
  - `date` must be unique within one `GitHubContributionGrid`.
  - `contributionCount` must be zero or greater.
  - Zero-count days must remain present in the collection.

## Entity: GitHubContributionGrid

- Purpose: Represents the calendar-style columns-by-rows contribution view rendered on the site.
- Fields:
  - `days`: `GitHubContributionDay[]`. Required. Full past-year day collection.
  - `totalContributions`: number. Required.
  - `startedAt`: string. Required. Inclusive start date for the displayed range.
  - `endedAt`: string. Required. Inclusive end date for the displayed range.
  - `status`: `'available' | 'unavailable'`. Required.
- Validation rules:
  - `days` must cover the full requested display window when `status = 'available'`.
  - Days must remain ordered so the UI can form stable columns and rows.

## Relationships

- One `User` can relate to many `Project` records through `UserProject`.
- One `Project` can relate to many `User` records through `UserProject`.
- One `GitHubContributionGrid` contains many `GitHubContributionDay` items.
- `WeatherSnapshot` and `GitHubContributionGrid` are fetched view models and are not persisted in SQLite.

## State Transitions

- `signed-out` -> `signed-in`: occurs after a successful Google OAuth2 callback and user upsert.
- `signed-in` -> `liked(project)`: occurs when a `UserProject` row is inserted.
- `liked(project)` -> `unliked(project)`: occurs when the matching `UserProject` row is deleted.
- `weather unavailable` -> `weather available`: occurs when Open-Meteo returns a valid current-weather payload.
- `contributions unavailable` -> `contributions available`: occurs when the GitHub API returns a full contribution calendar payload.

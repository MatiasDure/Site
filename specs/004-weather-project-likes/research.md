# Research: Enschede Weather, GitHub Contributions, And Project Likes

## Decision 1: Fetch Enschede weather from Open-Meteo using server-side cached requests

- Decision: Use Open-Meteo's forecast endpoint with fixed Enschede coordinates and request current weather fields only, then map the response into a small server-side weather view model.
- Rationale: Open-Meteo does not require API keys for the requested use case, aligns with the existing pattern of server-side `fetch` helpers, and keeps weather rendering lightweight and cacheable.
- Alternatives considered:
  - Use a browser-side weather widget: rejected because it adds client JavaScript and breaks the repo's server-component-first approach.
  - Use a different weather provider: rejected because the user explicitly selected Open-Meteo.

## Decision 2: Use the GitHub GraphQL contributions calendar with `@mariohamann/activity-graph`

- Decision: Fetch the owner's past-year contribution data from the GitHub GraphQL API using `contributionsCollection` and `contributionCalendar`, then serialize the result for `@mariohamann/activity-graph` by passing the date range plus an `activity-data` comma-separated list where each ISO date is repeated according to that day's contribution count.
- Rationale: The chosen package already provides an accessible GitHub-style contribution graph, supports light DOM styling and CSS variables, and avoids building a custom grid from scratch. GitHub's contribution calendar data maps naturally into the package's date-based attribute contract while preserving zero-activity days through the explicit range start and end.
- Alternatives considered:
  - Build a custom contribution grid from the normalized GraphQL day model: rejected because the selected package already solves the rendering and accessibility problem with less bespoke UI code.
  - Use GitHub REST commits endpoints across every repository: rejected because it would require repository enumeration, complex aggregation, and extra rate-limit pressure for a view GitHub already models directly.
  - Scrape the public profile HTML: rejected because it is fragile and not a real API contract.

## Decision 3: Keep Markdown files as the canonical project source and synchronize them into SQLite

- Decision: Treat `projects/<domain>/<slug>.md` files as the source of truth for project content, parse them through the existing `app/lib/projects.ts` pipeline, and upsert normalized `Project` rows into SQLite for relational features such as likes.
- Rationale: The repository already stores portfolio content in Markdown with YAML frontmatter and HTML body generation. Reusing that pipeline avoids duplicate editorial workflows while still enabling relational persistence for likes.
- Alternatives considered:
  - Move all project content fully into SQLite: rejected because it would duplicate and then obsolete the existing Markdown content system.
  - Keep projects only in Markdown and store likes by slug strings: rejected because the user requested a relational `Project` entity and stable GUID-based joins.

## Decision 4: Generate stable project GUIDs from route identity and persist route metadata alongside requested fields

- Decision: Derive a deterministic GUID from each project's domain and slug so every Markdown-backed project has a stable database identity, and persist route metadata needed to connect cards, detail pages, and likes back to the Markdown source.
- Rationale: The requested `Project` properties do not include route identity, but the application routes are defined by domain and slug. Deterministic GUID generation prevents orphaned likes and avoids manual ID maintenance in Markdown frontmatter.
- Alternatives considered:
  - Generate random GUIDs during sync: rejected because the same project could receive a different ID across environments or rebuilds unless extra bookkeeping is added.
  - Use title as the relational key: rejected because titles are editable presentation fields, not stable identifiers.

## Decision 5: Use Google OAuth2 via Auth.js with application-managed user persistence

- Decision: Implement Google sign-in through Auth.js and use application callbacks to upsert the requested `User` record in SQLite, while avoiding username/password flows entirely.
- Rationale: Google OAuth2 is the requested authentication method, and Auth.js reduces the risk of implementing OAuth session flows manually. Application-managed persistence keeps the domain model centered on the requested `User` and `UserProjects` tables.
- Alternatives considered:
  - Build OAuth callbacks and session cookies manually: rejected because it adds unnecessary security risk for a standard OAuth flow.
  - Add email/password auth: rejected because the user explicitly asked to avoid usernames and passwords.

## Decision 6: Store likes in a join table with one active like per user-project pair

- Decision: Model likes with a `UserProjects` join table keyed by `UserId` and `ProjectId`, enforce uniqueness on that pair, and derive like totals from aggregation rather than storing counters on the `Project` row.
- Rationale: This exactly matches the requested many-to-many model, keeps the source of truth normalized, and prevents duplicate likes without extra reconciliation logic.
- Alternatives considered:
  - Store a mutable like counter on each project: rejected because counters drift without a canonical per-user relationship table.
  - Store likes in browser storage: rejected because the spec requires account-based liking.

## Decision 7: Use a narrow client wrapper to register the `activity-graph` custom element

- Decision: Keep GitHub contribution fetching and normalization on the server, then hand the serialized attribute values to a small client component that imports `@mariohamann/activity-graph` and renders the `activity-graph` custom element.
- Rationale: In Next.js, the package is easiest to integrate as a web component registration side effect in a small client boundary. This keeps the bulk of the feature in server components while limiting client JavaScript to graph-element registration and attribute delivery.
- Alternatives considered:
  - Attempt package-specific SSR integration paths intended for Enhance SSR: rejected because the project is a Next.js app, not an Enhance SSR application.
  - Reimplement the graph as plain React markup to stay server-only: rejected because it discards the selected package and recreates solved rendering concerns.

## Decision 8: Treat the feature as a runtime-capable exception to the current constitution

- Decision: Plan the feature as a Next.js application that still statically renders public content where possible, but requires runtime support for OAuth callbacks, authenticated mutations, and SQLite reads/writes.
- Rationale: The user explicitly requested Google OAuth2 and SQLite-backed likes. Those capabilities cannot be delivered on a purely static CDN deployment with no backend runtime.
- Alternatives considered:
  - Force the feature into the current static-only constitution: rejected because it cannot satisfy authenticated persistent likes.
  - Replace SQLite with an external managed database to fit serverless hosts better: rejected because the user explicitly selected SQLite.

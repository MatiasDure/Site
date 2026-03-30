# Personal Website

A personal portfolio site built with Next.js 16 (App Router), TypeScript, and TailwindCSS 4. It displays projects across multiple domains, live Spotify listening activity, favorite anime, Enschede weather, GitHub contribution history, and Google-authenticated project likes.

## Features

- **Project portfolio** — Markdown-driven project pages organized by domain (web, app, game, embedded). Rendered with a `remark` → `remark-rehype` → `rehype-sanitize` → `rehype-stringify` pipeline.
- **Spotify integration** — Currently playing or most recently played track via the Spotify Web API, including played-time and duration metadata.
- **Anime favorites** — Favorite anime fetched from the Jikan API (MyAnimeList), displayed as clickable cards.
- **Weather snapshot** — Current Enschede weather from Open-Meteo with a clear unavailable state when upstream data cannot be used.
- **GitHub activity graph** — Past-year contribution history rendered through `@mariohamann/activity-graph` with empty days preserved.
- **Authenticated project likes** — Google sign-in backed by SQLite so visitors can like projects from cards and detail pages.
- **Static generation** — Domain and project-slug pages use `generateStaticParams`; metadata generated per-page with `generateMetadata`.
- **Optimized images** — `next/image` with remote patterns for Spotify (`i.scdn.co`) and MAL (`cdn.myanimelist.net`) CDNs.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router |
| Language | TypeScript 5 (strict) |
| Styling | TailwindCSS 4 + `@tailwindcss/typography` |
| Markdown | gray-matter, remark, remark-rehype, rehype-sanitize, rehype-stringify |
| APIs | Spotify Web API, Jikan API v4, Open-Meteo, GitHub GraphQL |
| Auth | Google OAuth via Auth.js |
| Persistence | SQLite via `better-sqlite3` |

## Getting Started

### Prerequisites

Add env variables to `.env.development` and fill in your credentials:

| Variable | Description |
|---|---|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | OAuth2 refresh token with `user-read-currently-playing` and `user-read-recently-played` scopes |
| `MAL_USERNAME` | MyAnimeList username (used by Jikan API) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | Random secret used to sign auth sessions |
| `GITHUB_USERNAME` | GitHub username whose contribution graph is rendered |
| `GITHUB_TOKEN` | GitHub token with access to contribution calendar data |
| `DATABASE_PATH` | Writable filesystem path to the local SQLite database |

Copy `.env.example` to `.env.development` and fill in the values before running the app.

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build

```bash
npm run build
```

## Project Structure

```
app/
  components/     # UI components (NavBar, HeroSection, ProjectCard, etc.)
  lib/            # Data-fetching helpers (projects, spotify, myanimelist, weather, GitHub, auth, likes)
  types/          # Shared TypeScript interfaces and runtime view models
  projects/
    [domain]/           # All projects for a domain
    [domain]/[slug]/    # Individual project detail page
  api/auth/       # Auth.js route handlers
  page.tsx        # Home page (ISR, revalidate=600)
  layout.tsx      # Root layout with NavBar and Footer
db/               # SQLite client and schema helpers
projects/         # Markdown project files organized by domain/
public/
  images/projects/  # Project cover images
```

## Runtime Notes

- Public portfolio content remains cacheable, but authentication callbacks, like toggles, and SQLite persistence require a Node-capable runtime.
- The SQLite database path configured through `DATABASE_PATH` must point to a writable location in development and production.
- The GitHub contribution graph is rendered through a client-side custom element registration wrapper around `@mariohamann/activity-graph`.

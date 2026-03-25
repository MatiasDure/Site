# Personal Website

A personal portfolio site built with Next.js 16 (App Router), TypeScript, and TailwindCSS 4. Displays projects across multiple domains, live Spotify listening activity, and favorite anime.

## Features

- **Project portfolio** — Markdown-driven project pages organized by domain (web, app, game, embedded). Rendered with a `remark` → `remark-rehype` → `rehype-sanitize` → `rehype-stringify` pipeline.
- **Spotify integration** — Currently playing or most recently played track via the Spotify Web API, including played-time and duration metadata.
- **Anime favorites** — Favorite anime fetched from the Jikan API (MyAnimeList), displayed as clickable cards.
- **Static generation** — Domain and project-slug pages use `generateStaticParams`; metadata generated per-page with `generateMetadata`.
- **Optimized images** — `next/image` with remote patterns for Spotify (`i.scdn.co`) and MAL (`cdn.myanimelist.net`) CDNs.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router |
| Language | TypeScript 5 (strict) |
| Styling | TailwindCSS 4 + `@tailwindcss/typography` |
| Markdown | gray-matter, remark, remark-rehype, rehype-sanitize, rehype-stringify |
| APIs | Spotify Web API, Jikan API v4 |

## Getting Started

### Prerequisites

Add env variables to `.env.development` and fill in your credentials:

| Variable | Description |
|---|---|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | OAuth2 refresh token with `user-read-currently-playing` and `user-read-recently-played` scopes |
| `MAL_USERNAME` | MyAnimeList username (used by Jikan API) |

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
  lib/            # Data-fetching helpers (projects, spotify, myanimelist)
  types/          # Shared TypeScript interfaces
  projects/
    [domain]/           # All projects for a domain
    [domain]/[slug]/    # Individual project detail page
  page.tsx        # Home page (ISR, revalidate=600)
  layout.tsx      # Root layout with NavBar and Footer
projects/         # Markdown project files organized by domain/
public/
  images/projects/  # Project cover images
```

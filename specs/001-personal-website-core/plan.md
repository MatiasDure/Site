# Implementation Plan: Personal Website Core

**Branch**: `001-personal-website-core` | **Date**: 2026-03-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-personal-website-core/spec.md`

## Summary

Build a modern, fully responsive personal website with a landing page (bio, 4 domain sections
showing 3 featured projects each, social links, live activity), an all-projects grid page per
domain, and a project detail page. Project content is authored as Markdown files. Spotify
"most recently played" and MyAnimeList favorite anime are fetched via their respective APIs
using Next.js ISR (revalidate = 600 s) so the activity section stays fresh without a full
redeploy.

## Technical Context

**Language/Version**: TypeScript 5, strict mode
**Framework**: Next.js 16 — App Router, React Server Components
**Styling**: TailwindCSS 4 (utility-first, via `postcss.config.mjs`)
**Content**: Markdown files with YAML frontmatter under `projects/<domain>/`
**Markdown parsing**: `gray-matter` (frontmatter) + `remark` + `remark-html` (body → HTML)
**External APIs**: Spotify Web API (recently-played endpoint) + Jikan API v4 (MAL favorites, no auth required)
**Storage**: File-system only (no database)
**Testing**: No test framework mandated; manual Lighthouse audit for acceptance criteria
**Target Platform**: Vercel (ISR support) or any Node-capable CDN
**Constraints**: No per-request server code on project pages; ISR only on landing page for activity freshness
**Scale/Scope**: ~4 domains × ~5–10 projects each; single owner; no auth, no CMS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Status |
|------|-----------|--------|
| All project pages are statically pre-rendered via `generateStaticParams`; landing page uses ISR (`revalidate = 600`) not per-request SSR | I. Static-First | ✅ |
| No `any` types; `strict: true` remains enabled in `tsconfig.json` | II. TypeScript Strict Mode | ✅ |
| All styling uses TailwindCSS utility classes; no new CSS files outside `app/globals.css` | III. TailwindCSS for All Styling | ✅ |
| No `"use client"` directives — activity, projects, and layout are all RSC | IV. Server Components by Default | ✅ |
| Semantic HTML throughout; images via `<Image>`; interactive elements keyboard-accessible | V. Accessibility & Performance | ✅ |
| 4 new packages added (`gray-matter`, `remark`, `remark-html`), each justified below | Technology Stack | ✅ |
| Single-responsibility components; descriptive names; no commented-out code | VI. Readability, Clarity & Architecture | ✅ |
| No premature abstractions; only ProjectCard reused across multiple surfaces | VI. Readability, Clarity & Architecture | ✅ |

## Complexity Tracking

| Addition | Why Needed | Simpler Alternative Rejected Because |
|----------|------------|--------------------------------------|
| `gray-matter` | Parse YAML frontmatter from `.md` files | No built-in Node/Next API for frontmatter parsing |
| `remark` + `remark-html` | Convert Markdown body to HTML for detail page | `marked` is less maintained; manual string conversion is error-prone
| ISR (`revalidate = 600`) on landing page | Spotify/anime data must refresh without redeploy | `output: 'export'` would freeze activity data at build time |

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-website-core/
├── plan.md              ← this file
├── spec.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
projects/                        ← Markdown content (NOT inside app/)
├── web/
│   └── *.md                     ← frontmatter: title, description, featured, tags, demo, repo, coverImage
├── app/
│   └── *.md
├── game/
│   └── *.md
└── embedded/
    └── *.md

app/
├── globals.css                  ← base layer only (already configured, no changes needed)
├── layout.tsx                   ← RootLayout: renders <NavBar />, {children}, <Footer />
├── page.tsx                     ← Landing page; export const revalidate = 600
│
├── components/
│   ├── NavBar.tsx               ← Logo + domain navigation links
│   ├── Footer.tsx               ← Copyright + social links (LinkedIn, GitHub)
│   ├── HeroSection.tsx          ← Name, tagline, brief bio
│   ├── DomainSection.tsx        ← Section heading + 3 × <ProjectCard /> + "View All" link
│   ├── ProjectCard.tsx          ← Cover image (next/image), title, short description
│   ├── SocialLinks.tsx          ← LinkedIn + GitHub icon links (used in hero and footer)
│   ├── ActivitySection.tsx      ← Wraps <SpotifyCard /> and up to 5 <AnimeCard />; shows fallback on null/empty data
│   ├── SpotifyCard.tsx          ← Track name, artist, album art (next/image)
│   ├── AnimeCard.tsx            ← Anime cover art + title; entire card is an <a> opening MAL URL in new tab
│   └── index.ts                 ← Barrel re-exports for app/components/
│
├── lib/
│   ├── projects.ts              ← getAllProjects(domain?), getProject(domain, slug), getFeaturedProjects(domain)
│   ├── spotify.ts               ← getRecentlyPlayed(): exchanges refresh token, hits /me/player/recently-played
│   ├── myanimelist.ts           ← getFavoriteAnime(): Jikan GET /users/{username}/favorites (public, no auth)
│   └── index.ts                 ← Barrel re-exports for app/lib/
│
├── types/
│   ├── project.ts               ← Domain (union type), Project (frontmatter + slug + htmlBody)
│   ├── activity.ts              ← SpotifyTrack, AnimeEntry
│   └── index.ts                 ← Barrel re-exports for app/types/
│
└── projects/
    └── [domain]/
        ├── page.tsx             ← All-projects grid; generateStaticParams × 4 domains
        └── [slug]/
            └── page.tsx         ← Project detail; generateStaticParams = all (domain, slug) pairs

public/
└── images/
    └── projects/                ← Cover images (referenced from frontmatter coverImage field)

.env.example                     ← SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, MAL_USERNAME
```

**Structure Decision**: Next.js App Router web application. Single project — no separate backend.
Content lives in `projects/` at the repository root (not inside `app/`) to keep source code and
authored content clearly separated. All UI lives under `app/` following App Router conventions.

---

## Implementation Phases

### Phase 0 — Foundation *(blocks all other phases)*

**Purpose**: Types, data layer, packages. Must complete before any UI work.

- [ ] P0-1 Install packages: `gray-matter`, `remark`, `remark-html`, `@types/remark-html`
- [ ] P0-2 Create `app/types/project.ts` — `Domain` union type (`'web' | 'app' | 'game' | 'embedded'`), `Project` interface (slug, title, description, coverImage, tags, featured, demo?, repo?, htmlBody)
- [ ] P0-3 Create `app/types/activity.ts` — `SpotifyTrack` (name, artist, albumArt) and `AnimeEntry` (title, url?) interfaces
- [ ] P0-4 Create `app/types/index.ts` barrel
- [ ] P0-5 Create `app/lib/projects.ts` — `getAllProjects(domain?: Domain): Promise<Project[]>` reads all `.md` files from `projects/<domain>/`, parses frontmatter with gray-matter, converts body to HTML with remark + remark-html; `getProject(domain, slug)` returns single project with sanitized htmlBody; `getFeaturedProjects(domain)` filters `featured: true` capped at 3
- [ ] P0-6 Create `app/lib/spotify.ts` — `getRecentlyPlayed(): Promise<SpotifyTrack | null>` — POST to Spotify token endpoint with `SPOTIFY_REFRESH_TOKEN`, then GET `/v1/me/player/recently-played?limit=1`; returns null on any error
- [ ] P0-7 Create `app/lib/myanimelist.ts` — `getFavoriteAnime(): Promise<AnimeEntry[]>` — GET `https://api.jikan.moe/v4/users/{MAL_USERNAME}/favorites`; returns empty array on error
- [ ] P0-8 Create `.env.example` with `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `MAL_USERNAME`
- [ ] P0-9 Create `app/lib/index.ts` barrel
- [ ] P0-10 Seed at least 1 sample `.md` file per domain under `projects/` so pages can render during development

**Checkpoint**: `app/lib/projects.ts` can be imported and returns typed data. TypeScript compiles with zero errors.

---

### Phase 1 — Landing Page *(P1 MVP; depends on Phase 0)*

**Purpose**: Complete User Story 1 — bio, domain sections, social links.

- [ ] P1-1 Create `app/components/NavBar.tsx` — site name/logo + links to each domain's all-projects page (`/projects/web`, `/projects/app`, etc.)
- [ ] P1-2 Create `app/components/Footer.tsx` — copyright text + `<SocialLinks />`
- [ ] P1-3 Create `app/components/SocialLinks.tsx` — LinkedIn and GitHub `<a>` links with accessible labels
- [ ] P1-4 Create `app/components/HeroSection.tsx` — name, tagline, bio; uses `<SocialLinks />`
- [ ] P1-5 Create `app/components/ProjectCard.tsx` — cover image via `<Image>`, title, short description; entire card is a `<Link>` to the detail page
- [ ] P1-6 Create `app/components/DomainSection.tsx` — receives `domain` and `featuredProjects`; renders section heading, 3 × `<ProjectCard />`, "View All" `<Link>`
- [ ] P1-7 Rewrite `app/layout.tsx` — import `<NavBar />` and `<Footer />`, set page `<Metadata>` with site title and description
- [ ] P1-8 Rewrite `app/page.tsx` — `export const revalidate = 600`; fetches featured projects for all 4 domains; renders `<HeroSection />` + 4 × `<DomainSection />`
- [ ] P1-9 Create `app/components/index.ts` barrel
- [ ] P1-10 Verify mobile responsiveness: grid collapses to 1 col on sm, 2 on md, 3 on lg

**Checkpoint**: `npm run dev` shows full landing page with bio, 4 domain sections with 3 cards each, social links, and working nav.

---

### Phase 2 — All-Projects Grid Page *(P2; depends on Phase 1 for shared components)*

**Purpose**: Complete User Story 2 — browsable full project list per domain. *Can run parallel with Phase 3.*

- [ ] P2-1 Create `app/projects/[domain]/page.tsx` — `generateStaticParams` returns `[{domain:'web'},{domain:'app'},{domain:'game'},{domain:'embedded'}]`; fetches all projects for the domain; renders page heading and responsive card grid
- [ ] P2-2 Add empty-state when domain has 0 projects
- [ ] P2-3 Add `<Link>` back to landing page (`/`) in page heading area

**Checkpoint**: `/projects/web` (and all other domains) renders a full project grid; `npm run build` succeeds.

---

### Phase 3 — Project Detail Page *(P3; depends on Phase 0; can run parallel with Phase 2)*

**Purpose**: Complete User Story 3 — full project information.

- [ ] P3-1 Create `app/projects/[domain]/[slug]/page.tsx` — `generateStaticParams` enumerates all (domain, slug) pairs from `getAllProjects()`; renders project name, `htmlBody` via `dangerouslySetInnerHTML` (safe: authored content only), tags, demo/repo links, cover image
- [ ] P3-2 Add `<Link>` back to the domain all-projects page
- [ ] P3-3 Add `generateMetadata` to set `<title>` and `<meta description>` per project

**Checkpoint**: Clicking any project card opens the detail page with full content; browser back returns to previous page.

---

### Phase 4 — Activity Section *(P4; depends on Phase 1; can run parallel with Phases 2 & 3)*

**Purpose**: Complete User Story 4 — Spotify + anime activity.

- [ ] P4-1 Create `app/components/SpotifyCard.tsx` — album art via `<Image>` with fixed dimensions, track name, artist
- [ ] P4-2 Create `app/components/AnimeCard.tsx` — accept `entry: AnimeEntry`; render as `<a href={entry.url} target="_blank" rel="noopener noreferrer">` wrapping a card with cover `<Image>` from `entry.imageUrl` and anime title; include accessible `aria-label` combining title and "— view on MyAnimeList"
- [ ] P4-3 Create `app/components/ActivitySection.tsx` — calls `getRecentlyPlayed()` and `getFavoriteAnime()` in RSC; renders `<SpotifyCard />` and a grid of up to 5 `<AnimeCard />` components, or fallback text when data is null/empty
- [ ] P4-4 Add `<ActivitySection />` to `app/page.tsx`
- [ ] P4-5 Verify fallback renders without errors when env vars are absent (local dev without credentials)

**Checkpoint**: Activity section visible on landing page; fallback shown when API is unavailable; no console errors.

---

## Verification

1. **Build gate**: `npm run build` exits 0 with zero TypeScript errors and zero ESLint errors
2. **Dev smoke test**: `npm run dev` — visit `/`, `/projects/web`, `/projects/web/<any-slug>` — all pages render correctly
3. **Responsive**: Resize browser to 375 px — no horizontal overflow, cards reflow to single column
4. **Dark mode**: Toggle OS dark mode — site switches theme correctly
5. **Lighthouse** (Chrome DevTools): Performance ≥ 90 desktop, Accessibility ≥ 95
6. **ISR**: Confirm `revalidate = 600` is set only on `app/page.tsx`; project pages have no `revalidate` (fully static)
7. **Activity fallback**: Remove `.env` values, run `npm run build` — activity section renders fallback text, build succeeds
8. **Keyboard navigation**: Tab through landing page — all interactive elements (nav links, project cards, social links) are reachable and labeled

## Decisions

- **ISR over `output: 'export'`** — Activity data needs periodic refresh; fully static build would freeze it at deploy time
- **Jikan API for MAL** — Public, no authentication required; fetches `/users/{username}/favorites` which matches the "favorite anime" requirement
- **Spotify refresh token flow** — Tokens stored in env vars; exchanged server-side in ISR cycle; never exposed to the client
- **Favorite anime shown, not recently watched** — User confirmed favorites are preferred over watch history
- **No test framework added** — Manual Lighthouse audit satisfies acceptance criteria; no test framework justified for a personal static site at this scope

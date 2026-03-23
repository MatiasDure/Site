# Tasks: Personal Website Core

**Input**: Design documents from `/specs/001-personal-website-core/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Tests**: Not requested — no test tasks included.
**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths are included in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install packages, configure environment, seed content directories.

- [X] T001 Install packages `gray-matter`, `remark`, `remark-rehype`, `rehype-sanitize`, `rehype-stringify` into `package.json`
- [X] T002 Create `.env.example` at repo root with keys `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `MAL_USERNAME`
- [X] T003 [P] Create `projects/web/` directory with one sample project Markdown file including YAML frontmatter fields: `title`, `description`, `featured`, `tags`, `coverImage`, `demo`, `repo`
- [X] T004 [P] Create `projects/app/` directory with one sample project Markdown file (same frontmatter schema as T003)
- [X] T005 [P] Create `projects/game/` directory with one sample project Markdown file (same frontmatter schema as T003)
- [X] T006 [P] Create `projects/embedded/` directory with one sample project Markdown file (same frontmatter schema as T003)
- [X] T007 Create `public/images/projects/` directory and add a placeholder cover image for use during development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript types and the full data/API lib layer. ALL user story phases depend on this phase.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Create `app/types/project.ts` — export `Domain` as `'web' | 'app' | 'game' | 'embedded'` union type and `Project` interface with fields: `slug`, `title`, `description`, `coverImage`, `tags`, `featured`, `htmlBody`, `repo`
- [X] T009 [P] Create `app/types/activity.ts` — export `SpotifyTrack` interface (`name`, `artist`, `albumArt`) and `AnimeEntry` interface (`title`, `url`, `imageUrl`)
- [X] T010 Create `app/types/index.ts` — barrel re-exporting everything from `project.ts` and `activity.ts`
- [X] T011 Create `app/lib/projects.ts` — implement `getAllProjects(domain?: Domain): Promise<Project[]>` reading all `.md` files from `projects/<domain>/` using `fs/promises`, parsing frontmatter with `gray-matter`, converting body to sanitized HTML with `remark` → `remark-rehype` → `rehype-sanitize` → `rehype-stringify` pipeline, assigning result to `htmlBody`; implement `getProject(domain: Domain, slug: string): Promise<Project>` and `getFeaturedProjects(domain: Domain): Promise<Project[]>` filtering `featured: true` capped at 3
- [X] T012 [P] Create `app/lib/spotify.ts` — implement `getRecentlyPlayed(): Promise<SpotifyTrack | null>` that POSTs to `https://accounts.spotify.com/api/token` with `SPOTIFY_REFRESH_TOKEN` to obtain an access token, then GETs `/v1/me/player/recently-played?limit=1`; returns `null` on any network or auth error
- [X] T013 [P] Create `app/lib/myanimelist.ts` — implement `getFavoriteAnime(): Promise<AnimeEntry[]>` that GETs `https://api.jikan.moe/v4/users/${MAL_USERNAME}/favorites` and maps each entry in the `anime` array to `AnimeEntry` (`title` from `title`, `url` from `url`, `imageUrl` from `images.jpg.large_image_url`); returns `[]` on any error
- [X] T014 Create `app/lib/index.ts` — barrel re-exporting everything from `projects.ts`, `spotify.ts`, and `myanimelist.ts`
- [X] T015 Configure `next.config.ts` with `images.remotePatterns` to allow external image domains: Spotify CDN (`i.scdn.co`) and any cover art CDNs used by Jikan (`cdn.myanimelist.net`)

**Checkpoint**: `npx tsc --noEmit` exits 0; `app/lib/projects.ts` resolves sample MD files without error.

---

## Phase 3: User Story 1 — Discover Who I Am (Priority: P1) 🎯 MVP

**Goal**: Full landing page — personal bio, 4 domain sections each showing 3 featured project cards, and LinkedIn/GitHub social links.

**Independent Test**: Navigate to `/`. Verify: bio visible, 4 named domain sections each with 3 project cards, LinkedIn and GitHub links present and pointing to correct URLs. Resize to 375 px — no horizontal overflow.

### Implementation for User Story 1

- [X] T016 [P] [US1] Create `app/components/SocialLinks.tsx` — render LinkedIn and GitHub `<a>` elements with descriptive `aria-label` attributes and TailwindCSS hover styles; accept `className` prop for placement flexibility
- [X] T017 [P] [US1] Create `app/components/ProjectCard.tsx` — render as a Next.js `<Link>` wrapping a `<article>` with cover `<Image>` (via `next/image`), project title, and short description; accept `Project` and `domain` as props for URL construction
- [X] T018 [US1] Create `app/components/NavBar.tsx` — render site name/logo as a `<Link href="/">` and navigation links to `/projects/web`, `/projects/app`, `/projects/game`, `/projects/embedded` using Next.js `<Link>`; use `<nav>` semantic element
- [X] T019 [US1] Create `app/components/HeroSection.tsx` — render owner name in `<h1>`, tagline in `<p>`, bio paragraph, and `<SocialLinks />`; use `<section>` semantic element
- [X] T020 [US1] Create `app/components/Footer.tsx` — render `<footer>` with copyright year text and `<SocialLinks />`
- [X] T021 [US1] Create `app/components/DomainSection.tsx` — accept `domain: Domain` and `featuredProjects: Project[]` props; render `<section>` with domain heading (`<h2>`), responsive grid of up to 3 `<ProjectCard />` components, and a "View All Projects" `<Link href="/projects/[domain]">`
- [X] T022 [US1] Create `app/components/index.ts` — barrel re-exporting `NavBar`, `Footer`, `HeroSection`, `DomainSection`, `ProjectCard`, `SocialLinks`
- [X] T023 [US1] Rewrite `app/layout.tsx` — import `NavBar` and `Footer` from `app/components/`; render `<NavBar />`, `{children}`, `<Footer />` inside `<body>`; update `Metadata` with site title and personal description
- [X] T024 [US1] Rewrite `app/page.tsx` — add `export const revalidate = 600`; call `getFeaturedProjects` for all 4 domains in parallel (`Promise.all`); render `<main>` containing `<HeroSection />` followed by 4 `<DomainSection />` components

**Checkpoint**: `npm run dev` — `/` renders full landing page with bio, 4 domain sections each with 3 cards, social links in hero and footer, working nav links. Cards reflow to 1 col at 375 px.

---

## Phase 4: User Story 2 — Browse All Projects in a Domain (Priority: P2)

**Goal**: Domain-scoped all-projects page showing every project in a responsive grid, with empty-state and back navigation.

**Independent Test**: Click "View All Projects" from any domain section. Verify the URL is `/projects/<domain>` and all projects for that domain are shown in a grid. Verify empty-state appears when domain has zero projects.

### Implementation for User Story 2

- [X] T025 [US2] Create `app/projects/[domain]/page.tsx` — export `generateStaticParams` returning `[{domain:'web'},{domain:'app'},{domain:'game'},{domain:'embedded'}]`; call `getAllProjects(domain)`; render page heading with domain name and a responsive CSS grid of `<ProjectCard />` components
- [X] T026 [US2] Add empty-state branch to `app/projects/[domain]/page.tsx` — when `getAllProjects` returns an empty array, render a clear "No projects yet" message instead of an empty grid
- [X] T027 [US2] Add a `<Link href="/">` back-to-home element to `app/projects/[domain]/page.tsx` in the page heading area

**Checkpoint**: `/projects/web` (and all 3 other domains) renders correct grid; `npm run build` succeeds with zero errors.

---

## Phase 5: User Story 3 — Read Project Details (Priority: P3)

**Goal**: Individual project detail page with full description (rendered Markdown), tags, external links, and back navigation.

**Independent Test**: Click any project card. Verify detail page opens with project name, full body content rendered as HTML, tag list, demo/repo links where available, and a back link.

### Implementation for User Story 3

- [X] T028 [US3] Create `app/projects/[domain]/[slug]/page.tsx` — export `generateStaticParams` enumerating all `(domain, slug)` pairs via `getAllProjects()`; call `getProject(domain, slug)`; render `<article>` with cover `<Image>`, `<h1>` title, tags list, `htmlBody` via `dangerouslySetInnerHTML` (safe: already sanitized by `rehype-sanitize` at read-time), and conditional demo/repo `<a>` links
- [X] T029 [US3] Add `export async function generateMetadata` to `app/projects/[domain]/[slug]/page.tsx` — return `{title: project.title, description: project.description}` for per-page `<title>` and `<meta name="description">` tags
- [X] T030 [US3] Add a `<Link href="/projects/[domain]">` back-to-grid element to `app/projects/[domain]/[slug]/page.tsx`

**Checkpoint**: Clicking any project card navigates to its detail page with full content rendered; browser back button returns to the originating grid page; `npm run build` succeeds.

---

## Phase 6: User Story 4 — See Live Activity (Priority: P4)

**Goal**: Landing page section showing most recently played Spotify track and favorite anime list, with graceful fallback when data is unavailable.

**Independent Test**: Load `/`. Verify activity section renders with Spotify track (name + artist + album art) and up to 5 anime cards each with cover art and title. Click an anime card — verify it opens the correct MyAnimeList URL in a new tab. Remove env vars and rebuild — verify fallback text renders without errors or console exceptions.

### Implementation for User Story 4

- [X] T031 [P] [US4] Create `app/components/SpotifyCard.tsx` — accept `track: SpotifyTrack` prop; render album art via `<Image>` with explicit `width` and `height`, track name, and artist name using semantic markup
- [X] T032 [P] [US4] Create `app/components/AnimeCard.tsx` — accept `entry: AnimeEntry` prop; render as an `<a href={entry.url} target="_blank" rel="noopener noreferrer">` wrapping a card with cover art via `<Image>` (from `entry.imageUrl`) and anime title; include an accessible `aria-label` combining title and "— view on MyAnimeList"
- [X] T033 [US4] Create `app/components/ActivitySection.tsx` — Server Component; call `getRecentlyPlayed()` and `getFavoriteAnime()` in parallel (`Promise.all`); render `<SpotifyCard />` if track is non-null, fallback `<p>` otherwise; render a grid of up to 5 `<AnimeCard />` components if entries is non-empty, fallback `<p>` otherwise; wrap in `<section>` with heading
- [X] T034 [US4] Add `<ActivitySection />` to `app/page.tsx` — insert between `<HeroSection />` and the first `<DomainSection />`; update `app/components/index.ts` barrel to export `SpotifyCard`, `AnimeCard`, and `ActivitySection`

**Checkpoint**: Activity section visible on `/`; Spotify card and anime cards (with cover art and titles) render with real data; clicking an anime card opens the MAL page in a new tab; fallback text shown cleanly when env vars are absent; no console errors in either case.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finish accessibility, dark-mode, and quality gate verification across all user stories.

- [X] T035 [P] Add `dark:` TailwindCSS variants to all components — verify background, text, border, and card colours switch correctly when OS dark mode is toggled; reference existing `@media (prefers-color-scheme: dark)` CSS variables in `app/globals.css`
- [X] T036 [P] Audit all interactive elements across `NavBar.tsx`, `ProjectCard.tsx`, `SocialLinks.tsx`, `DomainSection.tsx` — confirm each is keyboard-focusable, has visible focus ring via TailwindCSS `focus-visible:` ring utilities, and carries an accessible label
- [X] T037 Run `npm run lint` and fix all ESLint errors; run `npx tsc --noEmit` and fix all TypeScript errors
- [X] T038 Run `npm run build` and verify it exits 0 with zero errors; confirm `revalidate = 600` appears only in `app/page.tsx` and no other page file

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1 — P1 MVP)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2 (and reuses `<ProjectCard />` from US1 — implement after Phase 3)
- **Phase 5 (US3)**: Depends on Phase 2 (can run in parallel with Phase 4)
- **Phase 6 (US4)**: Depends on Phase 3 (adds to `app/page.tsx`) — can run in parallel with Phases 4 & 5
- **Phase 7 (Polish)**: Depends on all user story phases

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories — pure MVP
- **US2 (P2)**: Reuses `<ProjectCard />` from US1; implement after T017 is done
- **US3 (P3)**: No dependency on US1/US2 beyond shared lib layer — fully parallel with US2
- **US4 (P4)**: Adds a component to `app/page.tsx` — implement after T024

### Parallel Opportunities

- T003, T004, T005, T006 — all seed content tasks, fully parallel
- T009, T012, T013 — independent type/lib files, fully parallel
- T016, T017 — leaf components with no inter-component dependencies, fully parallel
- T025 (US2) and T028 (US3) — different route segments, fully parallel
- T031, T032 — leaf activity components (`SpotifyCard`, `AnimeCard`), fully parallel
- T035, T036 — polish passes on different concerns, fully parallel

---

## Parallel Example: User Story 1

```
Start after Phase 2 completes:

Stream A (leaf components):   T016 → T017 → done
Stream B (nav/layout):        T018 → T019 → T020 → T021 → T023 → done

Join → T022 (barrel) → T024 (page.tsx wires everything together)
```

## Parallel Example: User Stories 2 & 3

```
Start after Phase 3 completes:

Stream A (US2): T025 → T026 → T027
Stream B (US3): T028 → T029 → T030

Both streams are independent — different app/ route segments.
```

## Parallel Example: User Story 4

```
Start after Phase 3 completes:

Stream A: T031 (SpotifyCard)
Stream B: T032 (AnimeCard)

Join → T033 (ActivitySection) → T034 (wire into page.tsx)
```

---

## Implementation Strategy

**MVP scope (Phase 1 + Phase 2 + Phase 3 only)**: A complete, deployable personal website with bio, domain sections, featured project cards, social links, and full navigation. Delivers User Story 1 end-to-end.

**Increment 2**: Add Phases 4 & 5 in parallel — full domain grids and project detail pages. No layout changes needed.

**Increment 3**: Add Phase 6 — activity section wired into the already-working landing page.

**Final**: Phase 7 polish pass, then Lighthouse audit and `npm run build` gate.

---

## Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|------------|
| Phase 1: Setup | T001–T007 (7) | — |
| Phase 2: Foundational | T008–T015 (8) | — |
| Phase 3: Landing Page | T016–T024 (9) | US1 (P1) |
| Phase 4: All-Projects Grid | T025–T027 (3) | US2 (P2) |
| Phase 5: Project Detail | T028–T030 (3) | US3 (P3) |
| Phase 6: Activity Section | T031–T034 (4) | US4 (P4) |
| Phase 7: Polish | T035–T038 (4) | — |
| **Total** | **38 tasks** | |

**Parallel opportunities identified**: 7 groups across phases (see parallel examples above).

**Suggested MVP**: Complete Phases 1–3 (24 tasks) for a fully shippable personal website without live activity. Phases 4–6 can be added incrementally.

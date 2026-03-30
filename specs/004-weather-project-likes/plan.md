# Implementation Plan: Enschede Weather, GitHub Contributions, And Project Likes

**Branch**: `004-weather-project-likes` | **Date**: 2026-03-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-weather-project-likes/spec.md`

**Note**: This plan follows the requested stack choices: Open-Meteo for weather, GitHub API for contribution history, `@mariohamann/activity-graph` for the contribution visualization, Google OAuth2 for authentication, and SQLite for persisted users, projects, and likes. The amended constitution now permits server-only auth, persistence, and authenticated mutations when they are justified and isolated from otherwise cacheable public routes.

## Summary

Add three integrated capabilities to the existing portfolio: an Enschede weather card sourced from Open-Meteo, a past-year GitHub contribution graph powered by GitHub's contributions calendar data and rendered through `@mariohamann/activity-graph`, and Google-only authentication with SQLite-backed project likes available from both project cards and project detail pages. Keep Markdown files under `projects/<domain>/<slug>.md` as the canonical project content source, derive stable project identities from that file structure, persist normalized project records into SQLite for many-to-many likes, and expose like state through server-side session-aware helpers shared by the home page and project detail routes.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 App Router  
**Primary Dependencies**: `next`, `react`, `react-dom`, existing Markdown toolchain (`gray-matter`, `remark`, `remark-rehype`, `rehype-sanitize`, `rehype-stringify`), Open-Meteo API via native `fetch`, GitHub GraphQL API via native `fetch`, `@mariohamann/activity-graph`, Google OAuth2 via Auth.js, SQLite via a Node-compatible SQLite driver  
**Storage**: Local Markdown files under `projects/**` as the content source of truth, plus a SQLite database for `User`, `Project`, and `UserProjects` persistence  
**Testing**: `npm run lint`, `npm run build`, manual verification for weather rendering, activity-graph rendering, theme compatibility, Google sign-in/sign-out, project sync, and like/unlike flows from cards and detail pages  
**Target Platform**: Next.js web application for modern browsers deployed on a Node-capable host with durable SQLite file access  
**Project Type**: Web application with static content plus runtime authentication and persistence  
**Performance Goals**: Preserve fast initial rendering for public pages, keep weather and GitHub activity cacheable, limit client-side graph JavaScript to the minimum needed to register the `activity-graph` custom element, keep like toggles responsive enough to reflect state within one interaction cycle, and avoid reparsing the full project corpus on every request  
**Constraints**: Must use Open-Meteo for weather, GitHub API for past-year contribution data, `@mariohamann/activity-graph` for the graph UI, Google OAuth2 only for sign-in, SQLite for persistence, Markdown project files remain the canonical content source, project cards and detail pages both support likes, and the contribution graph must preserve empty days  
**Scale/Scope**: Four project domains, all Markdown project files under `projects/**`, one home-page weather surface, one home-page GitHub contribution graph, one small client wrapper for the graph web component, authenticated likes on project cards and project pages, one many-to-many join table, and one Google-backed user identity per signed-in visitor

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Status |
|------|-----------|--------|
| Public and cacheable content remains pre-renderable by default; runtime logic is isolated to authenticated or persistence-dependent flows | I. Static-First Delivery | PASS |
| No `any` types; `strict: true` remains enabled in tsconfig.json | II. TypeScript Strict Mode | PASS |
| All styling uses TailwindCSS utility classes; no new CSS files outside globals.css | III. TailwindCSS for All Styling | PASS |
| `"use client"` used only where browser APIs, custom-element registration, optimistic UI, or event handlers are strictly required | IV. Server Components by Default | PASS |
| Semantic HTML used; images go via `<Image>`; interactive elements are keyboard-accessible | V. Accessibility & Performance | PASS |
| New packages remain minimal and each addition is justified by a concrete feature need | Technology Stack | PASS |
| Authentication, database access, and authenticated mutations are server-only and justified by explicit feature requirements | VII. Server-Only Authenticated Features | PASS |
| Names are descriptive; components have a single responsibility; no commented-out code | VI. Readability, Clarity & Architecture | PASS |
| Magic values are extracted into descriptive constants files instead of floating in components | VI. Readability, Clarity & Architecture | PASS |
| No premature abstractions; new abstractions justified by concrete reuse across weather, GitHub, auth, and likes flows | VI. Readability, Clarity & Architecture | PASS |
| If multi-agent task distribution is requested, `specs/004-weather-project-likes/task-distribution.md` exists and dispatcher/worker workflow docs will be followed | Multi-Agent Task Distribution | PASS |

Pre-design review: PASS. Public portfolio content stays cacheable by default, while OAuth callbacks, SQLite persistence, and authenticated like mutations are isolated to justified server-only boundaries.

Post-design review: PASS. The Phase 1 design keeps public content static-first where possible, limits the GitHub graph to a narrow custom-element client boundary, and keeps auth, persistence, and mutations inside explicit server-only infrastructure allowed by the amended constitution.

## Project Structure

### Documentation (this feature)

```text
specs/004-weather-project-likes/
├── task-distribution.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── portfolio-runtime-integrations.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── ActivitySection.tsx
│   ├── DomainSection.tsx
│   ├── GitHubActivityGraph.tsx          # new server wrapper
│   ├── GitHubActivityGraphClient.tsx    # new custom-element registration wrapper
│   ├── ProjectCard.tsx
│   ├── ProjectLikeButton.tsx            # new
│   ├── WeatherCard.tsx                  # new
│   └── auth/
│       └── GoogleSignInButton.tsx       # new
├── lib/
│   ├── github.ts                        # new
│   ├── likes.ts                         # new
│   ├── open-meteo.ts                    # new
│   ├── project-sync.ts                  # new
│   ├── projects.ts
│   └── session.ts                       # new
├── api/
│   └── auth/
│       └── [...nextauth]/route.ts       # new
├── projects/
│   └── [domain]/[slug]/page.tsx
├── types/
│   ├── github.ts                        # new
│   ├── project.ts
│   ├── user.ts                          # new
│   └── weather.ts                       # new
└── page.tsx

db/
├── client.ts                            # new
├── schema.ts                            # new
└── migrations/                          # new

projects/
├── app/*.md
├── embedded/*.md
├── game/*.md
└── web/*.md
```

**Structure Decision**: Extend the existing App Router codebase instead of splitting frontend and backend. Keep public content rendering and data fetching in server components and server-side helpers, add a narrow client wrapper solely to register and configure `@mariohamann/activity-graph`, isolate SQLite access under a small `db/` layer, retain `projects/**` Markdown files as canonical content, and add only the minimum runtime routes required for Google OAuth2 callbacks and authenticated like mutations.

## Complexity Tracking

No constitution violations or justified complexity exceptions are required for this plan after the
2.0.0 constitution amendment that permits server-only auth, persistence, and authenticated
mutations.
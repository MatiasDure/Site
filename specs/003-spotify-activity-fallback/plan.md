# Implementation Plan: Spotify Activity Fallback And Playback Time

**Branch**: `003-spotify-activity-fallback` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-spotify-activity-fallback/spec.md`

**Note**: This plan assumes the feature continues to use the Spotify Web API directly from the existing server-side helper and covers current-vs-recent playback selection plus visitor-facing played-time and duration metadata on the Spotify card.

## Summary

Update the landing-page Spotify activity so it resolves one display item from Spotify in priority order: currently playing track first, most recently played track second, empty state last. Implement the change inside the existing `app/lib/spotify.ts` helper using Spotify's current playback and recently played endpoints, normalize the result into a single typed activity model, and extend the existing Spotify card to render both playback context such as "Playing now" or a human-readable played time and a human-readable track duration without adding client-side fetching or new dependencies.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 App Router  
**Primary Dependencies**: `next`, `react`, `react-dom`, TailwindCSS 4, Spotify Web API via native `fetch`  
**Storage**: N/A  
**Testing**: `npm run lint`, `npm run build`, manual Spotify integration validation with active and inactive playback states  
**Target Platform**: Static Next.js site deployed to Vercel or another CDN-backed static host, viewed in modern desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Preserve the current home-page ISR behavior, avoid adding client-side JavaScript for Spotify activity, and keep the activity section to one current API resolution per page render  
**Constraints**: Must remain compatible with the site's static-first architecture, must not add API routes or third-party packages, must use Spotify refresh-token flow, must tolerate `204 No Content`, null items, and partially missing track metadata, and must request the `user-read-currently-playing` and `user-read-recently-played` scopes on the refresh token  
**Scale/Scope**: One Spotify card on the home page, one normalized activity item per render, one helper module, one shared type update, and one card metadata update for played-time and duration labels

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Principle | Status |
|------|-----------|--------|
| All new pages are statically pre-renderable (no per-request server logic) | I. Static-First | PASS |
| No `any` types; `strict: true` remains enabled in tsconfig.json | II. TypeScript Strict Mode | PASS |
| All styling uses TailwindCSS utility classes; no new CSS files outside globals.css | III. TailwindCSS for All Styling | PASS |
| `"use client"` used only where browser APIs / stateful hooks are strictly required | IV. Server Components by Default | PASS |
| Semantic HTML used; images go via `<Image>`; interactive elements are keyboard-accessible | V. Accessibility & Performance | PASS |
| No new third-party packages added without documented justification | Technology Stack | PASS |
| Names are descriptive; components have a single responsibility; no commented-out code | VI. Readability, Clarity & Architecture | PASS |
| Magic values are extracted into descriptive constants files instead of floating in components | VI. Readability, Clarity & Architecture | PASS |
| No premature abstractions; new abstractions justified by 3+ repetitions | VI. Readability, Clarity & Architecture | PASS |

Post-design review: PASS. The design keeps the feature inside the existing home-page activity flow, uses server components only, normalizes Spotify responses in one helper, and does not introduce new packages or architectural exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/003-spotify-activity-fallback/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── spotify-activity.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── ActivitySection.tsx
│   └── SpotifyCard.tsx
├── lib/
│   ├── index.ts
│   └── spotify.ts
├── types/
│   ├── activity.ts
│   └── index.ts
└── page.tsx
```

**Structure Decision**: Keep the feature within the existing App Router layout. Spotify API orchestration and normalization stay in `app/lib/spotify.ts`, the shared data contract lives in `app/types/activity.ts`, and presentation changes remain isolated to `app/components/SpotifyCard.tsx` and `app/components/ActivitySection.tsx`.

## Complexity Tracking

No constitution violations or justified complexity exceptions were required for this plan.

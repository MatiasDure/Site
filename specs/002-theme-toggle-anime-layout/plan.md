# Implementation Plan: Theme Selection And Mobile Anime Layout

**Branch**: `002-theme-toggle-anime-layout` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-theme-toggle-anime-layout/spec.md`

## Summary

Add a user-controlled theme system that defaults to system preference, persists explicit visitor selection, and applies consistent semantic color tokens across the portfolio. Implement the theme using a small client-side toggle plus a document-level theme attribute and CSS custom properties in `app/globals.css`, while keeping styling consumption inside Tailwind utilities. Fix the anime section's phone layout by moving from the current compressed multi-column grid to a one-card-per-row mobile grid with responsive image sizing.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 App Router  
**Primary Dependencies**: `next`, `react`, `react-dom`, TailwindCSS 4  
**Storage**: Browser `localStorage` for persisted theme preference; CSS custom properties in `app/globals.css` for theme tokens  
**Testing**: `npm run lint`, `npm run build`, manual validation across desktop and mobile viewports for theme persistence and anime-card layout  
**Target Platform**: Static Next.js site deployed to a CDN and viewed in modern desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Avoid a visible theme-flash on initial load, preserve static rendering for all pages, and keep added client JavaScript limited to the theme toggle interaction  
**Constraints**: Must remain static-first, must not add third-party theming libraries, must keep styling in Tailwind utilities with global CSS limited to shared theme tokens, must avoid duplicating entire component class trees per theme, and must preserve accessibility across the navigation, cards, links, and fallback states  
**Scale/Scope**: One site-wide theme preference, one small client theme control, one global token layer, and one responsive anime-grid adjustment on the landing page

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

Post-design review: PASS. The design keeps the feature static-first, limits client behavior to the theme control, centralizes color tokens in `app/globals.css`, and improves the anime grid without introducing new packages or route-level complexity. For this feature, semantic theme variables and Tailwind token mappings in `app/globals.css` are treated as acceptable under the project's styling rules.

## Project Structure

### Documentation (this feature)

```text
specs/002-theme-toggle-anime-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── theme-and-activity-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── ActivitySection.tsx
│   ├── AnimeCard.tsx
│   ├── Footer.tsx
│   ├── NavBar.tsx
│   ├── ProjectCard.tsx
│   ├── SocialLinks.tsx
│   ├── SpotifyCard.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── theme.constants.ts
│   └── index.ts
├── projects/
│   └── [domain]/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

**Structure Decision**: Keep the feature inside the existing App Router layout. Apply the theme at the document root in `app/layout.tsx`, centralize semantic color tokens in `app/globals.css`, place the visitor control in a focused `ThemeToggle` client component, and update the shared navigation/cards plus project pages to consume token-based Tailwind classes. Keep the anime-grid change localized to `app/components/ActivitySection.tsx` and `app/components/AnimeCard.tsx`.

## Complexity Tracking

No constitution violations or justified complexity exceptions are required for this plan.

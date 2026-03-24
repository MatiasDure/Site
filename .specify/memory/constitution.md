<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Type: MINOR (new principle VI added)

Modified principles: None
Added sections: Core Principles VI. Readability, Clarity & Architecture
Removed sections: None

Templates review:
- .specify/templates/plan-template.md  ✅ Constitution Check gate added for Principle VI
- .specify/templates/spec-template.md  ✅ No structural changes required
- .specify/templates/tasks-template.md ✅ No structural changes required

Deferred TODOs: None.
-->

# Personal Website Constitution

## Core Principles

### I. Static-First

Every page MUST be pre-renderable at build time using Next.js Static Site Generation (SSG) or
Incremental Static Regeneration (ISR). No runtime server-side rendering with per-request
computation is permitted unless explicitly justified. All pages MUST be deployable to a static
CDN without a Node.js runtime.

**Rationale**: A personal website has no dynamic per-user data requirements. Static output means
zero cold-start latency, trivial CDN deployment, and maximum reliability.

### II. TypeScript Strict Mode

All source files MUST be TypeScript (`.ts` / `.tsx`). The `tsconfig.json` MUST keep `strict: true`
enabled. `any` types are FORBIDDEN without an inline `// eslint-disable` comment and documented
justification in the same PR. Type assertions (`as T`) MUST only be used when TypeScript inference
is demonstrably insufficient.

**Rationale**: Type safety eliminates entire categories of runtime errors and makes refactoring
safe across the codebase.

### III. TailwindCSS for All Styling

All visual styling MUST use TailwindCSS utility classes. Custom CSS is ONLY permitted in
`app/globals.css` for CSS reset/base layer overrides and font-face declarations. CSS Modules,
styled-components, inline `style` objects, and arbitrary CSS files are FORBIDDEN unless no
TailwindCSS equivalent exists, and the deviation is documented in the relevant component.

**Rationale**: TailwindCSS colocation of styles and markup reduces cognitive overhead and keeps
design consistency enforceable through the design-token system (colors, spacing, typography).

### IV. Server Components by Default

React Server Components MUST be the default. A component MUST NOT include the `"use client"`
directive unless it requires browser APIs, React hooks with client-only semantics (e.g.,
`useState`, `useEffect`), or DOM event listeners. Client component boundaries MUST be pushed
as deep in the tree as possible to minimize the JavaScript bundle sent to the browser.

**Rationale**: Server Components reduce JavaScript bundle size, improve Time to First Byte, and
enforce a clear separation between static content and interactive islands.

### V. Accessibility & Performance

Semantic HTML MUST be used throughout (`<nav>`, `<main>`, `<article>`, `<section>`, etc.).
Images MUST use the Next.js `<Image>` component. Core Web Vitals MUST target the "Good" tier
(LCP < 2.5 s, CLS < 0.1, INP < 200 ms). WCAG 2.1 AA compliance is REQUIRED: all interactive
elements MUST be keyboard-navigable and carry accessible labels or ARIA attributes.

**Rationale**: Accessibility and performance are non-negotiable quality attributes for any
public-facing site and reflect directly on the owner's professional reputation.

### VI. Readability, Clarity & Architecture

Code MUST be written for humans first. The following rules apply:

- **Naming**: Variables, functions, and components MUST have descriptive, intention-revealing
  names. Abbreviations are FORBIDDEN unless universally understood (e.g., `id`, `url`, `props`).
- **Component size**: A component MUST do one thing. If a JSX tree exceeds ~80 lines or has
  more than one distinct responsibility, it MUST be split into smaller components.
- **File organisation**: Follow Next.js App Router conventions strictly.
  - `app/components/` — shared, reusable UI components.
  - `app/lib/` — pure utility functions and data helpers (no JSX).
  - `app/types/` — shared TypeScript interfaces and type aliases.
  - Page segments co-locate their own sub-components in the segment directory.
- **No premature abstraction**: Abstractions MUST only be introduced when a pattern is repeated
  at least three times. YAGNI applies — do not build for hypothetical future requirements.
- **Comments**: Code MUST be self-documenting. Comments MUST explain *why*, never *what*.
  Commented-out code MUST NOT be committed.
- **Imports**: Barrel files (`index.ts`) are PERMITTED only for `app/components/` and
  `app/lib/`. Avoid deep re-export chains.

**Rationale**: A readable, well-structured codebase lowers the cost of every future change and
makes the project approachable for collaborators or the author returning after months away.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (`strict: true`)
- **Styling**: TailwindCSS 4 (utility-first; configured via `postcss.config.mjs`)
- **Runtime**: React 19
- **Linting**: ESLint 9 with `eslint-config-next`
- **Deployment target**: Vercel or any static CDN via `next build`
- **Node requirement**: ≥ 20 LTS

No backend API routes, databases, or authentication systems are in scope. Third-party dependency
additions MUST be minimized — prefer native browser APIs and Next.js built-ins before adding
new packages. Each new package addition MUST be justified in the PR description.

## Development Workflow

1. **Feature branches**: All work MUST be done on a feature branch. Direct commits to `main`
   are FORBIDDEN.
2. **Local development**: `npm run dev` for hot-reload development server.
3. **Lint gate**: `npm run lint` MUST exit with zero errors before any PR is merged.
4. **Build gate**: `npm run build` MUST succeed (no TypeScript errors, no broken static export)
   before any PR is merged.
6. All components MUST live under `app/` following Next.js App Router conventions. Shared
   components belong in `app/components/`; page-specific components co-locate with their page
   segment directory.

## Governance

This constitution supersedes all other practices and conventions for this project. When conflicts
arise between this document and any other guideline, this document prevails.

**Amendment procedure**:
- Any change to principles requires a version bump following semantic versioning:
  - MAJOR: Removal or redefinition of an existing principle.
  - MINOR: New principle added or section materially expanded.
  - PATCH: Clarification, wording, or typo fix.
- Amendments MUST update `Last Amended` date and increment `Version`.

All implementation plans (`plan.md`) MUST include a "Constitution Check" section that validates
the feature against these principles before Phase 0 research begins.

**Version**: 1.1.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-23

<!--
SYNC IMPACT REPORT
==================
Version change: 2.0.0 → 2.1.0
Type: MINOR (materially expanded multi-agent dispatch and merge workflow requirements)

Modified principles:
- Multi-Agent Task Distribution section materially expanded

Added sections: None
Removed sections: None

Templates requiring updates:
- .specify/templates/plan-template.md              ✅ Reviewed; no structural change required
- .specify/templates/spec-template.md              ✅ Reviewed; no structural changes required
- .specify/templates/tasks-template.md             ✅ Reviewed; existing task phase guidance already aligns
- .specify/templates/commands/*.md                 ✅ Not present; no action required
- .specify/memory/subagent-dispatch.md             ✅ Clarified dispatcher staging, worktree, commit, and merge rules
- .specify/memory/task-distribution.md             ✅ Clarified worker commit and dependency-merge rules
- specs/004-weather-project-likes/task-distribution.md ✅ No active dispatch yet; template remains sufficient

Deferred TODOs: None.
-->

# Personal Website Constitution

## Core Principles

### I. Static-First Delivery

Public, cacheable, and non-personalized routes MUST use Static Site Generation (SSG) or
Incremental Static Regeneration (ISR) by default. Runtime server logic is PERMITTED only for
features that require authenticated identity, third-party OAuth callbacks, durable persistence,
or per-user state. Runtime features MUST be isolated so unrelated public pages remain pre-rendered
and cacheable.

**Rationale**: Static delivery remains the default for a portfolio site's public experience, but
modern portfolio features such as authenticated likes or OAuth-backed personalization require a
small, controlled runtime surface instead of a blanket ban on server capabilities.

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
- **Constants**: Magic numbers, string literals, timing values, size thresholds, route fragments,
  and similar configuration-like values MUST NOT float inside components when they influence
  rendering logic, layout, or behavior. Reusable or meaningful values MUST be moved into an
  appropriate constants module with descriptive names located alongside the relevant feature or
  in a shared constants file when used across multiple features.
- **Comments**: Code MUST be self-documenting. Comments MUST explain *why*, never *what*.
  Commented-out code MUST NOT be committed.
- **Imports**: Barrel files (`index.ts`) are PERMITTED only for `app/components/` and
  `app/lib/`. Avoid deep re-export chains.

**Rationale**: A readable, well-structured codebase lowers the cost of every future change and
makes the project approachable for collaborators or the author returning after months away.

### VII. Server-Only Authenticated Features

Authentication providers, access tokens, database clients, and authenticated mutations MUST
execute on the server only. Durable user data MUST live in an explicitly declared persistence
layer with a schema, uniqueness constraints, and a migration strategy. Authenticated mutations
MUST validate identity, authorize the target resource, enforce domain invariants, and fail with
safe user-facing errors that do not expose secrets or raw database details.

**Rationale**: Once the project supports identity and persistence, the primary engineering risk is
no longer whether runtime exists, but whether credentials, authorization, and data integrity stay
contained to auditable server-side boundaries.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (`strict: true`)
- **Styling**: TailwindCSS 4 (utility-first; configured via `postcss.config.mjs`)
- **Runtime**: React 19 with Node.js 20 LTS when runtime-backed features are enabled
- **Persistence**: SQLite or another explicitly approved datastore MAY be used when features
  require durable relational or user-specific data
- **Authentication**: OAuth-based providers MAY be used when features require user identity;
  custom credential flows require explicit justification
- **Linting**: ESLint 9 with `eslint-config-next`
- **Deployment target**: Vercel or another Next.js-capable host; static CDN-only deployment is
  allowed only when runtime-backed features are not enabled
- **Node requirement**: ≥ 20 LTS

Backend route handlers, server actions, databases, and authentication systems are PERMITTED when
justified by feature requirements. Third-party dependency additions MUST be minimized — prefer
native browser APIs and Next.js built-ins before adding new packages. Each new package addition
MUST be justified in the PR description, and secrets or credentials MUST remain server-only.

## Development Workflow

1. **Feature branches**: All work MUST be done on a feature branch. Direct commits to `main`
   are FORBIDDEN.
2. **Local development**: `npm run dev` for hot-reload development server.
3. **Lint gate**: `npm run lint` MUST exit with zero errors before any PR is merged.
4. **Build gate**: `npm run build` MUST succeed (no TypeScript errors, no broken production
  build output)
   before any PR is merged.
5. All components MUST live under `app/` following Next.js App Router conventions. Shared
   components belong in `app/components/`; page-specific components co-locate with their page
   segment directory.
6. Features that introduce authentication, persistence, or authenticated mutations MUST document
  required environment variables, migration steps, and local verification in `quickstart.md`.

## Multi-Agent Task Distribution

If task implementation is explicitly distributed across sub-agents before coding begins, the
repository MUST use a single dispatcher and one or more worker sub-agents. The dispatcher MUST
follow [subagent-dispatch.md](./subagent-dispatch.md) to group compatible tasks, assign workers,
and keep the active distribution current. Every worker sub-agent MUST read
[task-distribution.md](./task-distribution.md) before making code changes.

The shared [task-distribution.md](./task-distribution.md) file defines the worker protocol only.
The active distribution for a feature MUST live in that feature's own
`specs/<feature>/task-distribution.md` file. Each generated spec directory MUST include this file,
and workers MUST read the protocol document plus the active distribution file for the current spec
before editing files. Each worker MUST create and use a dedicated git worktree on a new branch
whose name clearly describes the overall goal of the assigned task bundle before editing files.
Those worktrees MUST be created as siblings of `personal-website`, not nested inside the
repository.

The dispatcher MUST identify blocking bundles before launching parallel workers. If one bundle is
foundational or otherwise unlocks later work, that blocking bundle MUST be implemented, committed,
and merged back into the active feature branch before any dependent workers are dispatched.
Unrelated, non-blocked bundles MAY run in parallel only after the dispatcher verifies they do not
share blocking dependencies or same-file ownership.

Every worker-owned bundle MUST end with a commit on the worker branch using a short, specific
message. Completed worker branches MUST then be merged back into the active feature branch in
dependency order so later workers branch from the latest committed integration point instead of an
outdated baseline.

## Governance

This constitution supersedes all other practices and conventions for this project. When conflicts
arise between this document and any other guideline, this document prevails.

**Amendment procedure**:
- Any change to principles requires a version bump following semantic versioning:
  - MAJOR: Removal or redefinition of an existing principle.
  - MINOR: New principle added or section materially expanded.
  - PATCH: Clarification, wording, or typo fix.
- Amendments MUST update `Last Amended` date and increment `Version`.
- When multi-agent task distribution is in use, the dispatcher MUST keep
  the current spec's `task-distribution.md` current enough for any worker to recover its task
  bundle, worktree path, and branch name before implementation continues.

All implementation plans (`plan.md`) MUST include a "Constitution Check" section that validates
the feature against these principles before Phase 0 research begins.

**Version**: 2.1.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-03-30

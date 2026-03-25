# Tasks: Theme Selection And Mobile Anime Layout

**Input**: Design documents from `/specs/002-theme-toggle-anime-layout/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No dedicated automated test tasks were generated because the specification does not explicitly require a TDD or automated-test-first workflow. Validation is covered by lint, build, and manual quickstart checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish shared theme constants and integration points used by the rest of the feature.

- [X] T001 Create theme preference constants and document attribute names in `app/lib/theme.constants.ts`
- [X] T002 [P] Export theme constants from `app/lib/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared theme plumbing that user stories depend on.

**⚠️ CRITICAL**: No theme-related user story work should begin until this phase is complete.

- [X] T003 Define semantic light/dark token variables and Tailwind theme mappings in `app/globals.css`
- [X] T004 Implement root theme bootstrap and root/body theme attributes in `app/layout.tsx`
- [X] T005 Create the persisted client theme control in `app/components/ThemeToggle.tsx`
- [X] T006 Export `ThemeToggle` from `app/components/index.ts`

**Checkpoint**: Shared theme infrastructure is ready for feature work.

---

## Phase 3: User Story 1 - Choose A Preferred Theme (Priority: P1) 🎯 MVP

**Goal**: Let visitors explicitly choose light or dark mode and keep that choice active across navigation and return visits.

**Independent Test**: Open the site, change the theme from the visible control, navigate between the home page, a domain page, and a project detail page, then refresh to confirm the selected theme persists.

### Implementation for User Story 1

- [X] T007 [US1] Integrate `ThemeToggle` into `app/components/NavBar.tsx` with accessible labeling and keyboard-friendly interaction, relying on shared tokenized theme behavior rather than a separate NavBar-only refactor task
- [X] T008 [US1] Apply semantic theme token classes to shared page shells in `app/layout.tsx`, `app/page.tsx`, `app/projects/[domain]/page.tsx`, and `app/projects/[domain]/[slug]/page.tsx`
- [X] T009 [US1] Update primary landing-page copy styling to semantic theme tokens in `app/components/HeroSection.tsx`

**Checkpoint**: User Story 1 is independently functional and demonstrable.

---

## Phase 4: User Story 2 - Browse Anime Comfortably On Mobile (Priority: P2)

**Goal**: Make the anime section readable on phone-sized screens by showing one card per row without horizontal overflow.

**Independent Test**: Resize the home page to a mobile viewport between 320 px and 639 px and confirm the anime list shows one card per row, readable titles, and no horizontal scrolling.

### Implementation for User Story 2

- [X] T010 [US2] Change the anime grid to one column on mobile and multi-column at larger breakpoints in `app/components/ActivitySection.tsx`
- [X] T011 [US2] Update anime card layout, title containment, and responsive image sizing in `app/components/AnimeCard.tsx`
- [X] T012 [US2] Refine anime-section fallback spacing and mobile readability in `app/components/ActivitySection.tsx`

**Checkpoint**: User Story 2 is independently functional and demonstrable.

---

## Phase 5: User Story 3 - Keep Supporting States Usable In Both Themes (Priority: P3)

**Goal**: Ensure supporting UI surfaces, cards, links, and empty states remain coherent and readable in both themes.

**Independent Test**: Toggle between light and dark modes on the home page and project pages, including empty/fallback states, and confirm shared components remain visually coherent and readable.

### Implementation for User Story 3

- [X] T013 [P] [US3] Refactor shared activity and project card surfaces to semantic theme tokens in `app/components/SpotifyCard.tsx` and `app/components/ProjectCard.tsx`
- [X] T014 [P] [US3] Refactor navigation-adjacent and section surfaces to semantic theme tokens in `app/components/DomainSection.tsx`, `app/components/Footer.tsx`, and `app/components/SocialLinks.tsx`
- [X] T015 [US3] Update activity headings and fallback states to semantic theme tokens in `app/components/ActivitySection.tsx`
- [X] T016 [US3] Update project-detail actions, tags, media surfaces, and prose wrapper styling in `app/projects/[domain]/[slug]/page.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across the feature.

- [X] T017 Run lint and fix any issues surfaced by `npm run lint` for files touched by `app/` and `specs/002-theme-toggle-anime-layout/`
- [X] T018 Run build and resolve any regressions surfaced by `npm run build` for files touched by `app/`
- [ ] T019 Validate manual scenarios from `specs/002-theme-toggle-anime-layout/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks theme work in later phases.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Can start after Foundational completion; it is functionally independent from US1 but shares the same branch and validation flow.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and is safest after US1 because it extends the tokenized theme system across more surfaces.
- **Polish (Phase 6)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and delivers the MVP theme-selection workflow.
- **User Story 2 (P2)**: Starts after Phase 2 and remains independently testable from theme persistence.
- **User Story 3 (P3)**: Starts after Phase 2 and benefits from the semantic-token groundwork established for US1.

### Parallel Opportunities

- `T002` can run in parallel with other setup validation once `T001` establishes the shared constants file.
- `T013` and `T014` can run in parallel because they touch different shared component files.
- Polish tasks `T017`, `T018`, and `T019` remain sequential because build and manual validation depend on completed code changes.

---

## Parallel Example: User Story 3

```bash
Task: "Refactor shared activity and project card surfaces to semantic theme tokens in app/components/SpotifyCard.tsx and app/components/ProjectCard.tsx"
Task: "Refactor navigation-adjacent and section surfaces to semantic theme tokens in app/components/DomainSection.tsx, app/components/Footer.tsx, and app/components/SocialLinks.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate theme persistence and navigation behavior before expanding scope.

### Incremental Delivery

1. Deliver the theme infrastructure and visitor control first.
2. Add the mobile anime-grid improvement as a separate independently verifiable slice.
3. Expand semantic token coverage to supporting states and shared surfaces.
4. Finish with lint, build, and quickstart validation.

### Parallel Team Strategy

1. One developer completes Setup and Foundational tasks.
2. After Phase 2:
   - Developer A handles User Story 1.
   - Developer B handles User Story 2.
   - Developer C handles the parallelizable User Story 3 component refactors.

---

## Notes

- All tasks follow the required checklist format with IDs, optional `[P]` markers, and `[US#]` labels for story-specific work.
- Exact file paths are included so the task list is directly executable by an implementation agent.
- The task order keeps the theme architecture centralized and avoids duplicating theme-specific class trees across components.
- The current mobile-grid tasks are considered sufficient to cover low-count anime layout behavior; no extra task is required unless implementation reveals a concrete gap.
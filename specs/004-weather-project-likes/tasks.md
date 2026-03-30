# Tasks: Enschede Weather, GitHub Contributions, And Project Likes

**Input**: Design documents from `/specs/004-weather-project-likes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are not explicitly requested in the feature specification, so this task list focuses on implementation and manual validation through the documented quickstart scenarios plus final lint and build verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g. [US1], [US2], [US3])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies, environment documentation, and local configuration for weather, GitHub activity, Google auth, and SQLite persistence

- [X] T001 Update runtime dependencies for `@mariohamann/activity-graph`, Auth.js Google auth, and SQLite support in package.json
- [X] T002 [P] Add Google OAuth, GitHub token, and SQLite setup instructions to README.md
- [X] T003 [P] Create the local runtime environment template in .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared type contracts and portfolio identity model used across weather, contributions, auth, and likes

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create the weather view-model contract in app/types/weather.ts
- [X] T005 [P] Create the GitHub contribution grid contracts in app/types/github.ts
- [X] T006 [P] Create the authenticated user and session contracts in app/types/user.ts
- [X] T007 Extend the project model with stable identity and like snapshot fields in app/types/project.ts
- [X] T008 Export the new runtime types from app/types/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - See Current Enschede Weather (Priority: P1) 🎯 MVP

**Goal**: Show a readable current-weather summary for Enschede on the main portfolio experience, including a clear unavailable state

**Independent Test**: Open the homepage and confirm the site renders either a readable Enschede weather summary or a clear unavailable state without breaking the activity section layout

### Implementation for User Story 1

- [ ] T009 [US1] Implement Open-Meteo weather fetching and unavailable-state normalization in app/lib/open-meteo.ts
- [ ] T010 [P] [US1] Build the visitor-facing weather card component in app/components/WeatherCard.tsx
- [ ] T011 [US1] Update app/components/ActivitySection.tsx to load the weather snapshot and render WeatherCard.tsx with fallback messaging

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review A Year Of GitHub Contributions (Priority: P2)

**Goal**: Show the past year's GitHub contributions in a GitHub-style columns-by-rows graph while preserving empty days and an unavailable fallback state

**Independent Test**: Open the homepage and confirm the GitHub contribution section renders a full-year graph with visible empty days, or a clear unavailable state when GitHub data cannot be fetched

### Implementation for User Story 2

- [ ] T012 [US2] Implement GitHub GraphQL contribution fetching and full-year normalization in app/lib/github.ts
- [ ] T013 [P] [US2] Create the server-side contribution graph wrapper in app/components/GitHubActivityGraph.tsx
- [ ] T014 [P] [US2] Create the custom-element registration wrapper for `activity-graph` in app/components/GitHubActivityGraphClient.tsx
- [ ] T015 [US2] Add `activity-graph` theme variables and contribution-grid styling hooks to app/globals.css
- [ ] T016 [US2] Update app/components/ActivitySection.tsx to render the GitHub contribution graph or unavailable state with the new wrappers

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Create An Account To Access Likes (Priority: P3)

**Goal**: Enable Google-based account creation, sign-in, sign-out, and session-aware browsing without interrupting project exploration

**Independent Test**: Start signed out, complete Google sign-in, sign out, sign back in, and confirm the browsing experience stays available while authenticated state is reflected in the navigation

### Implementation for User Story 3

- [X] T017 [P] [US3] Create the SQLite client bootstrap in db/client.ts
- [X] T018 [P] [US3] Define the `User`, `Project`, and `UserProjects` schema in db/schema.ts
- [X] T019 [US3] Implement deterministic Markdown-to-SQLite project synchronization in app/lib/project-sync.ts
- [X] T020 [US3] Implement Google Auth.js configuration, user upsert callbacks, and session shaping in app/lib/session.ts
- [X] T021 [US3] Add the Auth.js Google OAuth route handler in app/api/auth/[...nextauth]/route.ts
- [X] T022 [P] [US3] Create the reusable Google sign-in and sign-out control with callback support in app/components/auth/GoogleSignInButton.tsx
- [X] T023 [US3] Update app/components/NavBar.tsx to expose authenticated account actions without disrupting project browsing context

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

---

## Phase 6: User Story 4 - Like Projects From Cards And Detail Pages (Priority: P4)

**Goal**: Let authenticated users like and unlike projects from cards and detail pages while keeping like totals and viewer state consistent everywhere

**Independent Test**: Sign in, like a project from a card, confirm the detail page shows the same liked state and total, then unlike it from either surface and verify both surfaces stay synchronized

### Implementation for User Story 4

- [ ] T024 [US4] Implement session-aware like snapshot queries and toggle logic in app/lib/likes.ts
- [ ] T025 [US4] Update app/lib/projects.ts to attach stable project IDs and persisted like data to project list and detail lookups
- [ ] T026 [P] [US4] Build the authenticated like button with sign-in fallback in app/components/ProjectLikeButton.tsx
- [ ] T027 [US4] Refactor app/components/ProjectCard.tsx to render ProjectLikeButton.tsx without breaking card navigation
- [ ] T028 [US4] Update app/page.tsx and app/projects/[domain]/page.tsx to supply like-aware project data to project cards
- [ ] T029 [US4] Update app/projects/[domain]/[slug]/page.tsx to render the detail-page like state, total, and toggle flow

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the integrated experience and align verification docs with the delivered runtime behavior

- [ ] T030 [P] Update the validation flow and environment notes in specs/004-weather-project-likes/quickstart.md
- [ ] T031 Run `npm run lint` and `npm run build` and resolve feature-specific issues across package.json, app/lib/, app/components/, app/projects/, app/api/auth/[...nextauth]/route.ts, and db/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion
- **User Story 3 (Phase 5)**: Depends on Foundational completion
- **User Story 4 (Phase 6)**: Depends on User Story 3 completion and the stable project identity added in Phase 2
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion and is independent of auth and likes work
- **User Story 2 (P2)**: Starts after Foundational completion and is logically independent of US1, but implementation should coordinate shared edits in app/components/ActivitySection.tsx
- **User Story 3 (P3)**: Starts after Foundational completion and establishes the auth and persistence base required by likes
- **User Story 4 (P4)**: Depends on US3 for authenticated sessions, SQLite persistence, and synchronized project identities

### Within Each User Story

- Shared type contracts must exist before story-specific helpers and UI components consume them
- Data-fetching and normalization helpers precede the UI surfaces that render their results
- Auth and persistence infrastructure precede any like mutation or like-state rendering work
- Project-card and detail-page UI updates follow the shared like snapshot contract in app/lib/likes.ts and app/lib/projects.ts
- Each story should be manually validated through its independent test before moving to the next priority

### Parallel Opportunities

- T002 and T003 can run in parallel once the dependency list in T001 is decided
- T004, T005, and T006 can run in parallel because they create separate runtime type files
- T010 can run in parallel with T009 after the weather data contract is agreed
- T013 and T014 can run in parallel after the contribution data shape from T012 is defined
- T017 and T018 can run in parallel while establishing database infrastructure for US3
- T022 can run in parallel with late-stage auth route wiring after the session contract in T020 is stable
- T026 can run in parallel with T024 and T025 once the like snapshot and toggle contract is settled
- T030 can run in parallel with final regression checking in T031

---

## Parallel Example: User Story 1

```bash
# After the weather response contract is established:
Task: "Implement Open-Meteo weather fetching and unavailable-state normalization in app/lib/open-meteo.ts"
Task: "Build the visitor-facing weather card component in app/components/WeatherCard.tsx"
```

---

## Parallel Example: User Story 2

```bash
# After the GitHub contribution data shape is normalized:
Task: "Create the server-side contribution graph wrapper in app/components/GitHubActivityGraph.tsx"
Task: "Create the custom-element registration wrapper for activity-graph in app/components/GitHubActivityGraphClient.tsx"
```

---

## Parallel Example: User Story 3

```bash
# Database infrastructure can be split before auth wiring is finalized:
Task: "Create the SQLite client bootstrap in db/client.ts"
Task: "Define the User, Project, and UserProjects schema in db/schema.ts"

# After the session contract is stable:
Task: "Add the Auth.js Google OAuth route handler in app/api/auth/[...nextauth]/route.ts"
Task: "Create the reusable Google sign-in and sign-out control with callback support in app/components/auth/GoogleSignInButton.tsx"
```

---

## Parallel Example: User Story 4

```bash
# Once the like snapshot contract is agreed:
Task: "Implement session-aware like snapshot queries and toggle logic in app/lib/likes.ts"
Task: "Build the authenticated like button with sign-in fallback in app/components/ProjectLikeButton.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the homepage weather experience before expanding scope

### Incremental Delivery

1. Complete Setup and Foundational to establish shared types and project identity
2. Add User Story 1 for the Enschede weather card
3. Add User Story 2 for the GitHub contribution graph
4. Add User Story 3 for Google auth and persisted user sessions
5. Add User Story 4 for project likes across cards and detail pages
6. Finish with quickstart updates and full lint/build verification

### Parallel Team Strategy

1. One developer completes Setup and Foundational tasks
2. After Phase 2:
   - Developer A: User Story 1 weather helper and weather card integration
   - Developer B: User Story 2 GitHub helper and activity-graph wrappers
   - Developer C: User Story 3 auth and SQLite infrastructure
3. After User Story 3 is stable, a developer completes User Story 4 likes across cards and detail pages
4. Rejoin for quickstart updates and final regression checks

---

## Notes

- Tasks are ordered for execution and follow the required checklist format exactly
- No automated test tasks are included because the current specification requests manual scenario validation rather than TDD or explicit automated coverage
- User Story 4 intentionally depends on User Story 3 so like mutations are only introduced after Google auth and SQLite-backed project synchronization are in place
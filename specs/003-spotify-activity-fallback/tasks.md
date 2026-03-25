# Tasks: Spotify Activity Fallback And Playback Time

**Input**: Design documents from `/specs/003-spotify-activity-fallback/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are not explicitly requested in the feature specification, so this task list focuses on implementation and manual validation via quickstart scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the feature documentation and operational prerequisites for Spotify current-playback support

- [X] T001 Update Spotify scope and validation notes in README.md to require `user-read-currently-playing` alongside `user-read-recently-played`
- [X] T002 Create Spotify activity constants for endpoint URLs and display labels in app/lib/spotify.constants.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared Spotify activity model and resolver contract used by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update the shared Spotify activity types in app/types/activity.ts to represent playback state, played time, source, and duration
- [X] T004 Export the updated Spotify activity types from app/types/index.ts for shared consumption
- [X] T005 Refactor the Spotify helper internals in app/lib/spotify.ts to add typed response parsing and normalization helpers for current-playback and recent-history payloads
- [X] T006 Export the unified Spotify activity resolver from app/lib/index.ts for the activity section to consume

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - See What Is Playing Right Now (Priority: P1) 🎯 MVP

**Goal**: Show the actively playing Spotify track whenever live playback exists

**Independent Test**: Start Spotify playback, refresh the home page, and confirm the activity card shows the active track instead of older listening history

### Implementation for User Story 1

- [X] T007 [US1] Implement current-playback lookup and active-track selection in app/lib/spotify.ts
- [X] T008 [US1] Update app/components/ActivitySection.tsx to consume the unified Spotify activity resolver and keep the existing fallback message when no activity is available
- [X] T009 [US1] Update the Spotify activity heading copy in app/components/ActivitySection.tsx so it no longer implies the card is always limited to last-played history

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Fall Back To Recent Listening Activity (Priority: P2)

**Goal**: Show the most recently played track when no track is actively playing

**Independent Test**: Stop Spotify playback, refresh the home page, and confirm the activity card shows the most recent track or the existing empty-state message when no history is available

### Implementation for User Story 2

- [X] T010 [US2] Implement recent-history fallback resolution after empty or inactive current-playback results in app/lib/spotify.ts
- [X] T011 [US2] Handle `204`, null-item, and empty-history cases in app/lib/spotify.ts so unresolved Spotify activity returns `null` cleanly
- [X] T012 [US2] Update the no-data message in app/components/ActivitySection.tsx to cover both missing current playback and missing recent history without implying an error

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Understand When The Track Was Played (Priority: P3)

**Goal**: Add clear playback-time context so visitors can tell whether activity is live or historical

**Independent Test**: Verify that an active track shows a live-now label and a fallback recent track shows a human-readable played-time label

### Implementation for User Story 3

- [X] T013 [US3] Add playback-time label formatting for live and recent states in app/lib/spotify.ts
- [X] T014 [US3] Extend the Spotify card layout in app/components/SpotifyCard.tsx to render the playback-time label under the artist metadata
- [X] T015 [US3] Ensure the updated Spotify card metadata remains readable and semantically structured in app/components/SpotifyCard.tsx when played-time data is missing

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Understand The Duration Of The Tracks (Priority: P4)

**Goal**: Surface track duration context for the currently displayed Spotify activity item

**Independent Test**: Verify that the card shows a readable duration label for both active playback and recent-history fallback tracks when Spotify provides duration metadata

### Implementation for User Story 4

- [X] T016 [US4] Normalize track duration metadata from both Spotify endpoints in app/lib/spotify.ts
- [X] T017 [US4] Add duration label formatting to the Spotify activity model output in app/lib/spotify.ts
- [X] T018 [US4] Extend app/components/SpotifyCard.tsx to render the duration label without displacing the playback-time label or breaking the compact card layout

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full Spotify activity experience and align documentation with the delivered behavior

- [X] T019 [P] Update the feature quickstart validation steps in specs/003-spotify-activity-fallback/quickstart.md to match the implemented UI labels and manual verification flow
- [X] T020 Run `npm run lint` and `npm run build` and resolve any feature-specific issues across app/lib/spotify.ts, app/components/ActivitySection.tsx, app/components/SpotifyCard.tsx, app/types/activity.ts, and README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational completion and establishes the primary active-playback path
- **User Story 2 (P2)**: Depends on the shared resolver from Foundational and integrates with US1 selection logic in app/lib/spotify.ts
- **User Story 3 (P3)**: Depends on the normalized playback-state data produced by US1 and US2
- **User Story 4 (P4)**: Depends on the normalized Spotify activity model and card metadata layout from US3

### Within Each User Story

- Shared types and resolver helpers must exist before story-specific rendering changes
- Spotify helper changes precede UI wiring when the UI depends on new model fields
- Card layout changes follow the data-model fields they display
- Each story should be manually validated before moving to the next priority

### Parallel Opportunities

- T001 and T002 can run in parallel during Setup
- T003 and T004 can run in parallel once the type shape is agreed
- T019 can run in parallel with final regression checks once implementation is complete

---

## Parallel Example: User Story 1

```bash
# After Phase 2 completes, these tasks can be split between helper and UI work:
Task: "Implement current-playback lookup and active-track selection in app/lib/spotify.ts"
Task: "Update app/components/ActivitySection.tsx to consume the unified Spotify activity resolver and keep the existing fallback message when no activity is available"
```

---

## Parallel Example: Setup And Foundation

```bash
# Setup tasks that touch different files:
Task: "Update Spotify scope and validation notes in README.md to require user-read-currently-playing alongside user-read-recently-played"
Task: "Create Spotify activity constants for endpoint URLs and display labels in app/lib/spotify.constants.ts"

# Foundation tasks that can be split after the type shape is confirmed:
Task: "Update the shared Spotify activity types in app/types/activity.ts to represent playback state, played time, source, and optional duration"
Task: "Export the updated Spotify activity types from app/types/index.ts for shared consumption"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate active playback precedence on the home page

### Incremental Delivery

1. Complete Setup + Foundational to establish the shared Spotify activity model
2. Add User Story 1 for live playback precedence
3. Add User Story 2 for recent-history fallback
4. Add User Story 3 for playback-time context
5. Add User Story 4 for duration context
6. Finish with cross-cutting validation and docs updates

### Parallel Team Strategy

1. One developer completes shared setup and foundational helper/type work
2. Once foundation is ready:
   - Developer A: User Story 1 and User Story 2 helper flow in app/lib/spotify.ts
   - Developer B: User Story 3 and User Story 4 card presentation in app/components/SpotifyCard.tsx
3. Rejoin for final validation and documentation updates

---

## Notes

- Tasks are ordered for execution and use the exact checklist format required by speckit
- No automated test tasks are included because the current specification does not request TDD or explicit automated testing
- User Story 4 is part of the current committed scope and should be implemented before final validation
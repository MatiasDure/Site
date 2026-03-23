# Feature Specification: Personal Website Core

**Feature Branch**: `001-personal-website-core`  
**Created**: 2026-03-23  
**Status**: Draft  
**Input**: User description: "I am building a personal website to show the projects I have worked on, things about me, like the last music I listened on spotify and the last 5 animes I have watched. I want it to be modern, have a landing page with a general description about me, different sections featuring the 4 different software development branches I have worked on (web development, app development, game development, and embedded systems). Each section will contain 3 simplistic cards of the top projects being displayed, and a view all project button. The landing page should also show links to my LinkedIn and Github accounts, and at the end. There will be another page, which will show all the projects of the selected software branch after the view all projects button is pressed. This will display all the project cards in a grid. When the project card is pressed, another page will be opened with more detailed information about the project."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Discover Who I Am (Priority: P1)

A recruiter or collaborator visits the site for the first time. They land on the homepage, read a
short personal bio, learn which development domains the owner works in, see top projects for each
domain, and find links to LinkedIn and GitHub — all without leaving the landing page.

**Why this priority**: This is the core value proposition of the site. Every other story builds on
top of a working landing page. Without it nothing else can be demonstrated.

**Independent Test**: Navigate to the root URL. Verify the bio is visible, all four domain sections
are rendered, each shows exactly 3 project cards, and LinkedIn/GitHub links are present and
functional. This alone constitutes a shippable, demonstrable MVP.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site, **When** the page loads, **Then** a personal bio with name
   and description is visible above the fold.
2. **Given** a visitor scrolls the landing page, **When** they reach the domain sections, **Then**
   they see four named sections (Web Development, App Development, Game Development, Embedded
   Systems), each containing exactly 3 project cards.
3. **Given** a visitor reaches the footer area, **When** they look for social links, **Then**
   clickable LinkedIn and GitHub icons/links are visible and navigate to the correct profiles.
4. **Given** a visitor is on a mobile device, **When** the page loads, **Then** the layout is
   fully readable and usable without horizontal scrolling.

---

### User Story 2 — Browse All Projects in a Domain (Priority: P2)

A visitor wants to see the full portfolio for a specific development domain (e.g., all game
development projects). They click the "View All Projects" button in a domain section and are taken
to a dedicated page that shows every project in that domain as a grid of cards.

**Why this priority**: Directly extends the landing page MVP with the next natural user action.
The "all projects" page has no dependencies other than a working landing page.

**Independent Test**: Click the "View All Projects" button for any domain. Verify the correct URL
is loaded, all projects for that domain are shown in a grid of cards, and the page is usable on
both desktop and mobile.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "View All Projects" in a domain section, **When** the page loads,
   **Then** they see a page title identifying the domain and a grid containing all projects in
   that domain.
2. **Given** a visitor is on the all-projects page, **When** they view the cards, **Then** each
   card shows at minimum the project name, a thumbnail/cover image, and a short description.
3. **Given** a visitor navigates directly to an all-projects URL (e.g., `/projects/web`),
   **When** the page loads, **Then** the correct domain's projects are displayed.
4. **Given** a domain has zero projects, **When** the page loads, **Then** a clear empty-state
   message is shown instead of a broken layout.

---

### User Story 3 — Read Project Details (Priority: P3)

A visitor finds an interesting project card and clicks it to learn more. They are taken to a
dedicated project detail page with the full description, technologies used (as display labels —
not implementation), outcomes, and links (e.g., live demo, source repository).

**Why this priority**: Enriches individual project cards but is not required for the grid or
landing page to work. Can be added after User Stories 1 and 2.

**Independent Test**: Click any project card. Verify a project detail page opens with the full
project info. Navigating back returns to the previous grid or landing section.

**Acceptance Scenarios**:

1. **Given** a visitor clicks a project card, **When** the detail page loads, **Then** they see
   the project name, full description, relevant tags/labels, and at least one external link when
   available.
2. **Given** a visitor is on a project detail page, **When** they use the browser back button or
   a back navigation element, **Then** they are returned to the page they came from (all-projects
   grid or landing page).
3. **Given** a visitor navigates directly to a project detail URL, **When** the page loads,
   **Then** the correct project's information is displayed without errors.

---

### User Story 4 — See Live Activity (Spotify & Anime) (Priority: P4)

A visitor scrolling the landing page sees a small "about me" section that shows the last song
played on Spotify and the last 5 anime titles watched. This gives the page personality and a
human touch.

**Why this priority**: Purely additive feature — enjoyable but not essential to communicating
professional value. All other stories work independently of this one.

**Independent Test**: Navigate to the landing page and locate the activity section. Verify Spotify
and anime data is displayed. When data is unavailable, verify a graceful fallback message appears
instead of a broken UI.

**Acceptance Scenarios**:

1. **Given** a visitor views the landing page, **When** the activity section is rendered, **Then**
   it shows the title of the most recently played Spotify track (artist + song name).
2. **Given** a visitor views the landing page, **When** the activity section is rendered, **Then**
   it shows a list of up to 5 recently watched anime titles.
3. **Given** the external data source is unavailable, **When** the activity section renders,
   **Then** a friendly fallback message is shown (e.g., "No recent activity found") and the
   section does not break the rest of the page layout.

---

### Edge Cases

- What happens when a domain section has fewer than 3 projects? Display however many exist without
  leaving broken empty card slots.
- What happens when a project has no thumbnail image? A placeholder image or gradient must be
  shown — broken image icons are not acceptable.
- What happens when the visitor's network is slow? The page must remain usable; images must use
  lazy loading.
- What happens when external activity APIs (Spotify, anime tracker) are rate-limited or return
  errors? The rest of the page MUST remain fully functional.
- What happens when a visitor navigates to a non-existent project or domain URL? A 404 or
  "not found" page must be displayed clearly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page MUST display a personal bio section with the owner's name and a
  short self-description.
- **FR-002**: The landing page MUST display four domain sections: Web Development, App
  Development, Game Development, and Embedded Systems, in a visually distinct organisation.
- **FR-003**: Each domain section MUST display exactly 3 project cards (or fewer if fewer projects
  exist for that domain).
- **FR-004**: Each domain section MUST include a "View All Projects" button that navigates to the
  corresponding all-projects page for that domain.
- **FR-005**: The landing page MUST display links to the owner's LinkedIn and GitHub profiles.
- **FR-006**: The all-projects page MUST display all projects for the selected domain in a
  responsive grid layout.
- **FR-007**: Each project card MUST display at minimum: project name, cover/thumbnail image, and
  a short description.
- **FR-008**: Clicking a project card MUST navigate to a dedicated project detail page.
- **FR-009**: The project detail page MUST display: project name, full description, relevant
  display labels (e.g., domain, technologies used as plain text), and external links (live demo,
  source repository) where available.
- **FR-010**: The landing page MUST display a personal activity section showing the most recently
  played Spotify track and up to 5 recently watched anime titles.
- **FR-011**: The activity section MUST display graceful fallback content when external data is
  unavailable.
- **FR-012**: All pages MUST be fully responsive across desktop, tablet, and mobile viewports.
- **FR-013**: All pages MUST be statically pre-renderable at build time (no per-request server
  computation).
- **FR-014**: Project data (names, descriptions, images, links, domain assignment) MUST be
  manageable as structured data files, not hardcoded in component markup.

### Key Entities

- **Project**: A software project with a name, short description, full description, cover image,
  domain assignment, technology labels (display only), and optional external links (demo, repo).
- **Domain**: One of the four development branches (Web, App, Game, Embedded Systems). Acts as a
  category grouping projects.
- **Activity**: Real-time personal data — Spotify last-played track (artist, song, cover art) and
  recently watched anime (title list, up to 5 entries).
- **Social Link**: A labelled URL pointing to an external profile (LinkedIn, GitHub).

## Assumptions

- Project data will be authored manually as static data files (e.g., JSON or TypeScript arrays)
  and will not come from a CMS or external API at launch.
- Spotify "last played" data is fetched from the Spotify API at build time or via a lightweight
  static-compatible mechanism (e.g., ISR). Full real-time streaming is out of scope.
- Anime watch history data is fetched from a public tracker API (e.g., AniList or MyAnimeList)
  at build time or ISR. Account is assumed to be public.
- "Top 3 projects" per domain are determined by a manual `featured: true` flag in the project
  data files; there is no algorithmic ranking.
- The owner will supply the final LinkedIn and GitHub profile URLs before launch.
- No user authentication, comments, contact forms, or other interactive server-side features are
  in scope for this version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify the owner's name, domain expertise, and social
  profiles within 10 seconds of the page loading.
- **SC-002**: A visitor can navigate from the landing page to a specific project's detail page in
  3 clicks or fewer.
- **SC-003**: All pages achieve a Lighthouse Performance score ≥ 90 on desktop and ≥ 80 on mobile.
- **SC-004**: All pages achieve a Lighthouse Accessibility score ≥ 95.
- **SC-005**: The site builds successfully (`next build`) with zero TypeScript errors and zero
  ESLint errors.
- **SC-006**: All project cards render correctly on viewports from 375 px (mobile) to 1440 px
  (desktop) without layout breakage.
- **SC-007**: The activity section displays a fallback state within the normal page render when
  external APIs are unavailable, with no visible JavaScript errors.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

# Feature Specification: Enschede Weather And Project Likes

**Feature Branch**: `004-weather-project-likes`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "The personal website should include the current weather of Enschede, The Netherlands. Projects should be able to be liked by users. For this, users should be able to create accounts and log in, to like the projects. The projects should be able to be liked from the project cards or their respective pages. The website should also include GitHub commits from all repositories in the past year, displayed in a "columns x rows" manner similar to GitHub's contribution component."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Current Enschede Weather (Priority: P1)

A visitor wants the personal website to feel current and local. When they open the site, they can immediately see the current weather for Enschede, The Netherlands, without having to leave the portfolio.

**Why this priority**: Weather is directly visible to every visitor and adds immediate value to the homepage experience, even for users who never browse projects deeply.

**Independent Test**: Open the website as a visitor and confirm that the site shows the current weather for Enschede in a readable form, or a clear unavailable state if weather data cannot be shown.

**Acceptance Scenarios**:

1. **Given** a visitor opens the website while current weather information is available, **When** the homepage loads, **Then** the site shows the current weather for Enschede, The Netherlands.
2. **Given** a visitor opens the website while current weather information is temporarily unavailable, **When** the homepage loads, **Then** the site shows a clear unavailable state instead of a blank or broken weather area.

---

### User Story 2 - Review A Year Of GitHub Contributions (Priority: P2)

A visitor wants to understand the owner's recent development activity at a glance. They can view the past year's GitHub commit activity across repositories in a calendar-style grid arranged in columns and rows, similar to the familiar GitHub contribution view.

**Why this priority**: This gives visitors immediate evidence of ongoing development activity without requiring them to inspect repositories one by one.

**Independent Test**: Open the website as a visitor and confirm that the site shows a past-year GitHub contribution grid covering the owner's commit activity across repositories, or a clear unavailable state if contribution data cannot be shown.

**Acceptance Scenarios**:

1. **Given** past-year GitHub commit activity is available, **When** the relevant website section loads, **Then** the site displays the owner's commit activity for the past year in a calendar-style grid arranged by columns and rows.
2. **Given** the past year includes days with and without commits, **When** the contribution grid is displayed, **Then** each day is represented in the grid so visitors can distinguish active and inactive days.
3. **Given** GitHub contribution information is temporarily unavailable, **When** the relevant website section loads, **Then** the site shows a clear unavailable state instead of a blank or broken contribution grid.

---

### User Story 3 - Create An Account To Access Likes (Priority: P3)

A visitor wants to save their appreciation for projects. They can create an account, sign in on later visits, and access liking features without losing the browsing context that led them there.

**Why this priority**: Project likes require user identity to be meaningful and abuse-resistant, so account access is the foundation for the rest of the feature.

**Independent Test**: Starting as a signed-out visitor, create an account, sign out, sign back in, and confirm that the user can reach the same project-browsing experience with liking available.

**Acceptance Scenarios**:

1. **Given** a visitor does not yet have an account, **When** they complete account registration successfully, **Then** they can sign in and access project-like functionality.
2. **Given** a returning user already has an account, **When** they provide valid credentials, **Then** they are signed in successfully.
3. **Given** a visitor provides invalid sign-in details, **When** they attempt to log in, **Then** the site explains that the sign-in failed without removing the visitor from the project context they were viewing.

---

### User Story 4 - Like Projects From Cards And Detail Pages (Priority: P4)

An authenticated user wants to like projects wherever they discover them. They can like a project directly from a project card or from the project detail page, and the liked state stays consistent across both places.

**Why this priority**: The core interaction is the ability to express appreciation for projects without forcing the user into one specific page type or navigation path.

**Independent Test**: Sign in, like a project from a project card, verify the same project appears liked on its detail page, remove the like from either surface, and confirm the state updates consistently.

**Acceptance Scenarios**:

1. **Given** an authenticated user is browsing project cards, **When** they like a project from a card, **Then** that like is recorded for the selected project.
2. **Given** an authenticated user is on a project detail page, **When** they like the project from that page, **Then** that like is recorded for the selected project.
3. **Given** an authenticated user has already liked a project, **When** they view the same project from another supported surface, **Then** the project is shown as already liked there as well.
4. **Given** a signed-out visitor attempts to like a project from a card or detail page, **When** they activate the like control, **Then** the site asks them to sign in or create an account before the like is recorded.

### Edge Cases

- What happens when weather data for Enschede is delayed, missing, or temporarily unavailable? The site should show a clear unavailable state rather than stale, empty, or broken content.
- What happens when GitHub contribution data for part of the past year is delayed, incomplete, or temporarily unavailable? The site should show a clear unavailable or incomplete-data state rather than a misleading full-year contribution grid.
- What happens when some days in the past year have no commits? The contribution grid should still show those days so the calendar structure remains intact.
- What happens when a signed-out visitor attempts to like a project from a card or detail page? The site should direct them into authentication before any like is recorded.
- What happens when the same authenticated user activates the like control repeatedly for the same project? The site should prevent duplicate active likes from inflating the recorded total.
- What happens when a user removes a like from one surface and later views the same project on the other surface? The like state should remain consistent across both surfaces.
- What happens when a project is temporarily unavailable, unpublished, or cannot be loaded after a like action begins? The site should show a clear failure state and avoid recording a misleading like.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The personal website MUST display the current weather for Enschede, The Netherlands, on the main visitor experience.
- **FR-002**: The weather display MUST present the weather in a visitor-readable summary that includes the location context and current conditions.
- **FR-003**: When current weather information cannot be shown, the site MUST display a clear unavailable state instead of empty, broken, or misleading weather content.
- **FR-004**: The personal website MUST display the owner's GitHub commit activity for the previous 12 months across repositories included in the website's GitHub activity source.
- **FR-005**: The GitHub activity display MUST use a calendar-style grid arranged by columns and rows so visitors can scan activity by day, similar in structure to GitHub's contribution view.
- **FR-006**: The GitHub activity display MUST preserve the full past-year calendar structure, including days with no commits.
- **FR-007**: The site MUST display clear day-level activity states so visitors can distinguish days with more activity from days with less or no activity.
- **FR-008**: When GitHub contribution information cannot be shown, the site MUST display a clear unavailable state instead of empty, broken, or misleading contribution content.
- **FR-009**: The site MUST allow visitors to create an account for authenticated use.
- **FR-010**: The site MUST allow registered users to sign in on later visits and sign out when they choose.
- **FR-011**: The site MUST keep project browsing available to signed-out visitors, while reserving project-like actions for authenticated users.
- **FR-012**: When a signed-out visitor attempts to like a project, the site MUST require sign-in or account creation before recording the like.
- **FR-013**: Authenticated users MUST be able to like a project from a project card.
- **FR-014**: Authenticated users MUST be able to like a project from the corresponding project detail page.
- **FR-015**: The site MUST clearly show whether the current authenticated user has liked each project wherever a like control is presented.
- **FR-016**: A project's liked state for a user MUST remain consistent between project cards and the corresponding project detail page.
- **FR-017**: The system MUST prevent more than one active like per user account for the same project.
- **FR-018**: Authenticated users MUST be able to remove a previously added like from any supported like surface.
- **FR-019**: The site MUST preserve each project's recorded like total so that users see up-to-date like information wherever liking is shown.
- **FR-020**: After a successful authentication flow that started from a like attempt, the user MUST be returned to a meaningful project context so they can complete the intended action.
- **FR-021**: The site MUST provide clear feedback when account creation, sign-in, like, or unlike actions fail.

### Key Entities

- **Weather Snapshot**: The current weather summary shown for Enschede, including the location reference, current conditions, and the state indicating whether the weather is available.
- **GitHub Contribution Day**: A single calendar day in the past-year activity view, including whether any commits are represented for that day and the relative level of visible activity.
- **GitHub Contribution Grid**: The year-long columns-by-rows activity view that groups daily commit history into a calendar-style contribution pattern across the past 12 months.
- **User Account**: A visitor identity that can register, sign in, sign out, and own project-like actions.
- **Project**: A portfolio item that appears in project cards and has a dedicated detail page where liking can occur.
- **Project Like**: A single user's active appreciation state for a specific project, limited to one active like per user-project pair.

## Assumptions

- The weather feature is intended for the homepage or equivalent primary landing experience of the personal website.
- "Current weather" means a concise live summary that lets visitors understand Enschede's present conditions without leaving the site.
- The GitHub contribution view covers the most recent 12-month period and reflects commit activity from repositories represented in the website's GitHub activity source.
- A calendar-style contribution grid with columns and rows is an acceptable interpretation of the requested GitHub contribution component behavior.
- Browsing projects remains open to all visitors; authentication is only required for recording or removing likes.
- Each user account can hold at most one active like per project, and likes are reversible.
- Project cards and project detail pages are the only required entry points for liking within this feature scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability testing, first-time visitors can identify Enschede's current weather on the site within 5 seconds of reaching the homepage.
- **SC-002**: In 95% of sampled homepage visits where weather information is available, visitors see a current Enschede weather summary without needing a manual retry.
- **SC-003**: In usability testing, visitors can identify the GitHub contribution area and recognize it as a past-year activity view within 5 seconds of reaching that section.
- **SC-004**: In validation where GitHub activity data is available, 100% of tested renders show a complete past-year calendar-style contribution grid with day-by-day positions intact.
- **SC-005**: In validation, days with no commits remain visibly represented in the GitHub contribution grid in 100% of tested past-year views.
- **SC-006**: In usability testing, new users can create an account and complete sign-in in under 2 minutes.
- **SC-007**: In validation, 100% of signed-out like attempts route the visitor into authentication before any like is recorded.
- **SC-008**: In validation, authenticated users can like and remove likes successfully from both project cards and project detail pages in 100% of tested flows.
- **SC-009**: In validation, duplicate like attempts from the same authenticated account never increase a project's active likes beyond one like per user.
- **SC-010**: In validation, a project's liked state and displayed like information remain consistent across its card and detail page in 100% of tested flows.

# Feature Specification: Theme Selection And Mobile Anime Layout

**Feature Branch**: `002-theme-toggle-anime-layout`  
**Created**: 2026-03-25  
**Status**: Draft  
**Input**: User description: "Allow the user to select between dark and light theme modes. In mobile screens, the anime list should display one anime card per row, instead of trying to fit multiple animes cards in one row and shrinking them."

## Clarifications

### Session 2026-03-25

- Q: Are semantic theme variables and token mappings in `app/globals.css` acceptable under the project's Tailwind styling rules? → A: Yes, they are acceptable for this feature.
- Q: Does NavBar need a separate theme-refactor task beyond toggle integration? → A: No. Theme behavior is expected to work through the toggle integration and shared tokenized styling approach.
- Q: Does the current mobile-grid wording sufficiently cover the low-count anime layout requirement? → A: Yes. The current wording is sufficient.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose A Preferred Theme (Priority: P1)

A visitor wants control over how the site looks instead of relying only on device defaults. They can switch the site between light mode and dark mode, and the chosen appearance stays consistent while they browse.

**Why this priority**: User-controlled theming affects the entire browsing experience and immediately improves comfort and readability across the site.

**Independent Test**: Open the site, switch from one theme to the other, and confirm the site appearance updates consistently across the current page and remains selected while navigating to other pages.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site without a previously saved choice, **When** the page first loads, **Then** the site uses the visitor's current device appearance preference as the initial theme.
2. **Given** a visitor is viewing the site, **When** they select light mode, **Then** the page updates to the light theme and all visible sections use light-theme colors consistently.
3. **Given** a visitor is viewing the site, **When** they select dark mode, **Then** the page updates to the dark theme and all visible sections use dark-theme colors consistently.
4. **Given** a visitor has selected a theme, **When** they navigate to another page within the site or return later on the same device, **Then** the previously selected theme remains active.

---

### User Story 2 - Browse Anime Comfortably On Mobile (Priority: P2)

A visitor using a phone scrolls to the anime section and sees each anime item presented at a readable size. Instead of compressing several cards into a cramped row, the site presents one anime card per row on mobile screens.

**Why this priority**: The current mobile layout reduces readability and makes the anime section feel broken on smaller screens.

**Independent Test**: Open the landing page on a mobile-sized viewport and scroll to the anime section. Verify that each anime card occupies its own row, fits within the viewport, and remains readable without horizontal scrolling.

**Acceptance Scenarios**:

1. **Given** a visitor is on a mobile-sized screen, **When** they view the anime section, **Then** only one anime card is displayed per row.
2. **Given** a visitor is on a mobile-sized screen, **When** they view any anime card, **Then** the cover image and title remain readable without the card appearing compressed.
3. **Given** a visitor is on a tablet or desktop-sized screen, **When** they view the anime section, **Then** the layout may display multiple cards per row as long as the cards remain readable and evenly spaced.

---

### User Story 3 - Keep Supporting States Usable In Both Themes (Priority: P3)

A visitor encounters supporting content such as section headings, navigation, external activity cards, and empty states. Regardless of the chosen theme, these elements remain legible, visually coherent, and aligned with the rest of the site.

**Why this priority**: Theme support is incomplete if only the main surfaces switch correctly while secondary content becomes inconsistent or hard to read.

**Independent Test**: Switch between light and dark themes on the landing page and project pages, including states where anime or music data is unavailable, and confirm that headings, cards, links, and fallback messages remain visually coherent and readable.

**Acceptance Scenarios**:

1. **Given** a visitor has selected either theme, **When** they view the landing page, project listing pages, or project detail pages, **Then** text, backgrounds, borders, and interactive elements remain readable in that theme.
2. **Given** external activity data is unavailable, **When** fallback messages are shown, **Then** those messages follow the active theme and remain readable on all supported screen sizes.

### Edge Cases

- What happens when a visitor has never selected a theme before? The site should use the current device appearance preference until the visitor makes an explicit choice.
- What happens when a visitor switches themes and immediately navigates to another page? The selected theme should remain active without reverting unexpectedly.
- What happens when only one or two anime items are available? The anime section should still render one card per row on mobile without leaving broken gaps.
- What happens when an anime title is unusually long? The title should remain readable without pushing the card outside the viewport.
- What happens when the anime section falls back to a no-data message on mobile? The message should fit the viewport cleanly and not cause layout breakage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a user-visible control that allows visitors to choose between light mode and dark mode.
- **FR-002**: When no explicit theme choice has been made, the site MUST use the visitor's current device appearance preference as the initial theme.
- **FR-003**: When a visitor selects light mode or dark mode, the site MUST apply that theme across the full current page without requiring the visitor to reopen the site.
- **FR-004**: The selected theme MUST remain active while the visitor navigates between the landing page, domain project pages, and project detail pages.
- **FR-005**: The selected theme MUST be restored for returning visits on the same device and browser until the visitor changes it again.
- **FR-006**: Navigation, headings, cards, text, borders, links, and footer content MUST remain visually coherent and readable in both light mode and dark mode.
- **FR-007**: Fallback or empty states for the activity section MUST follow the active theme and remain readable.
- **FR-008**: On mobile-sized screens, the anime list MUST display exactly one anime card per row.
- **FR-009**: On mobile-sized screens, each anime card MUST fit within the viewport width without horizontal scrolling or visibly compressed content.
- **FR-010**: On non-mobile screens, the anime list MAY display multiple cards per row, provided each card remains readable and evenly spaced.
- **FR-011**: The anime list MUST handle between zero and five displayed items without broken spacing or incomplete rows that suggest missing content.
- **FR-012**: The theme-selection and anime-list layout changes MUST not reduce the readability or usability of the rest of the landing page.

### Key Entities

- **Theme Preference**: The visitor's currently selected site appearance option, limited to light mode or dark mode for explicit selection.
- **Anime Card**: A single anime item shown in the activity section, including cover art, title, and destination link.
- **Activity Section State**: The display state of the activity area, including populated content and fallback messaging when data is unavailable.

## Assumptions

- The site will continue to support only two explicit appearance choices for visitors: light mode and dark mode.
- If a visitor has not chosen a theme yet, using the device appearance preference is an acceptable default behavior.
- The anime section continues to show up to five items on the landing page; this feature changes layout behavior, not item count.
- "Mobile-sized screens" refers to phone-sized viewports where the current multi-column anime layout becomes cramped.
- The feature applies to the existing pages already present in the portfolio site and does not introduce new standalone pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability testing, first-time visitors can locate and use the theme control within 10 seconds of landing on the site.
- **SC-002**: In manual verification across the landing page, domain pages, and project detail pages, 100% of reviewed surfaces reflect the active theme consistently after a theme change.
- **SC-003**: On viewport widths from 320 px through 639 px, the anime section displays one card per row with no horizontal page scrolling.
- **SC-004**: On mobile-sized screens, every displayed anime card remains fully visible within the viewport and its title remains readable.
- **SC-005**: For returning visits on the same device and browser, the previously chosen theme is restored successfully in 100% of validation checks.

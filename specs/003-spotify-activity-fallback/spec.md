# Feature Specification: Spotify Activity Fallback And Playback Time

**Feature Branch**: `003-spotify-activity-fallback`  
**Created**: 2026-03-25  
**Status**: Draft  
**Input**: User description: "Update the spotify activity to display the currently playing song, if any, and fallback to the recently played song if none is playing. Also, update the spotify card to include the time it was played and the duration of the displayed track."

## Clarifications

### Session 2026-03-25

- Q: Should track duration be included in this feature? → A: Yes. The Spotify card should include the duration of whichever track is displayed, whether it is currently playing or recently played.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See What Is Playing Right Now (Priority: P1)

A visitor wants the Spotify activity card to reflect the most relevant listening activity. If a song is currently playing, the activity card shows that live track instead of older listening history.

**Why this priority**: Showing the current song gives the freshest and most meaningful activity signal, which is the main value of this feature.

**Independent Test**: Open the site while Spotify playback is active and verify that the card shows the currently playing track rather than an older recently played track.

**Acceptance Scenarios**:

1. **Given** a song is actively playing on Spotify, **When** the landing page loads the Spotify activity, **Then** the card displays the currently playing track as the primary listening activity.
2. **Given** a song is actively playing on Spotify and there is also recent listening history available, **When** the Spotify activity is displayed, **Then** the currently playing track takes precedence over the recent listening history.

---

### User Story 2 - Fall Back To Recent Listening Activity (Priority: P2)

A visitor still wants to see Spotify activity even when nothing is currently playing. If live playback is not active, the card falls back to the most recently played song instead of showing nothing.

**Why this priority**: The feature loses much of its value if the activity area becomes empty whenever playback is idle.

**Independent Test**: Open the site while no song is currently playing and verify that the card shows the most recently played track when one is available.

**Acceptance Scenarios**:

1. **Given** no song is currently playing and a recently played song exists, **When** the landing page loads the Spotify activity, **Then** the card displays the most recently played track.
2. **Given** no song is currently playing and no recent Spotify activity is available, **When** the landing page loads the Spotify activity, **Then** the site shows the existing no-activity fallback instead of an empty or broken card.

---

### User Story 3 - Understand When The Track Was Played (Priority: P3)

A visitor wants context for the Spotify activity they are seeing. The card includes a clear playback-time label so the visitor can tell whether the track is playing now or when it was last played.

**Why this priority**: A track title alone does not explain whether the activity is live or historical, which makes the card less informative.

**Independent Test**: View the Spotify activity in both live-playback and fallback states and confirm that the card includes a clear time context for the displayed track.

**Acceptance Scenarios**:

1. **Given** a song is currently playing, **When** the Spotify activity card is shown, **Then** the card includes a label that clearly indicates the track is playing now.
2. **Given** a recently played track is shown because nothing is currently playing, **When** the Spotify activity card is shown, **Then** the card includes the time that track was played in a human-readable format.

---

### User Story 4 - Understand How Long The Track Is (Priority: P4)

A visitor wants more context for the Spotify activity they are seeing. The card includes the duration of the displayed track so the visitor can understand how long the song is regardless of whether it is currently playing or recently played.

**Why this priority**: Duration gives additional context about the displayed track and completes the metadata shown on the Spotify card.

**Independent Test**: View the Spotify activity in both live-playback and fallback states and confirm that the card includes a readable duration label for the displayed track.

**Acceptance Scenarios**:

1. **Given** a song is currently playing, **When** the Spotify activity card is shown, **Then** the card includes the duration of the currently playing track in a human-readable format.
2. **Given** a recently played track is shown because nothing is currently playing, **When** the Spotify activity card is shown, **Then** the card includes the duration of that track in a human-readable format.

### Edge Cases

- What happens when Spotify reports no current playback and no recently played track? The activity section should continue to show a clear no-activity fallback state.
- What happens when the displayed track is missing album art, artist information, playback-time metadata, or duration metadata? The card should remain readable and avoid broken or misleading labels.
- What happens when Spotify activity changes between live playback and no playback across separate page visits or refreshes? The card should always show whichever state is most current at the time the page data is retrieved.
- What happens when the most recent track was played long ago? The card should still present the playback time clearly so visitors understand the activity is not live.
- What happens when the displayed track duration is unusually short or unusually long? The duration label should still be readable and formatted consistently.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display the currently playing Spotify track when an active playback session exists.
- **FR-002**: The currently playing track MUST take precedence over recently played history when both are available.
- **FR-003**: When no track is currently playing, the site MUST display the most recently played Spotify track if one is available.
- **FR-004**: When neither a currently playing track nor a recently played track is available, the Spotify activity area MUST show a clear fallback state rather than an incomplete or broken card.
- **FR-005**: The Spotify activity card MUST show the track title, artist, and artwork for whichever track is being displayed.
- **FR-006**: The Spotify activity card MUST include a playback-time label for the displayed track.
- **FR-007**: When the displayed track is currently playing, the playback-time label MUST clearly indicate that the track is live now rather than previously played.
- **FR-008**: When the displayed track comes from recent listening history, the playback-time label MUST show when the track was played in a human-readable format.
- **FR-009**: The Spotify activity card MUST include the duration of the displayed track in a human-readable format.
- **FR-010**: The displayed track duration MUST be shown for both currently playing tracks and recently played fallback tracks.
- **FR-011**: The Spotify activity card MUST remain visually coherent when optional track details are unavailable, without exposing raw errors or empty placeholder text.
- **FR-012**: The feature MUST preserve the existing landing-page structure and continue to present Spotify activity within the current activity section.

### Key Entities

- **Spotify Activity Item**: The single listening activity chosen for display, including whether it represents active playback or recent listening history.
- **Playback State**: The status that determines whether the displayed track is live now or a fallback from recent listening activity.
- **Playback Time Label**: The visitor-facing time context attached to the displayed track, such as a live-now label or a human-readable recently played time.
- **Track Duration Label**: The visitor-facing duration attached to the displayed track, shown in a human-readable format for both active and recent playback states.

## Assumptions

- The landing page continues to show one Spotify activity card at a time.
- If current playback exists, it is considered more valuable than recent listening history and should always be shown first.
- "Include the time it was played" means visitors should see a clear, human-readable time context for the displayed track rather than raw metadata.
- Track duration should be shown in a human-readable format rather than raw millisecond values.
- For actively playing tracks, a "playing now" style label is an acceptable replacement for a historical play time.
- This feature updates the existing Spotify activity presentation and does not add new pages, filters, or visitor controls.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation where a track is actively playing, the Spotify activity shows the current track instead of recent history in 100% of test runs.
- **SC-002**: In validation where no track is actively playing but recent listening history exists, the Spotify activity shows the most recent track in 100% of test runs.
- **SC-003**: In validation of both live and recent-history states, 100% of displayed Spotify cards include a clear time-context label.
- **SC-004**: In validation of both live and recent-history states, 100% of displayed Spotify cards include a readable duration label.
- **SC-005**: In manual review, visitors can determine within 5 seconds whether the displayed Spotify activity is live or historical and can identify the track duration.
- **SC-006**: In validation where Spotify activity data is partially missing or unavailable, the landing page continues to render without broken card layouts or exposed error text in 100% of test runs.

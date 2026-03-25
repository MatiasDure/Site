# Data Model: Spotify Activity Fallback And Playback Time

## Entity: SpotifyActivity

- Purpose: Represents the single Spotify activity item chosen for display in the landing-page activity section.
- Fields:
  - `name`: string. Required. Track title shown on the card.
  - `artist`: string. Required. Primary artist label shown on the card. Falls back to a readable placeholder when Spotify omits artist data.
  - `albumArt`: string. Required but may be an empty string when Spotify has no artwork URL.
  - `playbackState`: `"playing" | "recent"`. Required. Distinguishes active playback from fallback history.
  - `playedAt`: string | null. ISO timestamp for historical playback. Null when the track is actively playing and no historical play time is relevant.
  - `durationMs`: number | null. Duration of the displayed track in milliseconds when Spotify provides it.
  - `source`: `"currently-playing" | "recently-played"`. Required. Tracks which Spotify endpoint supplied the displayed item.
  - `playbackLabel`: string. Required. Visitor-facing label describing whether the track is live now or when it was played.
  - `durationLabel`: string | null. Visitor-facing duration formatted for display when duration metadata is available.
- Validation rules:
  - `name` must be non-empty before the item is considered displayable.
  - `artist` should resolve to the first available artist name, otherwise a readable fallback such as `Unknown artist`.
  - `playbackState = "playing"` implies `source = "currently-playing"`.
  - `playbackState = "recent"` should include `playedAt` when Spotify provides `played_at`.
  - `durationLabel` should be derived from `durationMs` and omitted when Spotify does not provide a usable duration value.

## Entity: SpotifyActivityResolution

- Purpose: Represents the helper-level resolution result before rendering.
- States:
  - `displayable`: a normalized `SpotifyActivity` is available.
  - `empty`: neither current playback nor recent playback yielded a displayable activity item.
- Resolution order:
  1. Request current playback.
  2. If an active track item exists, normalize it and return `displayable`.
  3. Otherwise request recently played history.
  4. If a recent track exists, normalize it and return `displayable`.
  5. Otherwise return `empty`.

## Entity: PlaybackTimeLabel

- Purpose: Represents the visitor-facing time context shown under the track metadata.
- Derived from:
  - `playbackState`
  - `playedAt`
- Output rules:
  - When `playbackState` is `"playing"`, render a live indicator such as `Playing now`.
  - When `playbackState` is `"recent"` and `playedAt` exists, render a human-readable time label based on the play timestamp.
  - When `playbackState` is `"recent"` but `playedAt` is unavailable, render a generic recent-activity fallback label instead of exposing raw null data.

## Relationships

- `SpotifyActivityResolution` may produce zero or one `SpotifyActivity`.
- `PlaybackTimeLabel` is derived from a `SpotifyActivity` and is not persisted independently.
- `TrackDurationLabel` is derived from a `SpotifyActivity` and is not persisted independently.

## Entity: TrackDurationLabel

- Purpose: Represents the visitor-facing duration shown with the displayed track metadata.
- Derived from:
  - `durationMs`
- Output rules:
  - When `durationMs` exists, render a human-readable duration such as `Duration 3:45`.
  - When `durationMs` is unavailable, omit the duration label without breaking the card layout.

## State Transitions

- `empty` -> `displayable (playing)`: occurs when Spotify reports active playback.
- `empty` -> `displayable (recent)`: occurs when no active playback exists but recent history is available.
- `displayable (playing)` -> `displayable (recent)`: occurs on later renders when playback stops and recent history becomes the fallback.
- `displayable (recent)` -> `displayable (playing)`: occurs on later renders when new active playback begins.
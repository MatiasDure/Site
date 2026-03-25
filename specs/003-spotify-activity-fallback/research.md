# Research: Spotify Activity Fallback And Playback Time

## Decision 1: Resolve Spotify activity by checking current playback before recent history

- Decision: Call Spotify's `GET /me/player/currently-playing` endpoint first and only call `GET /me/player/recently-played?limit=1` when there is no active track to display.
- Rationale: The feature's primary value is showing the freshest listening state. Spotify's current playback endpoint exposes whether something is actively playing via `is_playing` and returns the active item when available. Recently played history remains the correct fallback when the current playback endpoint returns no active track or no content.
- Alternatives considered:
  - Use only `recently-played`: rejected because it can surface stale history even while a track is playing now.
  - Use only `currently-playing`: rejected because the card would be empty whenever playback is idle.

## Decision 2: Normalize Spotify responses into one server-side activity model

- Decision: Convert both Spotify endpoint responses into a single typed activity shape in `app/lib/spotify.ts`, including playback source, playback state, played timestamp, and duration metadata.
- Rationale: `ActivitySection` and `SpotifyCard` should not need to understand two Spotify response schemas. A normalized model keeps UI logic simple, satisfies strict TypeScript requirements, and lets the card render one consistent interface regardless of whether the data came from active playback or recent history.
- Alternatives considered:
  - Pass raw Spotify responses into the component tree: rejected because it leaks transport details into presentation code and complicates null handling.
  - Keep separate `getCurrentlyPlaying()` and `getRecentlyPlayed()` component calls: rejected because the fallback rules would be split across components instead of enforced in one helper.

## Decision 3: Keep Spotify fetching in the existing server-side helper under ISR

- Decision: Continue fetching Spotify data from the existing `app/lib/spotify.ts` helper consumed by the home-page server component, without adding client-side fetching or a custom API route.
- Rationale: The home page already uses ISR with `revalidate = 600`, which is compatible with the project's static-first constitution. Keeping the integration server-side avoids exposing tokens to the browser, avoids new client JavaScript, and preserves the existing deployment model.
- Alternatives considered:
  - Add a Next.js route handler as a proxy: rejected because it introduces unnecessary runtime surface area for a feature already supported by server-side data helpers.
  - Fetch from the browser: rejected because Spotify credentials and refresh-token exchange must remain server-only.

## Decision 4: Require both Spotify scopes on the refresh token

- Decision: The Spotify refresh token used by the site must include both `user-read-currently-playing` and `user-read-recently-played` scopes.
- Rationale: The current implementation only requires recent-history access. This feature adds live playback precedence, which depends on the current playback scope. Using one token with both scopes keeps the integration simple and consistent.
- Alternatives considered:
  - Keep the current token scopes unchanged: rejected because current playback cannot be read reliably.
  - Use separate tokens per endpoint: rejected because it adds avoidable operational complexity for one account-level integration.

## Decision 5: Make track duration part of the normalized Spotify card metadata

- Decision: Include track duration in the normalized model and render it on the Spotify card for both active playback and recent-history fallback items.
- Rationale: The clarified feature scope now requires track duration for whichever track is displayed. Spotify exposes `duration_ms` on both the current playback track object and recently played track objects, so including it adds no extra endpoint cost and keeps the card metadata complete.
- Alternatives considered:
  - Carry duration only as hidden future-facing metadata: rejected because the current scope requires the card to display duration, not just store it.
  - Derive duration separately in the UI from raw Spotify payloads: rejected because it leaks transport concerns into presentation code and duplicates formatting logic.
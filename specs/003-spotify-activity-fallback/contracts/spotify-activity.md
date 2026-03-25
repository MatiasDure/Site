# Contract: Spotify Activity Integration

## Purpose

Define the external Spotify API touchpoints and the internal normalized contract used by the landing-page activity UI.

## External API Contract

### Token Exchange

- Endpoint: `POST https://accounts.spotify.com/api/token`
- Authentication: Basic auth with `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Form fields:
  - `grant_type=refresh_token`
  - `refresh_token=<SPOTIFY_REFRESH_TOKEN>`
- Required outcome: access token suitable for calling both player endpoints

### Current Playback Lookup

- Endpoint: `GET https://api.spotify.com/v1/me/player/currently-playing`
- Required scope: `user-read-currently-playing`
- Success conditions used by this feature:
  - `200 OK` with `is_playing = true` and a track item -> normalize as active playback
  - `204 No Content`, `item = null`, or `is_playing = false` -> treat as no active displayable playback and continue to recent history lookup
- Required fields consumed from Spotify:
  - `is_playing`
  - `item.name`
  - `item.artists[].name`
  - `item.album.images[].url`
  - `item.duration_ms`
  - `timestamp`

### Recently Played Lookup

- Endpoint: `GET https://api.spotify.com/v1/me/player/recently-played?limit=1`
- Required scope: `user-read-recently-played`
- Success conditions used by this feature:
  - First item exists -> normalize as recent playback fallback
  - No items -> return empty activity state
- Required fields consumed from Spotify:
  - `items[0].track.name`
  - `items[0].track.artists[].name`
  - `items[0].track.album.images[].url`
  - `items[0].track.duration_ms`
  - `items[0].played_at`

## Internal Data Contract

```ts
interface SpotifyActivity {
  name: string;
  artist: string;
  albumArt: string;
  playbackState: 'playing' | 'recent';
  playedAt: string | null;
  durationMs: number | null;
  source: 'currently-playing' | 'recently-played';
  playbackLabel: string;
  durationLabel: string | null;
}
```

## Behavioral Contract

1. The resolver must prefer current playback over recent history.
2. The resolver must return `null` when neither endpoint yields a displayable track.
3. The UI must treat `playbackState = 'playing'` as a live state and render a live-now time label.
4. The UI must treat `playbackState = 'recent'` as a historical state and render a human-readable played-time label.
5. The UI must render a human-readable duration label when Spotify provides track duration metadata.
6. Optional missing metadata must degrade gracefully without breaking layout or exposing raw errors.

## Operational Contract

- No Spotify credential or token data may be sent to the browser.
- No new route handlers or client-side polling are introduced for this feature.
- If the refresh token lacks one of the required scopes, the feature must fail gracefully to the existing empty state rather than breaking the page render.
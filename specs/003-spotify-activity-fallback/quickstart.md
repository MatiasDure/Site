# Quickstart: Spotify Activity Fallback And Playback Time

## Prerequisites

1. Ensure `.env.development` contains `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`.
2. Confirm the Spotify refresh token includes both `user-read-currently-playing` and `user-read-recently-played` scopes.
3. Install dependencies with `npm install` if they are not already present.

## Run The Site

1. Start the development server with `npm run dev`.
2. Open `http://localhost:3000`.
3. Scroll to the `Currently into` activity section.

## Validate Primary Scenarios

### Scenario 1: Active playback is shown first

1. Start playing a track on the connected Spotify account.
2. Refresh the home page.
3. Confirm the Spotify card shows the active track.
4. Confirm the card renders a live playback label such as `Playing now`.
5. Confirm the card renders a readable duration label for the active track.

### Scenario 2: Recent history is used as fallback

1. Stop playback on the Spotify account.
2. Refresh the home page.
3. Confirm the Spotify card shows the most recently played track.
4. Confirm the card renders a human-readable played-time label.
5. Confirm the card renders a readable duration label for the recent track.

### Scenario 3: Empty state remains stable

1. Use an account or token state with no accessible current playback and no recent history, or force both endpoint calls to resolve empty during local verification.
2. Refresh the home page.
3. Confirm the activity section shows the existing no-data fallback without layout breakage.

## Verification Gates

1. Run `npm run lint`.
2. Run `npm run build`.
3. Re-check the home page after both commands succeed.

## Notes

- If current playback never appears, regenerate the Spotify refresh token with the `user-read-currently-playing` scope added.
- If duration does not appear for a displayed track, confirm that Spotify is returning `duration_ms` for that item before treating it as an implementation defect.
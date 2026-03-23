import type { SpotifyTrack } from '@/app/types';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Spotify env vars not configured');
  }

  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function getRecentlyPlayed(): Promise<SpotifyTrack | null> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      items: Array<{
        track: {
          name: string;
          artists: Array<{ name: string }>;
          album: { images: Array<{ url: string }> };
        };
      }>;
    };

    const item = data.items?.[0];
    if (!item) return null;

    return {
      name: item.track.name,
      artist: item.track.artists[0]?.name ?? 'Unknown',
      albumArt: item.track.album.images[0]?.url ?? '',
    };
  } catch {
    return null;
  }
}

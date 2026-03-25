import type { SpotifyActivitySource, SpotifyPlaybackState, SpotifyTrack } from '@/app/types';

import {
  SPOTIFY_CURRENTLY_PLAYING_ENDPOINT,
  SPOTIFY_DURATION_PREFIX,
  SPOTIFY_FETCH_REVALIDATE_SECONDS,
  SPOTIFY_PLAYING_NOW_LABEL,
  SPOTIFY_RECENTLY_PLAYED_ENDPOINT,
  SPOTIFY_RECENTLY_PLAYED_LABEL,
  SPOTIFY_TOKEN_ENDPOINT,
  SPOTIFY_UNKNOWN_ARTIST,
} from './spotify.constants';

interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  images: SpotifyImage[];
}

interface SpotifyTrackItem {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms?: number;
  name: string;
  type?: string;
}

interface SpotifyCurrentlyPlayingResponse {
  currently_playing_type?: string;
  is_playing: boolean;
  item: SpotifyTrackItem | null;
}

interface SpotifyRecentlyPlayedResponse {
  items: Array<{
    played_at: string;
    track: SpotifyTrackItem;
  }>;
}

interface SpotifyAccessTokenResponse {
  access_token: string;
}

async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Spotify env vars not configured');
  }

  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    next: { revalidate: SPOTIFY_FETCH_REVALIDATE_SECONDS },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  const data = (await response.json()) as SpotifyAccessTokenResponse;
  return data.access_token;
}

function getArtistLabel(artists: SpotifyArtist[]): string {
  return artists[0]?.name ?? SPOTIFY_UNKNOWN_ARTIST;
}

function getAlbumArt(images: SpotifyImage[]): string {
  return images[0]?.url ?? '';
}

function formatPlaybackLabel(playbackState: SpotifyPlaybackState, playedAt: string | null): string {
  if (playbackState === 'playing') {
    return SPOTIFY_PLAYING_NOW_LABEL;
  }

  if (!playedAt) {
    return SPOTIFY_RECENTLY_PLAYED_LABEL;
  }

  const playedDate = new Date(playedAt);
  if (Number.isNaN(playedDate.getTime())) {
    return SPOTIFY_RECENTLY_PLAYED_LABEL;
  }

  const formattedTime = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(playedDate);

  return `Played ${formattedTime}`;
}

function formatDurationLabel(durationMs: number | null): string | null {
  if (durationMs === null || durationMs < 0) {
    return null;
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${SPOTIFY_DURATION_PREFIX} ${minutes}:${seconds}`;
}

function createSpotifyTrack(
  track: SpotifyTrackItem,
  playbackState: SpotifyPlaybackState,
  source: SpotifyActivitySource,
  playedAt: string | null,
): SpotifyTrack | null {
  if (!track.name) {
    return null;
  }

  return {
    name: track.name,
    artist: getArtistLabel(track.artists),
    albumArt: getAlbumArt(track.album.images),
    playbackState,
    playedAt,
    durationMs: track.duration_ms ?? null,
    source,
    playbackLabel: formatPlaybackLabel(playbackState, playedAt),
    durationLabel: formatDurationLabel(track.duration_ms ?? null),
  };
}

async function fetchSpotifyResource(accessToken: string, endpoint: string): Promise<Response> {
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: SPOTIFY_FETCH_REVALIDATE_SECONDS },
  });
}

async function getCurrentlyPlaying(accessToken: string): Promise<SpotifyTrack | null> {
  const response = await fetchSpotifyResource(accessToken, SPOTIFY_CURRENTLY_PLAYING_ENDPOINT);

  if (response.status === 204 || !response.ok) {
    return null;
  }

  const data = (await response.json()) as SpotifyCurrentlyPlayingResponse;
  if (!data.is_playing || data.currently_playing_type !== 'track' || !data.item) {
    return null;
  }

  return createSpotifyTrack(data.item, 'playing', 'currently-playing', null);
}

async function getMostRecentlyPlayed(accessToken: string): Promise<SpotifyTrack | null> {
  const response = await fetchSpotifyResource(accessToken, SPOTIFY_RECENTLY_PLAYED_ENDPOINT);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as SpotifyRecentlyPlayedResponse;
  const item = data.items?.[0];

  if (!item) {
    return null;
  }

  return createSpotifyTrack(item.track, 'recent', 'recently-played', item.played_at);
}

export async function getSpotifyActivity(): Promise<SpotifyTrack | null> {
  try {
    const accessToken = await getAccessToken();
    const currentlyPlaying = await getCurrentlyPlaying(accessToken);

    if (currentlyPlaying) {
      return currentlyPlaying;
    }

    return await getMostRecentlyPlayed(accessToken);
  } catch (ex) {
    console.error((ex as Error).message);
    return null;
  }
}

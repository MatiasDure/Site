export type SpotifyPlaybackState = 'playing' | 'recent';

export type SpotifyActivitySource = 'currently-playing' | 'recently-played';

export interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt: string;
  playbackState: SpotifyPlaybackState;
  playedAt: string | null;
  durationMs: number | null;
  source: SpotifyActivitySource;
  playbackLabel: string;
  durationLabel: string | null;
}

export interface AnimeEntry {
  title: string;
  url: string;
  imageUrl: string;
}

import {
  getFavoriteAnime,
  getGitHubContributionGrid,
  getSpotifyActivity,
  getWeatherSnapshot,
} from '@/app/lib';

import { SPOTIFY_ACTIVITY_HEADING, SPOTIFY_EMPTY_STATE_LABEL } from '@/app/lib/spotify.constants';
import AnimeCard from './AnimeCard';
import GitHubActivityGraph from './GitHubActivityGraph';
import SpotifyCard from './SpotifyCard';
import WeatherCard from './WeatherCard';

export default async function ActivitySection() {
  const [track, animeEntries, weatherSnapshot, githubContributionGrid] = await Promise.all([
    getSpotifyActivity(),
    getFavoriteAnime(),
    getWeatherSnapshot(),
    getGitHubContributionGrid(),
  ]);

  const topAnime = animeEntries.slice(0, 5);

  return (
    <section className="py-8" aria-labelledby="activity-heading">
      <h2
        id="activity-heading"
        className="mb-5 text-xl font-semibold text-foreground"
      >
        Current activity
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Enschede weather
          </h3>
          <WeatherCard snapshot={weatherSnapshot} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {SPOTIFY_ACTIVITY_HEADING}
          </h3>
          {track ? (
            <SpotifyCard track={track} />
          ) : (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-muted-foreground">{SPOTIFY_EMPTY_STATE_LABEL}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          GitHub activity
        </h3>
        {githubContributionGrid.status === 'available' ? (
          <GitHubActivityGraph grid={githubContributionGrid} />
        ) : (
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm text-muted-foreground">
              {githubContributionGrid.message}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Favourite Anime
        </h3>
        {topAnime.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {topAnime.map((entry) => (
              <AnimeCard key={entry.url} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="max-w-xl text-sm text-muted-foreground">
            No anime data available.
          </p>
        )}
      </div>
    </section>
  );
}

import { getFavoriteAnime, getSpotifyActivity } from '@/app/lib';

import { SPOTIFY_ACTIVITY_HEADING, SPOTIFY_EMPTY_STATE_LABEL } from '@/app/lib/spotify.constants';
import SpotifyCard from './SpotifyCard';
import AnimeCard from './AnimeCard';

export default async function ActivitySection() {
  const [track, animeEntries] = await Promise.all([
    getSpotifyActivity(),
    getFavoriteAnime(),
  ]);

  const topAnime = animeEntries.slice(0, 5);

  return (
    <section className="py-8" aria-labelledby="activity-heading">
      <h2
        id="activity-heading"
        className="mb-5 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
      >
        Currently into
      </h2>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {SPOTIFY_ACTIVITY_HEADING}
        </h3>
        {track ? (
          <SpotifyCard track={track} />
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {SPOTIFY_EMPTY_STATE_LABEL}
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Favourite Anime
        </h3>
        {topAnime.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {topAnime.map((entry) => (
              <AnimeCard key={entry.url} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No anime data available.
          </p>
        )}
      </div>
    </section>
  );
}

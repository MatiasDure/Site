import Image from 'next/image';
import type { AnimeEntry } from '@/app/types';

interface AnimeCardProps {
  entry: AnimeEntry;
}

export default function AnimeCard({ entry }: AnimeCardProps) {
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${entry.title} — view on MyAnimeList`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <Image
          src={entry.imageUrl}
          alt={`Cover art for ${entry.title}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 150px"
        />
      </div>
      <div className="p-2">
        <p className="line-clamp-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {entry.title}
        </p>
      </div>
    </a>
  );
}

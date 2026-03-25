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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface-muted sm:aspect-2/3">
        <Image
          src={entry.imageUrl}
          alt={`Cover art for ${entry.title}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 25vw, 20vw"
        />
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-foreground sm:text-xs">
          {entry.title}
        </p>
      </div>
    </a>
  );
}

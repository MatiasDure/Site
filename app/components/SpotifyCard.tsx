import Image from 'next/image';
import type { SpotifyTrack } from '@/app/types';

interface SpotifyCardProps {
  track: SpotifyTrack;
}

export default function SpotifyCard({ track }: SpotifyCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={track.albumArt}
          alt={`Album art for ${track.name}`}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{track.name}</p>
        <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{track.artist}</p>
      </div>
    </div>
  );
}

import Image from 'next/image';
import type { SpotifyTrack } from '@/app/types';

interface SpotifyCardProps {
  track: SpotifyTrack;
}

export default function SpotifyCard({ track }: SpotifyCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
        <Image
          src={track.albumArt}
          alt={`Album art for ${track.name}`}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{track.name}</p>
        <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{track.playbackLabel}</span>
          {track.durationLabel ? <span>{track.durationLabel}</span> : null}
        </div>
      </div>
    </div>
  );
}

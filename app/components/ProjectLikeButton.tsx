'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';
import { toggleProjectLikeAction } from '@/app/lib/likes.actions';

interface ProjectLikeButtonProps {
  authEnabled: boolean;
  className?: string;
  initialLikedByViewer?: boolean;
  initialTotalLikes?: number;
  isAuthenticated: boolean;
  projectId: string;
}

function buildCurrentLocation(pathname: string, searchParams: ReadonlyURLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function ProjectLikeButton({
  authEnabled,
  className,
  initialLikedByViewer = false,
  initialTotalLikes = 0,
  isAuthenticated,
  projectId,
}: ProjectLikeButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLiked, setIsLiked] = useState(initialLikedByViewer);
  const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setErrorMessage(null);

    if (!authEnabled) {
      setErrorMessage('Likes are unavailable until Google auth is configured.');
      return;
    }

    if (!isAuthenticated) {
      const callbackUrl = buildCurrentLocation(pathname, searchParams);

      startTransition(() => {
        void signIn('google', { callbackUrl });
      });
      return;
    }

    startTransition(() => {
      void toggleProjectLikeAction(projectId)
        .then((result) => {
          setIsLiked(result.likedByViewer);
          setTotalLikes(result.totalLikes);
          router.refresh();
        })
        .catch((error: unknown) => {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to update your like right now.',
          );
        });
    });
  }

  return (
    <div className={['flex flex-col items-start gap-1', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isLiked}
        className={[
          'inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
          isLiked ? 'bg-accent text-accent-foreground hover:opacity-90' : 'hover:bg-surface-muted',
        ].join(' ')}
      >
        <span>{isPending ? 'Updating...' : isLiked ? 'Liked' : 'Like'}</span>
        <span className={isLiked ? 'text-accent-foreground/90' : 'text-muted-foreground'}>
          {totalLikes}
        </span>
      </button>
      {errorMessage ? <p className="text-xs text-muted-foreground">{errorMessage}</p> : null}
    </div>
  );
}
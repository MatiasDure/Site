'use client';

import { useTransition } from 'react';
import {
  usePathname,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';

type GoogleSignInButtonMode = 'signin' | 'signout';

interface GoogleSignInButtonProps {
  callbackUrl?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  mode?: GoogleSignInButtonMode;
}

function getDefaultLabel(mode: GoogleSignInButtonMode) {
  return mode === 'signout' ? 'Sign out' : 'Sign in with Google';
}

function getPendingLabel(mode: GoogleSignInButtonMode) {
  return mode === 'signout' ? 'Signing out...' : 'Redirecting...';
}

function buildCurrentLocation(pathname: string, searchParams: ReadonlyURLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function GoogleSignInButton({
  callbackUrl,
  className,
  disabled = false,
  label,
  mode = 'signin',
}: GoogleSignInButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const resolvedCallbackUrl = callbackUrl ?? buildCurrentLocation(pathname, searchParams);

  function handleClick() {
    startTransition(() => {
      if (mode === 'signout') {
        void signOut({ callbackUrl: resolvedCallbackUrl });
        return;
      }

      void signIn('google', { callbackUrl: resolvedCallbackUrl });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className={[
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
        'border border-border bg-surface text-foreground hover:bg-surface-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPending ? getPendingLabel(mode) : (label ?? getDefaultLabel(mode))}
    </button>
  );
}
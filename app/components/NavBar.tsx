import Link from 'next/link';
import GoogleSignInButton from '@/app/components/auth/GoogleSignInButton';
import { getAppSession, isGoogleAuthConfigured } from '@/app/lib/session';
import ThemeToggle from './ThemeToggle';

const DOMAIN_LABELS: Record<string, string> = {
  web: 'Web',
  app: 'App',
  game: 'Game',
  embedded: 'Embedded',
};

function getUserInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'M';
}

export default async function NavBar() {
  const session = await getAppSession();

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="font-bold text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Matias
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ul className="flex items-center gap-1" role="list">
            {Object.entries(DOMAIN_LABELS).map(([domain, label]) => (
              <li key={domain}>
                <Link
                  href={`/projects/${domain}`}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {session.isAuthenticated && session.user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-3 rounded-lg border border-border bg-surface px-3 py-1.5 sm:flex">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent-foreground">
                  {getUserInitial(session.user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{session.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <GoogleSignInButton mode="signout" />
            </div>
          ) : isGoogleAuthConfigured ? (
            <GoogleSignInButton />
          ) : (
            <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
              Auth unavailable
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

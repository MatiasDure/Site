import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const DOMAIN_LABELS: Record<string, string> = {
  web: 'Web',
  app: 'App',
  game: 'Game',
  embedded: 'Embedded',
};

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-bold text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Matias
        </Link>
        <div className="flex items-center gap-3">
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

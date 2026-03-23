import Link from 'next/link';

const DOMAIN_LABELS: Record<string, string> = {
  web: 'Web',
  app: 'App',
  game: 'Game',
  embedded: 'Embedded',
};

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-bold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Matias
        </Link>
        <ul className="flex items-center gap-1" role="list">
          {Object.entries(DOMAIN_LABELS).map(([domain, label]) => (
            <li key={domain}>
              <Link
                href={`/projects/${domain}`}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

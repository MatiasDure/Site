import Link from 'next/link';
import { getAllProjects } from '@/app/lib';
import { getAppSession } from '@/app/lib/session';
import { ProjectCard } from '@/app/components';
import type { Domain } from '@/app/types';

const DOMAINS: Domain[] = ['web', 'app', 'game', 'embedded'];

const DOMAIN_LABELS: Record<Domain, string> = {
  web: 'Web Development',
  app: 'App Development',
  game: 'Game Development',
  embedded: 'Embedded Systems',
};

export function generateStaticParams() {
  return DOMAINS.map((domain) => ({ domain }));
}

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainProjectsPage({ params }: PageProps) {
  const { domain } = await params;
  const typedDomain = domain as Domain;
  const session = await getAppSession();

  const projects = await getAllProjects(typedDomain, session.user?.id ?? null);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 text-foreground">
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          &larr; Home
        </Link>
        <span className="text-border" aria-hidden="true">/</span>
        <h1 className="text-2xl font-bold text-foreground">
          {DOMAIN_LABELS[typedDomain]}
        </h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">
          No projects yet in this domain. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              domain={typedDomain}
              isAuthenticated={session.isAuthenticated}
            />
          ))}
        </div>
      )}
    </main>
  );
}

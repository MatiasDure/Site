import Link from 'next/link';
import { getAllProjects } from '@/app/lib';
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

  const projects = await getAllProjects(typedDomain);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          &larr; Home
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">/</span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {DOMAIN_LABELS[typedDomain]}
        </h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No projects yet in this domain. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} domain={typedDomain} />
          ))}
        </div>
      )}
    </main>
  );
}

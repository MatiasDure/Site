import Link from 'next/link';
import type { Domain, Project } from '@/app/types';
import ProjectCard from './ProjectCard';

const DOMAIN_LABELS: Record<Domain, string> = {
  web: 'Web Development',
  app: 'App Development',
  game: 'Game Development',
  embedded: 'Embedded Systems',
};

interface DomainSectionProps {
  domain: Domain;
  featuredProjects: Project[];
}

export default function DomainSection({ domain, featuredProjects }: DomainSectionProps) {
  return (
    <section className="py-8" aria-labelledby={`heading-${domain}`}>
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id={`heading-${domain}`}
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {DOMAIN_LABELS[domain]}
        </h2>
        <Link
          href={`/projects/${domain}`}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          View all projects &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} domain={domain} />
        ))}
      </div>
    </section>
  );
}

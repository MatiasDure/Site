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
  isAuthenticated?: boolean;
}

export default function DomainSection({
  domain,
  featuredProjects,
  isAuthenticated = false,
}: DomainSectionProps) {
  return (
    <section className="py-8" aria-labelledby={`heading-${domain}`}>
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id={`heading-${domain}`}
          className="text-xl font-semibold text-foreground"
        >
          {DOMAIN_LABELS[domain]}
        </h2>
        <Link
          href={`/projects/${domain}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View all projects &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            domain={domain}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </section>
  );
}

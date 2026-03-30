import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllProjects, getProject } from '@/app/lib';
import ProjectLikeButton from '@/app/components/ProjectLikeButton';
import { getAppSession, isGoogleAuthConfigured } from '@/app/lib/session';
import type { Domain } from '@/app/types';

const DOMAIN_LABELS: Record<Domain, string> = {
  web: 'Web Development',
  app: 'App Development',
  game: 'Game Development',
  embedded: 'Embedded Systems',
};

const DOMAINS: Domain[] = ['web', 'app', 'game', 'embedded'];

export async function generateStaticParams() {
  const projects = await Promise.all(
    DOMAINS.map(async (domain) => {
      const all = await getAllProjects(domain);
      return all.map((p) => ({ domain, slug: p.slug }));
    })
  );
  return projects.flat();
}

interface PageProps {
  params: Promise<{ domain: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = await params;
  const project = await getProject(domain as Domain, slug);
  return {
    title: `${project.title} — Matias`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { domain, slug } = await params;
  const typedDomain = domain as Domain;
  const session = await getAppSession();
  const project = await getProject(typedDomain, slug, session.user?.id ?? null);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 text-foreground">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/projects/${typedDomain}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          &larr; {DOMAIN_LABELS[typedDomain]}
        </Link>
      </div>

      <article>
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={project.coverImage}
            alt={`Cover image for ${project.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>

        <p className="mt-3 text-lg text-muted-foreground">
          {project.description}
        </p>

        {project.id ? (
          <div className="mt-5">
            <ProjectLikeButton
              authEnabled={isGoogleAuthConfigured}
              initialLikedByViewer={project.likedByViewer}
              initialTotalLikes={project.totalLikes}
              isAuthenticated={session.isAuthenticated}
              projectId={project.id}
            />
          </div>
        ) : null}

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-muted px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Live Demo
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View Source
            </a>
          )}
        </div>

        <div
          className="prose mt-10 max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-accent prose-code:text-foreground prose-pre:border prose-pre:border-border prose-pre:bg-surface prose-blockquote:border-border prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: project.htmlBody }}
        />
      </article>
    </main>
  );
}

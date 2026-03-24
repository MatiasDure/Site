import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllProjects, getProject } from '@/app/lib';
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
  const project = await getProject(typedDomain, slug);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/projects/${typedDomain}`}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          &larr; {DOMAIN_LABELS[typedDomain]}
        </Link>
      </div>

      <article>
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={project.coverImage}
            alt={`Cover image for ${project.title}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h1>

        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
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
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Live Demo
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              View Source
            </a>
          )}
        </div>

        <div
          className="prose prose-zinc mt-10 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: project.htmlBody }}
        />
      </article>
    </main>
  );
}

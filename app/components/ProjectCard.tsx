import Link from 'next/link';
import Image from 'next/image';
import type { Domain, Project } from '@/app/types';

interface ProjectCardProps {
  project: Project;
  domain: Domain;
}

export default function ProjectCard({ project, domain }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${domain}/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
      aria-label={`View details for ${project.title}`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <Image
          src={project.coverImage}
          alt={`Cover image for ${project.title}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

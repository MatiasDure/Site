import Link from 'next/link';
import Image from 'next/image';
import { isGoogleAuthConfigured } from '@/app/lib/session';
import type { Domain, Project } from '@/app/types';
import ProjectLikeButton from './ProjectLikeButton';

interface ProjectCardProps {
  isAuthenticated?: boolean;
  project: Project;
  domain: Domain;
}

export default function ProjectCard({ project, domain, isAuthenticated = false }: ProjectCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md">
      <Link
        href={`/projects/${domain}/${project.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`View details for ${project.title}`}
      >
        <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
          <Image
            src={project.coverImage}
            alt={`Cover image for ${project.title}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
          {project.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1 pt-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      {project.id ? (
        <div className="border-t border-border px-4 py-3">
          <ProjectLikeButton
            authEnabled={isGoogleAuthConfigured}
            initialLikedByViewer={project.likedByViewer}
            initialTotalLikes={project.totalLikes}
            isAuthenticated={isAuthenticated}
            projectId={project.id}
          />
        </div>
      ) : null}
    </article>
  );
}

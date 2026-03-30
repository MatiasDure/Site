import { getProjectLikeSnapshots } from '@/app/lib/likes';
import { getMarkdownProject, getMarkdownProjects } from '@/app/lib/project-content';
import { getProjectId } from '@/app/lib/project-sync';
import type { Domain, Project } from '@/app/types';
async function attachProjectLikes(projects: Project[], viewerUserId: string | null) {
  if (projects.length === 0) {
    return projects;
  }

  const projectsWithIds = projects.map((project) => ({
    ...project,
    id: project.id ?? getProjectId(project.domain, project.slug),
  }));

  const likeSnapshots = await getProjectLikeSnapshots(
    projectsWithIds.map((project) => project.id as string),
    viewerUserId,
  );

  return projectsWithIds.map((project) => {
    const snapshot = likeSnapshots.get(project.id as string);

    return {
      ...project,
      totalLikes: snapshot?.totalLikes ?? 0,
      likedByViewer: snapshot?.likedByViewer ?? false,
    };
  });
}

export async function getAllProjects(domain?: Domain, viewerUserId: string | null = null): Promise<Project[]> {
  const projects = await getMarkdownProjects(domain);
  return attachProjectLikes(projects, viewerUserId);
}

export async function getProject(
  domain: Domain,
  slug: string,
  viewerUserId: string | null = null,
): Promise<Project> {
  const project = await getMarkdownProject(domain, slug);
  const [projectWithLikes] = await attachProjectLikes([project], viewerUserId);
  return projectWithLikes;
}

export async function getFeaturedProjects(
  domain: Domain,
  viewerUserId: string | null = null,
): Promise<Project[]> {
  const all = await getAllProjects(domain, viewerUserId);
  return all.filter((p) => p.featured).slice(0, 3);
}

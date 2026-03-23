import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { Domain, Project } from '@/app/types';

const PROJECTS_ROOT = path.join(process.cwd(), 'projects');

async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content);
  return String(result);
}

async function readProjectFile(domain: Domain, filename: string): Promise<Project> {
  const filePath = path.join(PROJECTS_ROOT, domain, filename);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.md$/, '');
  const htmlBody = await markdownToHtml(content);

  return {
    slug,
    domain,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    coverImage: String(data.coverImage ?? '/images/projects/placeholder.png'),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: Boolean(data.featured),
    demo: data.demo ? String(data.demo) : undefined,
    repo: data.repo ? String(data.repo) : undefined,
    htmlBody,
  };
}

export async function getAllProjects(domain?: Domain): Promise<Project[]> {
  const domains: Domain[] = domain ? [domain] : ['web', 'app', 'game', 'embedded'];

  const projectsPerDomain = await Promise.all(
    domains.map(async (d) => {
      const dir = path.join(PROJECTS_ROOT, d);
      let files: string[];
      try {
        files = await fs.readdir(dir);
      } catch {
        return [];
      }
      const mdFiles = files.filter((f) => f.endsWith('.md'));
      return Promise.all(mdFiles.map((f) => readProjectFile(d, f)));
    })
  );

  return projectsPerDomain.flat();
}

export async function getProject(domain: Domain, slug: string): Promise<Project> {
  return readProjectFile(domain, `${slug}.md`);
}

export async function getFeaturedProjects(domain: Domain): Promise<Project[]> {
  const all = await getAllProjects(domain);
  return all.filter((p) => p.featured).slice(0, 3);
}

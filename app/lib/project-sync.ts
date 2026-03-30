import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import { getMarkdownProjects } from '@/app/lib/project-content';
import type { Domain, PersistedProjectRecord, Project } from '@/app/types';
import { getDatabase } from '@/db/client';

const PROJECTS_ROOT = path.join(process.cwd(), 'projects');
const PROJECT_DOMAINS: Domain[] = ['web', 'app', 'game', 'embedded'];

let lastManifest: string | null = null;
let lastProjectCount = 0;
let activeSynchronization: Promise<ProjectSyncResult> | null = null;

export interface ProjectSyncResult {
  manifest: string;
  projectCount: number;
  synchronized: boolean;
}

interface ProjectFileEntry {
  domain: Domain;
  fileName: string;
  relativePath: string;
  size: number;
  mtimeMs: number;
}

function createProjectId(domain: Domain, slug: string) {
  return `project:${domain}/${slug}`;
}

function mapProjectToPersistedRecord(project: Project): PersistedProjectRecord {
  return {
    id: createProjectId(project.domain, project.slug),
    domain: project.domain,
    slug: project.slug,
    title: project.title,
    description: project.description,
    featured: project.featured,
    tags: project.tags,
    imageUrl: project.coverImage,
    demoUrl: project.demo ?? null,
    repoUrl: project.repo ?? null,
    htmlBody: project.htmlBody,
  };
}

async function collectProjectFileEntries() {
  const entries = await Promise.all(
    PROJECT_DOMAINS.map(async (domain) => {
      const domainDirectory = path.join(PROJECTS_ROOT, domain);

      try {
        const files = await fs.readdir(domainDirectory);
        const markdownFiles = files.filter((fileName) => fileName.endsWith('.md')).sort();

        return Promise.all(
          markdownFiles.map(async (fileName) => {
            const filePath = path.join(domainDirectory, fileName);
            const fileStats = await fs.stat(filePath);

            return {
              domain,
              fileName,
              relativePath: `${domain}/${fileName}`,
              size: fileStats.size,
              mtimeMs: fileStats.mtimeMs,
            } satisfies ProjectFileEntry;
          })
        );
      } catch {
        return [] as ProjectFileEntry[];
      }
    })
  );

  return entries.flat().sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

async function buildManifest() {
  const projectFiles = await collectProjectFileEntries();

  return projectFiles
    .map((entry) => `${entry.relativePath}:${entry.size}:${Math.trunc(entry.mtimeMs)}`)
    .join('|');
}

function synchronizeRecords(records: PersistedProjectRecord[]) {
  const database = getDatabase();
  const now = new Date().toISOString();
  const upsertProject = database.prepare(`
    INSERT INTO Project (
      id,
      domain,
      slug,
      source_path,
      title,
      description,
      featured,
      tags_json,
      image_url,
      demo_url,
      repo_url,
      html_body,
      synced_at,
      updated_at
    )
    VALUES (
      @id,
      @domain,
      @slug,
      @sourcePath,
      @title,
      @description,
      @featured,
      @tagsJson,
      @imageUrl,
      @demoUrl,
      @repoUrl,
      @htmlBody,
      @syncedAt,
      @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      domain = excluded.domain,
      slug = excluded.slug,
      source_path = excluded.source_path,
      title = excluded.title,
      description = excluded.description,
      featured = excluded.featured,
      tags_json = excluded.tags_json,
      image_url = excluded.image_url,
      demo_url = excluded.demo_url,
      repo_url = excluded.repo_url,
      html_body = excluded.html_body,
      synced_at = excluded.synced_at,
      updated_at = excluded.updated_at
  `);

  const runSynchronization = database.transaction((persistedProjects: PersistedProjectRecord[]) => {
    for (const project of persistedProjects) {
      upsertProject.run({
        id: project.id,
        domain: project.domain,
        slug: project.slug,
        sourcePath: `${project.domain}/${project.slug}.md`,
        title: project.title,
        description: project.description,
        featured: project.featured ? 1 : 0,
        tagsJson: JSON.stringify(project.tags),
        imageUrl: project.imageUrl,
        demoUrl: project.demoUrl,
        repoUrl: project.repoUrl,
        htmlBody: project.htmlBody,
        syncedAt: now,
        updatedAt: now,
      });
    }
  });

  runSynchronization(records);
}

async function runSynchronization(manifest: string): Promise<ProjectSyncResult> {
  const projects = await getMarkdownProjects();
  const persistedRecords = projects.map(mapProjectToPersistedRecord);

  synchronizeRecords(persistedRecords);
  lastManifest = manifest;
  lastProjectCount = persistedRecords.length;

  return {
    manifest,
    projectCount: persistedRecords.length,
    synchronized: true,
  };
}

export async function syncProjectsToDatabase(options: { force?: boolean } = {}): Promise<ProjectSyncResult> {
  const manifest = await buildManifest();

  if (!options.force && manifest === lastManifest) {
    return {
      manifest,
      projectCount: lastProjectCount,
      synchronized: false,
    };
  }

  if (activeSynchronization) {
    return activeSynchronization;
  }

  activeSynchronization = runSynchronization(manifest).finally(() => {
    activeSynchronization = null;
  });

  return activeSynchronization;
}

export function getProjectId(domain: Domain, slug: string) {
  return createProjectId(domain, slug);
}
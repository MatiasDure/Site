import 'server-only';

import { syncProjectsToDatabase } from '@/app/lib/project-sync';
import { getDatabase } from '@/db/client';
import type { ProjectLikeSnapshot } from '@/app/types';

interface LikeCountRow {
  project_id: string;
  total_likes: number;
}

interface LikeViewerRow {
  project_id: string;
}

function createDefaultSnapshot(projectId: string): ProjectLikeSnapshot {
  return {
    projectId,
    totalLikes: 0,
    likedByViewer: false,
  };
}

function createPlaceholders(values: string[]) {
  return values.map(() => '?').join(', ');
}

async function ensureProjectExists(projectId: string) {
  await syncProjectsToDatabase();

  const database = getDatabase();
  const project = database
    .prepare('SELECT id FROM Project WHERE id = ? LIMIT 1')
    .get(projectId) as { id: string } | undefined;

  if (!project) {
    throw new Error('Project likes are unavailable for this project right now.');
  }
}

export async function getProjectLikeSnapshots(
  projectIds: string[],
  viewerUserId: string | null = null,
): Promise<Map<string, ProjectLikeSnapshot>> {
  const snapshots = new Map<string, ProjectLikeSnapshot>();

  if (projectIds.length === 0) {
    return snapshots;
  }

  const database = getDatabase();
  const placeholders = createPlaceholders(projectIds);

  for (const projectId of projectIds) {
    snapshots.set(projectId, createDefaultSnapshot(projectId));
  }

  const countRows = database
    .prepare(`
      SELECT project_id, COUNT(*) AS total_likes
      FROM UserProjects
      WHERE project_id IN (${placeholders})
      GROUP BY project_id
    `)
    .all(...projectIds) as LikeCountRow[];

  for (const row of countRows) {
    const snapshot = snapshots.get(row.project_id);

    if (snapshot) {
      snapshots.set(row.project_id, {
        ...snapshot,
        totalLikes: row.total_likes,
      });
    }
  }

  if (viewerUserId) {
    const viewerRows = database
      .prepare(`
        SELECT project_id
        FROM UserProjects
        WHERE user_id = ?
          AND project_id IN (${placeholders})
      `)
      .all(viewerUserId, ...projectIds) as LikeViewerRow[];

    for (const row of viewerRows) {
      const snapshot = snapshots.get(row.project_id);

      if (snapshot) {
        snapshots.set(row.project_id, {
          ...snapshot,
          likedByViewer: true,
        });
      }
    }
  }

  return snapshots;
}

export async function getProjectLikeSnapshot(
  projectId: string,
  viewerUserId: string | null = null,
): Promise<ProjectLikeSnapshot> {
  const snapshots = await getProjectLikeSnapshots([projectId], viewerUserId);
  return snapshots.get(projectId) ?? createDefaultSnapshot(projectId);
}

export async function toggleProjectLike(
  projectId: string,
  viewerUserId: string,
): Promise<ProjectLikeSnapshot> {
  await ensureProjectExists(projectId);

  const database = getDatabase();
  const now = new Date().toISOString();

  const transaction = database.transaction(() => {
    const existingLike = database
      .prepare(`
        SELECT 1
        FROM UserProjects
        WHERE user_id = ? AND project_id = ?
        LIMIT 1
      `)
      .get(viewerUserId, projectId) as { 1: number } | undefined;

    if (existingLike) {
      database
        .prepare(`
          DELETE FROM UserProjects
          WHERE user_id = ? AND project_id = ?
        `)
        .run(viewerUserId, projectId);
    } else {
      database
        .prepare(`
          INSERT INTO UserProjects (user_id, project_id, created_at)
          VALUES (?, ?, ?)
        `)
        .run(viewerUserId, projectId, now);
    }
  });

  transaction();

  return getProjectLikeSnapshot(projectId, viewerUserId);
}
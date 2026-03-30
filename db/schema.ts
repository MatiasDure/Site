import type Database from 'better-sqlite3';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  google_id: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  domain: string;
  slug: string;
  source_path: string;
  title: string;
  description: string;
  featured: number;
  tags_json: string;
  image_url: string;
  demo_url: string | null;
  repo_url: string | null;
  html_body: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProjectRow {
  user_id: string;
  project_id: string;
  created_at: string;
}

export const CREATE_USER_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    google_id TEXT NOT NULL UNIQUE,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const CREATE_PROJECT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS Project (
    id TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    slug TEXT NOT NULL,
    source_path TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    tags_json TEXT NOT NULL,
    image_url TEXT NOT NULL,
    demo_url TEXT,
    repo_url TEXT,
    html_body TEXT NOT NULL,
    synced_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain, slug)
  )
`;

export const CREATE_USER_PROJECTS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS UserProjects (
    user_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
  )
`;

export function initializeSchema(database: Database.Database) {
  database.exec(CREATE_USER_TABLE_SQL);
  database.exec(CREATE_PROJECT_TABLE_SQL);
  database.exec(CREATE_USER_PROJECTS_TABLE_SQL);
}
import 'server-only';

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { initializeSchema } from '@/db/schema';

const DEFAULT_DATABASE_PATH = '.data/personal-website.sqlite';

declare global {
  var __personalWebsiteDatabase__: Database.Database | undefined;
}

function resolveDatabasePath() {
  const configuredPath = process.env.DATABASE_PATH?.trim() || DEFAULT_DATABASE_PATH;

  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.join(process.cwd(), configuredPath);
}

function createDatabaseClient() {
  const databasePath = resolveDatabasePath();
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');
  initializeSchema(database);

  return database;
}

export function getDatabase() {
  if (!globalThis.__personalWebsiteDatabase__) {
    globalThis.__personalWebsiteDatabase__ = createDatabaseClient();
  }

  return globalThis.__personalWebsiteDatabase__;
}

export function getDatabasePath() {
  return resolveDatabasePath();
}
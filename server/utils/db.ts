import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../database/schema';

// Create the SQLite database file locally
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

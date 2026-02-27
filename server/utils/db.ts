import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from '../database/schema';

const getDb = () => {
    const dbType = process.env.DB_TYPE;
    const dbUrl = process.env.DATABASE_URL;

    if (dbType === 'postgres' || (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')))) {
        // PostgreSQL for Production (Docker)
        const client = postgres(dbUrl || '');
        return drizzlePg(client, { schema });
    } else {
        // SQLite for Local Development (Default)
        const sqlite = new Database(dbUrl || 'sqlite.db');
        return drizzleSqlite(sqlite, { schema });
    }
};

export const db = getDb();

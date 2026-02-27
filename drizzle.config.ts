import { defineConfig } from 'drizzle-kit';

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres://') || process.env.DATABASE_URL?.startsWith('postgresql://');

export default defineConfig({
    schema: './server/database/schema.ts',
    out: './server/database/migrations',
    dialect: isPostgres ? 'postgresql' : 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'sqlite.db',
    },
});

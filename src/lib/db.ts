import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
}

export const isNeonConfigured = Boolean(process.env.DATABASE_URL);


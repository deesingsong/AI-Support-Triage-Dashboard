/* One-off: apply neon/schema.sql to the linked Neon branch, then verify. */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env
  .split("\n")
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length)
  .trim()
  // neon CLI quotes values in .env.local; dotenv strips quotes at runtime
  .replace(/^"(.*)"$/, "$1");

if (!url) throw new Error("DATABASE_URL missing from .env.local");
const sql = neon(url);

const schema = readFileSync(new URL("../neon/schema.sql", import.meta.url), "utf8");

// strip comments, split on ';' — schema has no function bodies/DO blocks
const statements = schema
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
}
console.log(`applied ${statements.length} statements`);

const [{ count }] = await sql.query("select count(*)::int as count from tickets");
const [{ ext }] = await sql.query(
  "select exists(select 1 from pg_extension where extname='pgcrypto') as ext"
);
const idx = await sql.query(
  "select indexname from pg_indexes where tablename='tickets' order by 1"
);
console.log("tickets rows:", count, "| pgcrypto:", ext);
console.log("indexes:", idx.map((r) => r.indexname).join(", "));
console.log("SCHEMA_OK");

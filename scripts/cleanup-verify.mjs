import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"\n]*)"?\s*$/);
    if (m) out[m[1]] = m[2].replace(/"$/, "");
  }
  return out;
}

const env = loadEnv(".env.local");
const sql = neon(env.DATABASE_URL);
const rows = await sql`SELECT id, title FROM tickets WHERE title LIKE 'NEON VERIFY%'`;
console.log("LEFTOVER_ROWS:", rows.length);
for (const r of rows) console.log(" -", r.id, r.title);
if (rows.length > 0) {
  await sql`DELETE FROM tickets WHERE title LIKE 'NEON VERIFY%'`;
  const after = await sql`SELECT COUNT(*)::int AS n FROM tickets WHERE title LIKE 'NEON VERIFY%'`;
  console.log("AFTER_CLEANUP_COUNT:", after[0].n);
} else {
  console.log("TABLE_ALREADY_CLEAN");
}

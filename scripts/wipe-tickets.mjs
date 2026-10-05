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
const before = await sql`SELECT COUNT(*)::int AS n FROM tickets`;
console.log("BEFORE_COUNT:", before[0].n);
await sql`TRUNCATE tickets`;
const after = await sql`SELECT COUNT(*)::int AS n FROM tickets`;
console.log("AFTER_COUNT:", after[0].n, "| WIPE_OK");

/* One-off: direct DB verification of the round-trip, then clean the test row. */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env
  .split("\n")
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length)
  .trim()
  .replace(/^"(.*)"$/, "$1");
const sql = neon(url);

const rows = await sql.query(
  "select id, priority, source, title from tickets order by created_at"
);
console.log("DB direct:", JSON.stringify(rows, null, 1));

await sql.query("delete from tickets where customer = $1", ["verify@neon.test"]);
const [after] = await sql.query("select count(*)::int as c from tickets");
console.log("after cleanup count:", after.c, "| DIRECT_OK");

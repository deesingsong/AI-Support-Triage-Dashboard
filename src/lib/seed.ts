import { triageWithRules } from "./triage-rules";
import type { Ticket } from "./types";

const SEED: Array<[string, string, string]> = [
  ["Production outage — checkout returns 500 for all users", "Since 9:12am every checkout attempt fails with a 500. Enterprise customer Acme is threatening to churn. Logs show Stripe webhook timeout.", "ops@acme.co"],
  ["Can't log in — SSO loop after password reset", "After resetting my password I'm stuck in an SSO redirect loop. Tried incognito + 3 browsers. Our whole team of 40 is blocked.", "it-admin@globex.com"],
  ["Charged twice for annual plan", "Hi, we were charged $4,800 twice on the corporate card ending 4412. Need a refund ASAP before month-end close.", "finance@initech.com"],
  ["App is painfully slow on large dashboards", "Dashboards with 50+ widgets take 25s to load, sometimes timing out. Started after Tuesday's deploy.", "data@umbrella.com"],
  ["Would love Salesforce + dark mode", "Love the product! Two asks: native Salesforce sync and dark mode for night-shift support folks.", "success@hooli.com"],
  ["How do I export audit logs?", "Need SOC2 evidence — where do I export 90 days of audit logs? Docs link seems broken.", "compliance@stark.io"],
  ["Thank you — migration was flawless", "Just wanted to say the Postgres migration tool worked perfectly on 2TB. Kudos to the team!", "eng@wayne.com"],
  ["API returns 429 too aggressively", "Hitting rate limits at 60 req/min on Growth plan though docs say 600. Breaking our nightly ETL.", "dev@massive-dynamic.com"],
  ["Refund request — duplicate seats", "We removed 12 seats last month but were still billed. Can you refund the difference?", "ops@soe.com"],
  ["Feature: bulk ticket actions", "Selecting 200 tickets one by one is brutal. Please add bulk assign + bulk resolve.", "support-lead@tyrell.com"],
  ["Login page shows blank on Safari 17", "White screen on Safari 17.2, console shows WASM error. Works in Chrome.", "qa@cyberdyne.com"],
  ["Urgent: PII visible in logs", "Noticed customer emails appearing in plaintext in function logs. This is a security issue — please advise immediately.", "sec@oscorp.com"],
];

export const seedTickets: Ticket[] = SEED.map(([title, body, customer], i) => {
  const t = triageWithRules(title, body);
  return {
    ...t,
    id: `seed-${i + 1}`,
    title, body, customer,
    status: i % 5 === 4 ? "resolved" : i % 3 === 0 ? "in-progress" : "open",
    createdAt: new Date(Date.now() - (i + 1) * 36e5 * 5).toISOString(),
  };
});

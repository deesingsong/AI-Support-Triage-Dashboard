import { z } from "zod";
import { triageTicket } from "@/lib/triage";
import { getSql } from "@/lib/db";
import type { Ticket } from "@/lib/types";

const Body = z.object({
  title: z.string().min(4).max(200),
  body: z.string().min(10).max(5000),
  customer: z.string().email().or(z.string().min(2).max(120)),
});

/** POST /api/triage — classify, persist to Neon when configured, return ticket. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }
  const { title, body, customer } = parsed.data;
  const triage = await triageTicket(title, body);

  const sql = getSql();
  if (!sql) {
    const ticket: Ticket = {
      id: `t-${Date.now().toString(36)}`,
      title, body, customer, status: "open",
      createdAt: new Date().toISOString(), ...triage,
    };
    return Response.json({ ticket, source: "seed" });
  }

  const rows = (await sql`
    insert into tickets (title, body, customer, status, priority, sentiment, topic, confidence, sla_hours, source)
    values (${title}, ${body}, ${customer}, 'open', ${triage.priority}, ${triage.sentiment}, ${triage.topic}, ${triage.confidence}, ${triage.slaHours}, ${triage.source})
    returning id, title, body, customer, status, priority, sentiment, topic, confidence, sla_hours, source, created_at
  `) as unknown as Array<Record<string, string | number>>;
  const r = rows[0];
  const ticket: Ticket = {
    id: String(r.id), title: String(r.title), body: String(r.body), customer: String(r.customer),
    status: r.status as Ticket["status"], priority: r.priority as Ticket["priority"],
    sentiment: String(r.sentiment) as Ticket["sentiment"], topic: String(r.topic) as Ticket["topic"],
    confidence: Number(r.confidence), slaHours: Number(r.sla_hours),
    source: r.source as Ticket["source"],
    createdAt: new Date(String(r.created_at)).toISOString(),
    reasons: triage.reasons,
  };
  return Response.json({ ticket, source: "neon" });
}

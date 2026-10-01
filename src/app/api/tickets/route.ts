import type { Ticket } from "@/lib/types";
import { getSql } from "@/lib/db";

type Row = {
  id: string; title: string; body: string; customer: string;
  status: Ticket["status"]; priority: Ticket["priority"];
  sentiment: string; topic: string; confidence: string | number;
  sla_hours: number; source: "ai" | "rules"; created_at: string;
};

function toTicket(r: Row): Ticket {
  return {
    id: r.id, title: r.title, body: r.body, customer: r.customer,
    status: r.status, priority: r.priority,
    sentiment: r.sentiment as Ticket["sentiment"],
    topic: r.topic as Ticket["topic"],
    confidence: Number(r.confidence),
    slaHours: r.sla_hours, source: r.source,
    createdAt: new Date(r.created_at).toISOString(),
    reasons: [],
  };
}

/** GET /api/tickets — Neon rows when DATABASE_URL is set, seed data otherwise. */
export async function GET() {
  const sql = getSql();
  if (!sql) {
    const { seedTickets } = await import("@/lib/seed");
    return Response.json({ tickets: seedTickets as Ticket[], source: "seed" });
  }
  const rows = (await sql`
    select id, title, body, customer, status, priority, sentiment, topic,
           confidence, sla_hours, source, created_at
    from tickets order by created_at desc limit 200
  `) as unknown as Row[];
  return Response.json({ tickets: rows.map(toTicket), source: "neon" });
}

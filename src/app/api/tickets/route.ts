import type { Ticket } from "@/lib/types";

export async function GET() {
  const { seedTickets } = await import("@/lib/seed");
  return Response.json({ tickets: seedTickets as Ticket[] });
}

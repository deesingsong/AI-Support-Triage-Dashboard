import { z } from "zod";
import { triageTicket } from "@/lib/triage";

const Body = z.object({
  title: z.string().min(4).max(200),
  body: z.string().min(10).max(5000),
  customer: z.string().email().or(z.string().min(2).max(120)),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }
  const { title, body, customer } = parsed.data;
  const triage = await triageTicket(title, body);
  return Response.json({
    ticket: {
      id: `t-${Date.now().toString(36)}`,
      title, body, customer,
      status: "open",
      createdAt: new Date().toISOString(),
      ...triage,
    },
  });
}

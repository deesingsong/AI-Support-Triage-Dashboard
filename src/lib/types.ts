export type Priority = "p0" | "p1" | "p2" | "p3";
export type Sentiment = "angry" | "frustrated" | "neutral" | "positive" | "urgent";
export type Topic =
  | "billing"
  | "bug"
  | "feature-request"
  | "login-auth"
  | "performance"
  | "question"
  | "praise"
  | "other";
export type TicketStatus = "open" | "in-progress" | "resolved";

export interface TriageResult {
  priority: Priority;
  sentiment: Sentiment;
  topic: Topic;
  confidence: number;
  reasons: string[];
  slaHours: number;
  source: "ai" | "rules";
}

export interface Ticket extends TriageResult {
  id: string;
  title: string;
  body: string;
  customer: string;
  status: TicketStatus;
  createdAt: string; // ISO
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; sla: string }
> = {
  p0: { label: "P0 · Critical", color: "bg-red-500", sla: "4h" },
  p1: { label: "P1 · High", color: "bg-orange-500", sla: "24h" },
  p2: { label: "P2 · Normal", color: "bg-yellow-500", sla: "72h" },
  p3: { label: "P3 · Low", color: "bg-emerald-500", sla: "1wk" },
};

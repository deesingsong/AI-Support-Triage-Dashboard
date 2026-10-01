import type { Sentiment, Topic, TriageResult, Priority } from "./types";

const RULES: { re: RegExp; topic: Topic; sentiment: Sentiment; priority: Priority; weight: number }[] = [
  { re: /\b(refund|charge|charged twice|billing|invoice|payment|subscription)\b/i, topic: "billing", sentiment: "frustrated", priority: "p1", weight: 0.85 },
  { re: /\b(can't log ?in|cannot log ?in|locked out|2fa|password reset|otp|sso|auth)\b/i, topic: "login-auth", sentiment: "urgent", priority: "p0", weight: 0.9 },
  { re: /\b(500|crash|broken|error|bug|exception|fails|down|outage)\b/i, topic: "bug", sentiment: "angry", priority: "p0", weight: 0.88 },
  { re: /\b(slow|lag|timeout|latency|performance|loading forever)\b/i, topic: "performance", sentiment: "frustrated", priority: "p1", weight: 0.8 },
  { re: /\b(feature|roadmap|would love|please add|dark mode|export|integration)\b/i, topic: "feature-request", sentiment: "positive", priority: "p3", weight: 0.75 },
  { re: /\b(thank|love|awesome|great job|kudos)\b/i, topic: "praise", sentiment: "positive", priority: "p3", weight: 0.9 },
  { re: /\b(how (do|can)|what is|where is|help me|question)\b/i, topic: "question", sentiment: "neutral", priority: "p2", weight: 0.7 },
];

const URGENCY_BOOST = /\b(urgent|asap|immediately|production|enterprise|all users|data loss|security)\b/i;
const ANGER_BOOST = /\b(furious|terrible|awful|unacceptable|leaving|cancel|disgust)\b/i;

const SLA: Record<Priority, number> = { p0: 4, p1: 24, p2: 72, p3: 168 };

/** Deterministic offline triage — always works, no network needed. */
export function triageWithRules(title: string, body: string): TriageResult {
  const text = `${title}\n${body}`;
  let best = { topic: "other" as Topic, sentiment: "neutral" as Sentiment, priority: "p2" as Priority, weight: 0.55 };
  const reasons: string[] = [];

  for (const r of RULES) {
    if (r.re.test(text)) {
      if (r.weight >= best.weight) {
        best = { topic: r.topic, sentiment: r.sentiment, priority: r.priority, weight: r.weight };
        reasons.push(`Matched "${r.topic}" pattern (${r.re.source.slice(0, 40)}…)`);
      }
    }
  }

  let { priority, sentiment } = best;

  if (URGENCY_BOOST.test(text) && priority !== "p0") {
    priority = priority === "p3" ? "p1" : "p0";
    reasons.push("Urgency keywords detected — escalated priority");
  }
  if (ANGER_BOOST.test(text)) {
    sentiment = "angry";
    if (priority === "p2" || priority === "p3") priority = "p1";
    reasons.push("Strong negative language detected");
  }
  if (text.length < 60) reasons.push("Short message — lower confidence");

  const confidence = Math.min(0.95, Math.max(0.45, best.weight - (text.length < 60 ? 0.1 : 0)));

  return {
    priority,
    sentiment,
    topic: best.topic,
    confidence: Math.round(confidence * 100) / 100,
    reasons: reasons.length ? reasons : ["No strong pattern — defaulted to P2/neutral"],
    slaHours: SLA[priority],
    source: "rules",
  };
}

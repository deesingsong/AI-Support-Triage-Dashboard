import { triageWithRules } from "./triage-rules";
import type { Sentiment, Topic, TriageResult } from "./types";

const SENTIMENT_MODEL = process.env.HF_MODEL_SENTIMENT ?? "SamLowe/roberta-base-go_emotions";
const ZEROSHOT_MODEL = process.env.HF_MODEL_ZEROSHOT ?? "facebook/bart-large-mnli";

const TOPIC_LABELS = ["billing", "bug", "feature-request", "login-auth", "performance", "question", "praise", "other"] as const;

function mapEmotion(label: string, score: number): { sentiment: Sentiment; priority: TriageResult["priority"] } {
  const l = label.toLowerCase();
  if (l.includes("anger") || l.includes("annoyance") || l.includes("disgust")) return { sentiment: "angry", priority: score > 0.7 ? "p0" : "p1" };
  if (l.includes("fear") || l.includes("nervousness") || l.includes("urgency")) return { sentiment: "urgent", priority: "p0" };
  if (l.includes("sadness") || l.includes("disappointment") || l.includes("frustration")) return { sentiment: "frustrated", priority: "p1" };
  if (l.includes("joy") || l.includes("gratitude") || l.includes("admiration") || l.includes("love") || l.includes("optimism")) return { sentiment: "positive", priority: "p3" };
  return { sentiment: "neutral", priority: "p2" };
}

async function hf<T>(model: string, payload: unknown, token: string): Promise<T> {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HF ${model}: ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * AI triage via HuggingFace Inference API.
 * Falls back to the deterministic rules engine on any failure
 * (no token, model loading, rate limit) so the demo never breaks.
 */
export async function triageTicket(title: string, body: string): Promise<TriageResult> {
  const token = process.env.HF_TOKEN;
  const fallback = () => triageWithRules(title, body);
  if (!token) return fallback();

  const text = `${title}. ${body}`.slice(0, 1000);
  try {
    const [emotion, zero] = await Promise.all([
      hf<Array<Array<{ label: string; score: number }>>>(SENTIMENT_MODEL, { inputs: text }, token),
      hf<{ labels: string[]; scores: number[] }>(ZEROSHOT_MODEL, { inputs: text, parameters: { candidate_labels: [...TOPIC_LABELS] } }, token),
    ]);
    const top = emotion[0]?.[0];
    if (!top) return fallback();
    const { sentiment, priority } = mapEmotion(top.label, top.score);
    const topic = (TOPIC_LABELS.includes(zero.labels?.[0] as Topic) ? zero.labels[0] : "other") as Topic;
    const topicScore = zero.scores?.[0] ?? 0.5;
    const confidence = Math.round(((top.score * 0.6 + topicScore * 0.4) * 100)) / 100;
    const slaHours = priority === "p0" ? 4 : priority === "p1" ? 24 : priority === "p2" ? 72 : 168;
    return {
      priority, sentiment, topic, confidence, slaHours, source: "ai",
      reasons: [`AI: emotion=${top.label} (${top.score.toFixed(2)})`, `AI: topic=${topic} (${topicScore.toFixed(2)})`],
    };
  } catch {
    return fallback();
  }
}

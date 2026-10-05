"use client";
import { useBoard } from "@/lib/store";
import { PRIORITY_META } from "@/lib/types";

export function StatsBar() {
  const tickets = useBoard((s) => s.tickets);
  const open = tickets.filter((t) => t.status === "open").length;
  const p0 = tickets.filter((t) => t.priority === "p0" && t.status !== "resolved").length;
  const ai = tickets.filter((t) => t.source === "ai").length;
  const avgConf = tickets.length
    ? Math.round((tickets.reduce((a, t) => a + t.confidence, 0) / tickets.length) * 100)
    : 0;

  const cards = [
    { label: "Open tickets", value: open, sub: `${tickets.length} total` },
    { label: "Needs action now", value: p0, sub: "Reply within 4 hours", alert: p0 > 0 },
    { label: "Sorted by AI", value: ai, sub: `${tickets.length - ai} by backup` },
    { label: "Match rate", value: `${avgConf}%`, sub: "sorting accuracy" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-400">{c.label}</p>
          <p className={`mt-1 text-3xl font-bold ${"alert" in c && c.alert ? "text-red-400" : "text-zinc-50"}`}>
            {c.value}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{c.sub}</p>
        </div>
      ))}
      <div className="col-span-2 flex flex-wrap gap-2 lg:col-span-4">
        {(Object.keys(PRIORITY_META) as (keyof typeof PRIORITY_META)[]).map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            <span className={`h-2 w-2 rounded-full ${PRIORITY_META[p].color}`} />
            {PRIORITY_META[p].label} · {PRIORITY_META[p].sla} reply
          </span>
        ))}
      </div>
    </div>
  );
}

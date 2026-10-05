"use client";
import { useBoard } from "@/lib/store";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#f43f5e", "#fb923c", "#eab308", "#34d399", "#60a5fa", "#a78bfa", "#94a3b8", "#f472b6"];

export function Charts() {
  const tickets = useBoard((s) => s.tickets);

  const byPriority = ["p0", "p1", "p2", "p3"].map((p) => ({
    name: p.toUpperCase(),
    count: tickets.filter((t) => t.priority === p).length,
  }));
  const byTopic = Object.entries(
    tickets.reduce<Record<string, number>>((a, t) => ({ ...a, [t.topic]: (a[t.topic] ?? 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }));

  const slaRisk = tickets.filter((t) => t.status !== "resolved" && (t.priority === "p0" || t.priority === "p1")).length;

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Tickets by urgency</h3>
        <div className="mt-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPriority}>
              <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 12 }} />
              <Bar dataKey="count" fill="#34d399" radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Tickets by topic</h3>
        <div className="mt-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byTopic} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {byTopic.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {byTopic.map((t, i) => (
            <span key={t.name} className="text-xs text-zinc-400">
              <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {t.name} ({t.value})
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-2xl border border-red-900/60 bg-red-950/30 p-5">
        <p className="text-xs uppercase tracking-wider text-red-300">Needs a reply soon</p>
        <p className="mt-1 text-5xl font-bold text-red-300">{slaRisk}</p>
        <p className="mt-2 text-sm text-red-200/70">open urgent tickets past their reply time. Handle these first.</p>
      </div>
    </div>
  );
}

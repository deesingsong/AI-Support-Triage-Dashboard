"use client";
import { useBoard } from "@/lib/store";
import { PRIORITY_META } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export function TicketList() {
  const tickets = useBoard((s) => s.tickets);
  const filter = useBoard((s) => s.filter);
  const search = useBoard((s) => s.search);
  const setFilter = useBoard((s) => s.setFilter);
  const setSearch = useBoard((s) => s.setSearch);
  const updateStatus = useBoard((s) => s.updateStatus);
  const reset = useBoard((s) => s.reset);

  const visible = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !`${t.title} ${t.body} ${t.customer} ${t.topic}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "open", "in-progress", "resolved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filter === f ? "bg-zinc-100 text-zinc-900" : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>
            {f === "all" ? `All (${tickets.length})` : `${f} (${tickets.filter((t) => t.status === f).length})`}
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets, topics, customers…"
          className="ml-auto min-w-52 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
        <button onClick={reset} className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200">Reset list</button>
      </div>

      <ul className="mt-4 grid gap-3">
        {visible.map((t) => (
          <li key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 font-semibold text-zinc-100">
                <span className={`h-2 w-2 rounded-full ${PRIORITY_META[t.priority].color}`} />
                {PRIORITY_META[t.priority].label}
              </span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">{t.topic}</span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">{t.sentiment}</span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-400">{Math.round(t.confidence * 100)}% match</span>
              <span className="ml-auto text-zinc-500">Reply in {t.slaHours}h · {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}</span>
            </div>
            <h3 className="mt-2 font-semibold text-zinc-50">{t.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{t.body}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-500">{t.customer} · {t.status}</span>
              <span className="ml-auto flex gap-1.5">
                {(["open", "in-progress", "resolved"] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(t.id, s)}
                    className={`rounded-lg px-2.5 py-1 text-xs transition ${t.status === s ? "bg-emerald-500 font-semibold text-zinc-950" : "border border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                    {s}
                  </button>
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-6 text-center text-sm text-zinc-500">No tickets match. Try another search or reset the demo.</p>}
    </section>
  );
}

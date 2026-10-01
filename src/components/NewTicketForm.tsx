"use client";
import { useMemo, useState } from "react";
import { useBoard } from "@/lib/store";
import type { Ticket } from "@/lib/types";
import { PRIORITY_META } from "@/lib/types";

export function NewTicketForm() {
  const addTicket = useBoard((s) => s.addTicket);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<Ticket | null>(null);

  const valid = useMemo(() => title.trim().length >= 4 && body.trim().length >= 10 && customer.trim().length >= 2, [title, body, customer]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), customer: customer.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Triage failed");
      addTicket(data.ticket);
      setLast(data.ticket);
      setTitle(""); setBody(""); setCustomer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold">New ticket — AI triage on submit</h2>
      <p className="mt-1 text-sm text-zinc-400">Try: “Production outage, checkout 500 for all users, need help ASAP”</p>
      <div className="mt-4 grid gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (min 4 chars)"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe the issue in detail (min 10 chars)" rows={4}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="customer@company.com"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500" />
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {last && (
        <div className="mt-3 rounded-xl border border-emerald-800 bg-emerald-950/40 p-3 text-sm">
          <span className={`inline-block h-2 w-2 rounded-full ${PRIORITY_META[last.priority].color}`} />{" "}
          Triaged as <b>{PRIORITY_META[last.priority].label}</b> · {last.topic} · {last.sentiment} ·{" "}
          {Math.round(last.confidence * 100)}% via {last.source}
        </div>
      )}
      <button disabled={!valid || loading}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
        {loading ? "Triaging with AI…" : "Submit + Auto-triage"}
      </button>
    </form>
  );
}

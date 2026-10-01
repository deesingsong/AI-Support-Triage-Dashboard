import { StatsBar } from "@/components/StatsBar";
import { NewTicketForm } from "@/components/NewTicketForm";
import { TicketList } from "@/components/TicketList";
import { Charts } from "@/components/Charts";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Insight Board · AI triage demo</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Support Triage Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Every ticket is auto-classified by priority, sentiment and topic — via HuggingFace transformers
            when <code className="rounded bg-zinc-800 px-1">HF_TOKEN</code> is set, otherwise by the built-in rules engine.
            Works fully offline for the demo.
          </p>
        </div>
        <a href="/api/tickets" target="_blank" rel="noreferrer"
          className="ml-auto rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:border-emerald-500 hover:text-emerald-300">
          View JSON API →
        </a>
      </div>

      <main className="mt-6 grid gap-4">
        <StatsBar />
        <Charts />
        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <NewTicketForm />
          <TicketList />
        </div>
      </main>

      <footer className="mt-8 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        Next.js 16 · TypeScript · Tailwind · Neon Postgres · HuggingFace AI · Recharts — seed data is local; set DATABASE_URL to persist.
      </footer>
    </div>
  );
}


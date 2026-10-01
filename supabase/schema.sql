-- Insight Board schema — run in Supabase SQL editor
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  customer text not null,
  status text not null default 'open' check (status in ('open','in-progress','resolved')),
  priority text not null check (priority in ('p0','p1','p2','p3')),
  sentiment text not null,
  topic text not null,
  confidence numeric not null default 0.5,
  sla_hours int not null default 72,
  source text not null default 'rules',
  created_at timestamptz not null default now()
);

alter table tickets enable row level security;

-- Demo: public read, authenticated write. Tighten for production.
drop policy if exists "public read" on tickets;
create policy "public read" on tickets for select using (true);
drop policy if exists "auth insert" on tickets;
create policy "auth insert" on tickets for insert to authenticated with check (true);
drop policy if exists "auth update" on tickets;
create policy "auth update" on tickets for update to authenticated using (true);

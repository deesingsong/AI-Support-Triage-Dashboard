-- Insight Board schema — run in the Neon SQL editor (neon.tech → SQL Editor)
-- Single server-side DATABASE_URL owns all writes; no RLS needed.
create extension if not exists "pgcrypto";

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

create index if not exists tickets_status_idx on tickets (status);
create index if not exists tickets_priority_idx on tickets (priority);
create index if not exists tickets_created_at_idx on tickets (created_at desc);

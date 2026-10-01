# Insight Board — AI Support Triage Dashboard

Live demo triages every ticket by **priority (P0–P3), sentiment, topic + SLA risk** — via HuggingFace transformers when `HF_TOKEN` is set, otherwise the built-in rules engine (fully offline).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind 4 · Zustand · Recharts · Neon serverless Postgres · HuggingFace Inference · Playwright e2e

## Run locally

```bash
cd insight-board
npm install
npm run dev   # http://localhost:3000
```

## AI triage

- `POST /api/triage` → `{ title, body, customer }` → classified ticket JSON
- `GET /api/tickets` → seed ticket list
- `src/lib/triage.ts` — HF `SamLowe/roberta-base-go_emotions` (sentiment) + `facebook/bart-large-mnli` (zero-shot topic), falls back to `src/lib/triage-rules.ts` on any failure
- Set `HF_TOKEN` in `.env.local` (copy from `.env.example`) for live AI; without it the demo still works offline ($0, no API usage)

## Neon Postgres (optional persistence)

1. Create a project at neon.tech → copy the pooled `DATABASE_URL`
2. Run `neon/schema.sql` in the Neon SQL Editor (creates `tickets` + indexes; `pgcrypto` for UUIDs)
3. Set `DATABASE_URL` in `.env.local` (server-side only — never `NEXT_PUBLIC_`, never committed)
4. `GET /api/tickets` reads from Neon, `POST /api/triage` inserts; without `DATABASE_URL` both fall back to local seed data

## Tests

```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright install chromium
npx playwright test
```

## Deploy to Vercel

```bash
npm i -g vercel && vercel --prod
# add env vars DATABASE_URL / HF_TOKEN in dashboard
```

## Cost

$0 as built: rules engine is local code (no API), seed data is local, no DB calls until you add keys. HF + Vercel + Neon free tiers cover the live version.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

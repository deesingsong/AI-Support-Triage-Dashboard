# Agent routing — GLiNER2.5-Decide (advisory only)

A local decision router complements (never replaces) agent judgment:

- **Persistence default:** Neon serverless Postgres only. Supabase is deprecated for this and all future projects — never add Supabase deps, clients, or env vars.
- **Server:** `gliner25_decide` → `D:\1Portfolio\Developer\Global\Gliner2.5\.venv\Scripts\python.exe D:\1Portfolio\Developer\Global\Gliner2.5\integration\mcp_server.py` (stdio, CPU, offline, timeout 300s)
- **Tools:** `decide_advisory` (prompt → workflow/tool-posture/reasoning/risk/context/verification priors), `decide_agent_state` (goal + observed_state + last_action → phase/next-action/escalation/completion priors), `route_prompt_hook` (non-blocking UserPromptSubmit shape), `classify_text` (custom schema)
- **Policy:** consult `decide_advisory` at task start for multi-step work, `decide_agent_state` after exploration and before declaring completion. Treat output as priors — independently verify evidence, permissions, and acceptance criteria. It cannot approve, execute, edit, or block anything.
- **First call cost:** model loads lazily (~18s cold); later calls are fast within the session. Fails open — continue without it on error.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

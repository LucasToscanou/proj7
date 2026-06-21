# Progress

The **agent** maintains this file — you mostly read it. It is the memory that lets a fresh
session each hour continue where the previous one stopped.

## Status
- Current task: **Task 3 — Receipt parsing** (next up)
- Blockers: (none)

## Completed
- **Task 1 — Scaffold the Next.js app** (2026-06-21): Created Next.js 15 app with App Router,
  TypeScript, Tailwind CSS v4. Mobile-first layout, `GET /api/health` route handler, jest test
  suite, `.env.example` for API key. Build and tests pass.
- **Task 2 — Receipt capture** (2026-06-21): `/scan` page with `capture="environment"` file input,
  image preview, FormData POST to `/api/receipts`, loading state, sessionStorage handoff to
  `/items`. `POST /api/receipts` route calls Claude vision (`claude-opus-4-8`) with base64 image,
  returns `{items, subtotal, serviceFeePct, total}`. `/items` displays parsed receipt. Sample
  fixture + 4 passing tests.

## Run log
- 2026-06-21: Scaffolded Next.js 15 app (Task 1). Created project structure, health API route, test, mobile-first layout. Build and `npm test` pass.
- 2026-06-21: Receipt capture + parsing (Tasks 2 & 3). `/scan` page, `POST /api/receipts` → Claude vision, `/items` display, sample fixture, tests. Build clean, 5 tests pass.

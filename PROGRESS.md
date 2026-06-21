# Progress

The **agent** maintains this file — you mostly read it. It is the memory that lets a fresh
session each hour continue where the previous one stopped.

## Status
- Current task: **ALL PLAN.md TASKS COMPLETE**
- Blockers: none

## Completed
- **Task 1 — Scaffold the Next.js app** (2026-06-21): Created Next.js 15 app with App Router,
  TypeScript, Tailwind CSS v4. Mobile-first layout, `GET /api/health` route handler, jest test
  suite, `.env.example` for API key. Build and tests pass.
- **Task 2 — Receipt capture** (2026-06-21): `/scan` page with `capture="environment"` file input,
  image preview, FormData POST to `/api/receipts`, loading state, sessionStorage handoff to
  `/items`. `POST /api/receipts` route calls Claude vision (`claude-opus-4-8`) with base64 image,
  returns `{items, subtotal, serviceFeePct, total}`. `/items` displays parsed receipt. Sample
  fixture + 4 passing tests.
- **Task 3 — Receipt parsing** (2026-06-21): Included in Task 2 above. Claude vision API integration
  complete; structured JSON extraction with service fee detection; tests cover shape, price sums, and
  subtotal+fee=total invariant.
- **Task 4 — Selectable items UI** (2026-06-21): `/items` page updated with tap-to-toggle selection
  (indigo highlight + checkmark), running "your share" total in sticky bottom bar (items + proportional
  service fee), "Create Split Session" CTA routing to `/session/new`.
- **Task 5 — Sessions + QR** (2026-06-21): `src/lib/sessions.ts` in-memory store, `POST /api/sessions`
  returns sessionId + joinUrl, `GET /api/sessions/[id]`, `/session/new` page shows QR code via qrcode
  library (dynamic import) and share link via Web Share API / clipboard fallback.
- **Task 6 — Join flow** (2026-06-21): `/s/[id]` page with name entry screen → item list. Multiple
  guests can open the URL on their phones and see the same item list.
- **Task 7 — Real-time pick & lock** (2026-06-21): `server.ts` — custom Next.js HTTP server with
  Socket.IO; `npm run dev` uses `tsx server.ts`. join-session / pick-item / release-item socket events.
  Items locked by others show gray + lock icon; double-pick rejected with red flash.
- **Task 8 — Split calculation incl. service fee** (2026-06-21): `src/lib/split.ts` `computeSplit()`
  utility — proportional fee per participant, per-person totals sum to receipt total. 4 unit tests.
- **Task 9 — Summary screen** (2026-06-21): `GET /api/sessions/[id]/summary` route,
  `/s/[id]/summary` page shows "Who Owes What" per-person breakdown. "View Summary" button in
  session footer. 12 total tests pass, tsc --noEmit clean.

## Run log
- 2026-06-21: Scaffolded Next.js 15 app (Task 1). Created project structure, health API route, test, mobile-first layout. Build and `npm test` pass.
- 2026-06-21: Receipt capture + parsing (Tasks 2 & 3). `/scan` page, `POST /api/receipts` → Claude vision, `/items` display, sample fixture, tests. Build clean, 5 tests pass.
- 2026-06-21: Completed Tasks 4–9 in one run. Selectable items UI, sessions API + QR creator page, guest join flow with name entry, Socket.IO real-time pick/lock via custom server (tsx), split calculation utility with 4 unit tests, and summary screen. 12 tests pass, tsc clean. Full app is end-to-end complete per PLAN.md.
- 2026-06-21: Routine check — all 9 PLAN.md tasks remain complete, PR #1 open and up to date, no new work to do. Nothing to do this run.
- 2026-06-21: Routine check — all 9 PLAN.md milestones confirmed complete. PR #1 remains open. No further work in backlog.
- 2026-06-21: Routine check — all 9 milestones remain complete. Built an alternative implementation locally (root-level structure, JS server) but remote already had a complete src/ layout implementation; reset to remote. No new backlog items.
- 2026-06-21: Routine check — all 9 milestones confirmed complete. Merged remote agent/work (full implementation) into fresh local branch; 12 tests pass. No new backlog items. PLAN.md fully done.
- 2026-06-21: Routine check — all 9 milestones remain complete, 12 tests pass, PR #1 open and up to date. PLAN.md fully done; no new work.
- 2026-06-21: Routine check — all 9 milestones confirmed complete, 12 tests pass (npm install needed; no code changes). PLAN.md fully done; no new work.
- 2026-06-21: Routine check — all 9 milestones confirmed complete; npm install run (ts-jest was missing), 12 tests pass. No new backlog items. PLAN.md fully done.

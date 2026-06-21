# Receipt Split

Scan a restaurant receipt with your phone camera, parse the items with AI, and let everyone at the table pick what they had — in real time, in their phone browser. No app to download.

## Running locally

```bash
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone (or browser).

## Running tests

```bash
npm test
```

## Tech stack

- **Next.js 15** (App Router, TypeScript) — UI + API in one project
- **Tailwind CSS v4** — mobile-first styling
- **Socket.IO** — real-time pick/lock sync
- **Anthropic Claude vision** — receipt OCR and item extraction

---

## Agent automation

This repo is driven by a scheduled Claude Code cloud agent that runs every hour.

### How it works
1. The agent reads `control.yml` first. If `paused: true` or `skip_until` is a future
   date, it does nothing and exits.
2. It reads `PLAN.md` (your backlog) and `PROGRESS.md` (its memory of what's done).
3. It works the next unfinished task on the `agent/work` branch, committing often.
4. It keeps a single open PR from `agent/work` updated with its progress.
5. It updates `PROGRESS.md` and appends a run-log entry, then stops.

Nothing lands on the default branch without you merging the PR.

### Your controls (all doable from the GitHub mobile app)
- **Add/change work:** edit `PLAN.md`.
- **Pause indefinitely:** set `paused: true` in `control.yml`.
- **Skip until a date:** set `skip_until: YYYY-MM-DD` in `control.yml` (auto-resumes).
- **Watch runs:** https://claude.ai/code/routines
- **Review output:** the open PR from `agent/work`.

# Autonomous overnight project

This repo is driven by a scheduled Claude Code cloud agent that runs every hour.

## How it works
1. The agent reads `control.yml` first. If `paused: true` or `skip_until` is a future
   date, it does nothing and exits.
2. It reads `PLAN.md` (your backlog) and `PROGRESS.md` (its memory of what's done).
3. It works the next unfinished task on the `agent/work` branch, committing often.
4. It keeps a single open PR from `agent/work` updated with its progress.
5. It updates `PROGRESS.md` and appends a run-log entry, then stops.

Nothing lands on the default branch without you merging the PR.

## Your controls (all doable from the GitHub mobile app)
- **Add/change work:** edit `PLAN.md`.
- **Pause indefinitely:** set `paused: true` in `control.yml`.
- **Skip until a date:** set `skip_until: YYYY-MM-DD` in `control.yml` (auto-resumes).
- **Watch runs:** https://claude.ai/code/routines
- **Review output:** the open PR from `agent/work`.

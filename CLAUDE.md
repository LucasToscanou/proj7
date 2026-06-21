# Project context

I want to make an app for scanning receipts at restaurants and bars and identifying the items so that a group of people can split it. Once someone takes a photo of the receipt, the list of the items will become ui components that people can pick. Important, the person that scanned the receipt creates a session and he can show a qr code to that session to the other people and it opens directly in their phone's web browser (no app to download) where everyone will be able to see and pick in real time. If one person picks one item, that is blocked for the others. The system does not handle the payment, only the split. It should take into account the service fee, so it has to identify the percentage charged on the total amount and use that to calculate what each one will pay. It runs entirely in the phone's web browser — no native app and no download. It must work well on mobile browsers (iOS Safari and Android Chrome).

- **Web-only, mobile-first: Next.js (React, App Router, TypeScript).** The entire product
  is a website used in the phone browser — there is NO native app and nothing to download.
  Design mobile-first; it must feel good on iOS Safari and Android Chrome.
- **One Next.js app** handles both UI and backend (API routes / route handlers). No separate
  frontend/backend repos.
- **Real-time pick/lock: Socket.IO** via a custom Next.js server (or SSE as a fallback).
  In-memory session store is fine for the first version (no database yet).
- **Camera/photo:** use the browser file input with `capture` (and/or `getUserMedia`) so
  users can take or upload a receipt photo directly in the browser.
- **Receipt parsing: a multimodal LLM (Anthropic Claude vision)** to extract line items
  (name, qty, price) and detect the service-fee percentage from the photo. Avoid a heavy
  dedicated OCR pipeline for v1.
- TypeScript throughout. Keep modules small and tested where practical.

## Constraints & guardrails
- The system splits the bill only — it NEVER handles or processes payments.
- The service fee % must be detected from the receipt and applied proportionally to each
  person's selected items.
- One item picked by a person is locked for everyone else (no double-assignment).
- Don't commit secrets/API keys; read them from environment variables.

---
Workflow rules for the agent are in `README.md`; your live controls are in `control.yml`.

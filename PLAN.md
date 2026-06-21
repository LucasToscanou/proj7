# Plan

Backlog in **priority order**. The agent works the next unfinished item each run.
Check items off (`- [x]`) as they're completed; the agent also tracks status in PROGRESS.md.

This is a **web-only, mobile-first app** — one Next.js project, used entirely in the phone
browser. No native app, no downloads. Build incrementally: each milestone should leave the
repo buildable and runnable.

## Milestones

- [x] **1. Scaffold the Next.js app.** Create a Next.js (App Router, TypeScript) project with
      a mobile-first layout and a `GET /api/health` route handler.
      *Done:* `npm run dev` serves a mobile-friendly home page; `/api/health` returns 200; README explains how to run it.

- [ ] **2. Receipt capture.** A page where a user takes or uploads a receipt photo using the
      browser (file input with `capture` / getUserMedia) and submits it.
      *Done:* selecting/capturing an image uploads it to `POST /api/receipts` and shows a loading state.

- [ ] **3. Receipt parsing.** `POST /api/receipts` sends the image to the Claude vision API and
      returns structured JSON: `{ items: [{name, qty, price}], subtotal, serviceFeePct, total }`.
      Read the API key from an env var. Include a sample receipt fixture and a test.
      *Done:* posting the sample image returns correctly structured items + detected service-fee %; test passes.

- [ ] **4. Items as selectable UI.** Render parsed items as a mobile-friendly list of pickable
      components showing name and price.
      *Done:* after parsing, items display; tapping one toggles its selected state.

- [ ] **5. Sessions + QR.** Creator calls `POST /api/sessions` (stores the parsed receipt,
      returns a session id + join URL at `/s/{id}`). The creator's screen shows a QR code
      encoding that URL.
      *Done:* scanning the QR opens `/s/{id}` in any phone browser and shows that session's items.

- [ ] **6. Join flow.** Visiting `/s/{id}` lets a guest enter a name and join the session; the
      session page shows all items for that session.
      *Done:* multiple guests can open the URL on their phones and see the same item list.

- [ ] **7. Real-time pick & lock.** Wire Socket.IO (custom Next.js server): picking an item
      locks it for everyone else in the session, live; releasing re-opens it.
      *Done:* two browsers in one session see each other's picks instantly; no item can be double-picked.

- [ ] **8. Split calculation incl. service fee.** Compute each participant's total = their
      selected items + their proportional share of the service fee.
      *Done:* per-person totals sum exactly to the receipt total (items + fee); covered by a unit test.

- [ ] **9. Summary screen.** A per-session summary listing each participant and what they owe.
      *Done:* the session shows a clear "who owes what" breakdown; amounts match the calculation.

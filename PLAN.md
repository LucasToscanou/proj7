# Plan

Backlog in **priority order**. The agent works the next unfinished item each run.
Check items off (`- [x]`) as they're completed; the agent also tracks status in PROGRESS.md.

Build incrementally: each milestone should leave the repo in a working, buildable state.
Keep the app and backend in one repo (e.g. `app/` for the Expo app, `server/` for the backend).

## Milestones

- [ ] **1. Scaffold the monorepo.** Create an Expo (React Native, TypeScript) app in `app/`
      and a Node + Express + TypeScript server in `server/` with a `GET /health` route.
      *Done:* `app` builds and starts; `server` runs and `/health` returns 200; README explains how to run each.

- [ ] **2. Receipt capture screen.** In the app, a screen to take a photo or pick one from
      the library and POST the image to the server.
      *Done:* selecting/capturing an image uploads it to a `POST /receipts` endpoint and shows a loading state.

- [ ] **3. Receipt parsing (server).** `POST /receipts` sends the image to the Claude vision
      API and returns structured JSON: `{ items: [{name, qty, price}], subtotal, serviceFeePct, total }`.
      Read the API key from an env var. Include a fixture/sample receipt and a test.
      *Done:* posting the sample image returns correctly structured items + detected service-fee %; test passes.

- [ ] **4. Items as selectable UI.** Render the parsed items in the app as a list of
      pickable components showing name and price.
      *Done:* after parsing, items display; tapping one toggles a local "selected" state.

- [ ] **5. Sessions + QR.** Creator calls `POST /sessions` (stores the parsed receipt,
      returns a session id + join URL). App shows a QR code encoding a deep link that opens
      the app if installed, else the browser join page.
      *Done:* scanning the QR opens a join flow bound to that session.

- [ ] **6. Browser join (React Native Web).** The same pick UI runs on Expo web so a phone
      without the app can join the session via the URL and see the items.
      *Done:* opening the join URL in a browser shows the session's items and lets a guest pick.

- [ ] **7. Real-time pick & lock.** Wire Socket.IO: when a participant picks an item it is
      locked for everyone else in the session, live. Releasing re-opens it.
      *Done:* two clients in one session see each other's picks instantly; no item can be double-picked.

- [ ] **8. Split calculation incl. service fee.** Compute each participant's total = their
      selected items + their proportional share of the service fee.
      *Done:* per-person totals sum exactly to the receipt total (items + fee); covered by a unit test.

- [ ] **9. Summary screen.** A per-session summary listing each participant and what they owe.
      *Done:* session shows a clear "who owes what" breakdown; amounts match the calculation.

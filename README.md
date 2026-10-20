# ChaunkUp

Paste a suspicious message and get a scam verdict explained in English, Urdu and Roman Urdu.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Secrets

Add these in the workspace Secrets panel:

- `GEMINI_API_KEY` — required for analysis. Get one at https://aistudio.google.com/app/apikey
- `DATABASE_URL` — provided by the platform for the built-in Postgres database.
- `SESSION_SECRET` — provided by the platform.

## Phase 4 scope

- Paste text or upload a screenshot, then tap Check.
- Same structured verdict card for screenshots as for text, with language toggle, highlighted red flags and a recommended-actions checklist.
- Add, list and remove trusted contacts in My Circle.
- When a result is Scam or Suspicious, tap Alert my Circle to open a WhatsApp or email share link with the generated alert text.
- Nothing is sent automatically; a tap is always required.
- Reminder to hide OTPs, PINs and card numbers; screenshots are not stored.
- Safe fallback for unreadable images or invalid AI output.
- Each successful check is saved to the `checks` table.

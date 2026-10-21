# ChaunkUp

Paste a suspicious message or upload a screenshot and get a scam verdict explained in English, Urdu and Roman Urdu.

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

## Phase 6 scope

- Paste text or upload a screenshot, then tap Check.
- Verdict card with language toggle (English, Urdu, Roman Urdu), highlighted red flags and a recommended-actions checklist.
- Screenshots without a readable message show "We could not read a message in this image, try pasting the text instead." and no verdict.
- Add, list and remove trusted contacts in My Circle; contacts are validated and duplicates are blocked.
- When a result is Scam or Suspicious, tap Alert my Circle to open a WhatsApp or email share link with the generated alert text.
- Nothing is sent automatically; a tap is always required.
- History page lists past checks; tap any check to reopen its full result.
- Soft pink and lavender theme, mobile-friendly layout, and a header with the tagline "Chaunk up. Don't fall for it."
- Reminder to hide OTPs, PINs and card numbers; screenshots are not stored.
- Safe fallback for unreadable images, invalid AI output and failed uploads.
- 30-message accuracy test set (`src/lib/testSet.ts`) covering English, Urdu and Roman Urdu.
- Run the accuracy benchmark with `npm run evaluate`.

## Accuracy benchmark

Run the built-in 30-message test set (20 scams, 10 genuine) against the live Gemini model:

```bash
npm run evaluate
```

The script prints each message's expected verdict, actual verdict, confidence and pass/fail status, plus strict and lenient accuracy percentages.

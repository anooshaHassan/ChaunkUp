# ChaunkUp

Paste a suspicious message or upload a screenshot and get a scam verdict explained in English, Urdu and Roman Urdu.

## Team

 Team name: ChaunkUp Guards
- Team lead: Anoosha Hassan (Devpost: hassan4720336)
- Team member: Sana (Devpost: sana4706687)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Secrets

Add these in the workspace Secrets panel:

- `GEMINI_API_KEY`: required for analysis. Get one at https://aistudio.google.com/app/apikey
- `DATABASE_URL`: created automatically when you add the built-in database.

## Database migrations

Migrations in `db/migrations` are applied automatically when running `npm run build`. To run them manually:

```bash
npm run migrate
```

## Privacy

- Each browser gets an anonymous owner id generated on first visit and stored in `localStorage` under the key `chaunkup_owner`. The id is sent with every API request in the `x-owner-id` header and as an `owner` query parameter fallback. My Circle and History are scoped to that owner id and are not shared across browsers.
- There are no accounts or logins, so a new visitor starts with an empty Circle and History.

## Features

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

## Accuracy results

- Test set: 30 messages in `src/lib/testSet.ts` (20 scam, 10 genuine, mixed English, Urdu and Roman Urdu).
- Manual check: 10 messages from the set checked one at a time (7 scam, 3 genuine), 10 of 10 verdicts correct.
- Full benchmark: `npm run evaluate`.

## Known limitations

- Data is private per browser, not per account. Clearing browser data or switching devices starts with an empty Circle and History.
- The anonymous id is sent in a header and in the URL query, and it is not a login, so do not use the app for sensitive information.
- Red flag highlighting depends on the AI returning phrases that match the message text, so some messages show a verdict without highlights.
- Very long text, no internet, or an AI failure all show the safe fallback: "Could not analyse this message, treat it with caution."
- Screenshots get a verdict but no highlights, because the original text is not available.
- Free-tier Gemini limits can slow or block repeated checks.
- Alerts only open a WhatsApp or email link. Nothing is sent automatically.
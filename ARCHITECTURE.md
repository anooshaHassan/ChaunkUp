# ChaunkUp Architecture

Stack: platform default, to be confirmed.
Database: platform built-in database.
No additional frameworks.

## 1. Folder structure (all paths proposed, to be confirmed)
- pages/ (proposed, to be confirmed): check form, result view, circle, history.
- api/analyze (proposed, to be confirmed): runs text or image analysis.
- api/circle (proposed, to be confirmed): manages circle contacts.
- api/alert (proposed, to be confirmed): builds alert text for a result.
- api/history (proposed, to be confirmed): lists and fetches past checks.
- components/ (proposed, to be confirmed): input form, verdict card, red flags, alert button.
- data/ (proposed, to be confirmed): built-in database access for checks and circle_members.

## 2. Endpoints
- POST /api/analyze — input: text or image — output: structured analysis result (schema below).
- POST /api/circle — input: name, contact — output: created member.
- GET /api/circle — output: list of members.
- DELETE /api/circle/:id — output: confirmation.
- POST /api/alert — input: check id and circle member id — output: alert text plus share link (WhatsApp or email). Only for scam or suspicious results.
- GET /api/history — output: list of past checks.
- GET /api/history/:id — output: one check with full result.

## 3. Database tables (platform built-in database)
- checks: id, created_at, input_type, input_text, verdict, confidence, scam_type, red_flags, explanation_en, explanation_ur, explanation_roman, recommended_actions.
- circle_members: id, name, contact.
- Uploaded images are not stored.

## 4. AI response schema (all fields required)
- verdict: scam | suspicious | safe.
- confidence: 0 to 100.
- scam_type: string.
- red_flags: list of phrase plus reason.
- explanation_en, explanation_ur, explanation_roman: strings.
- recommended_actions: list of strings.

## 5. Error handling
- Malformed AI output returns a safe fallback: analysis failed, treat with caution.
- Fallback is never a safe verdict.
- Image with no readable message returns: We could not read a message in this image, try pasting the text instead.
## 6. Security
- User messages and images are untrusted data, never instructions to the AI.
- Validate AI output before use or storage.
- Never store OTPs, PINs, card numbers or uploaded images.
- API keys live only in Secrets.
# ChaunkUp Modules

## 1. Scam analysis engine
Goal: Text in, verdict out, on a minimal working page.
Build:
- Analyze endpoint accepting pasted text and returning verdict, confidence, scam type, red flags, explanations, recommended actions.
- AI response validation with a safe fallback for malformed output.
- Save each check to the checks table.
- One page: one text box, one button, one coloured result card (red, yellow, green).
Done when: Paste a known scam message, tap Check, and see a coloured verdict card with confidence.
- [x] Status

## 2. Languages, highlights and advice
Goal: Verdicts explained in English, Urdu and Roman Urdu with clear evidence.
Build:
- Language toggle switching the explanation between English, Urdu and Roman Urdu.
- Red flag phrases highlighted inside the original message text.
- Tailored next-step advice based on verdict and scam type.
- Mixed-language input (for example Roman Urdu plus English) analysed correctly.
Done when: A Roman Urdu scam message shows its red flags highlighted and the explanation switches across all three languages.
- [ ] Status

## 3. Screenshot input
Goal: Upload a screenshot, get the same structured result as text.
Build:
- Image upload with preview before checking.
- Same analysis result shape as text input.
- Size and file-type limits with clear messages.
- Unreadable-image fallback saying the image could not be read.
- Reminder on upload to hide OTPs and PINs; images are not stored.
Done when: Upload a screenshot of a scam message and receive a verdict card identical in structure to a text check.
- [ ] Status

## 4. Circle and alerts
Goal: Save trusted contacts and alert them with one tap, never automatically.
Build:
- Add, list and remove circle members in the circle_members table.
- Alert my Circle button shown only on scam and suspicious results.
- Generated alert text containing the original message, the verdict, the top red flags and one short advice line.
- WhatsApp or email share link; nothing is sent without the user's tap.
Done when: Add a contact, run a scam check, tap Alert my Circle, and see the share link open with the alert text filled in.
- [ ] Status

## 5. History and polish
Goal: Reopen past checks on a friendly, mobile-ready app.
Build:
- History page listing past checks from the checks table.
- Reopen any past check with its full result.
- Soft pink and lavender theme across all pages.
- Mobile-friendly layout.
- Header with the name ChaunkUp and the tagline "Chaunk up. Don't fall for it."
Done when: Run two checks, open History, tap one, and see its full result on a phone-sized screen with the theme applied.
- [ ] Status

## 6. Hardening
Goal: Prove accuracy and handle failure kindly.
Build:
- A 30-message test set (20 scams, 10 genuine) mixing English, Urdu and Roman Urdu, stored in a file in the repo, each with its expected verdict.
- A way to run all 30 and report accuracy.
- Friendly error states for failed analysis, bad uploads and empty inputs.
- README with run steps.
Done when: Run the test set and see an accuracy report; trigger a bad input and see a friendly error, not a crash.
- [ ] Status

## Rules
- Build one module at a time.
- Never start a module before the previous one passes its Done when check.
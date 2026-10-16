# ChaunkUp

> **Chaunk up. Don't fall for it.**
> An AI scam shield that explains scams in Urdu, Roman Urdu and English, and alerts the people you trust.

---

## 1. Overview

ChaunkUp is a web app that checks suspicious messages, screenshots and voice notes, tells the user in plain language whether it is a scam, explains why, and lets them alert a trusted "Circle" (family and close friends) with one tap.

"Chaunk" is Urdu for being startled into alertness. ChaunkUp is the nudge that wakes someone up before they send money, share an OTP or click a fake link.

**Team name:** ChaunkUp Guards
**Project name:** ChaunkUp
**Project type:** Digital trust and safety, AI for social good

---

## 2. Problem

Scams in Pakistan arrive through the channels people use every day: WhatsApp, SMS, calls and social media. Common patterns include:

- Fake mobile wallet messages (JazzCash, Easypaisa) asking for an OTP or PIN
- "You won a prize" messages impersonating government or corporate schemes
- Fake job and visa offers that ask for an upfront fee
- Fake bank or courier links that steal credentials
- Impersonation of a relative asking for urgent money

The people most at risk are often those least comfortable with technology: parents, grandparents and first-time smartphone users. Existing tools have three gaps:

1. **Language:** most scam detectors work only in English, while scam messages are often in Urdu or Roman Urdu.
2. **Explanation:** a bare "spam" label does not teach the user anything or build lasting awareness.
3. **Isolation:** the victim decides alone, in the moment, under pressure. There is no easy way to ask a trusted person.

---

## 3. Target Users

| User | Need |
|---|---|
| **Everyday smartphone users** | Quickly check a suspicious message before acting |
| **Parents and elders** | A simple, forgiving interface with clear colour-coded verdicts and Urdu explanations |
| **Young adults ("the family tech support")** | A way to protect relatives and be alerted when a relative receives a scam |
| **Students and job seekers** | Spot fake internship, job and scholarship offers |

---

## 4. Solution

Users submit a suspicious item in any of three ways:

1. Paste text
2. Upload a screenshot
3. Upload a voice note (stretch goal)

ChaunkUp returns:

- **Verdict:** Scam, Suspicious or Looks Safe, shown as a red, yellow or green card
- **Confidence level**
- **Red flags found:** the exact phrases and patterns that triggered the verdict, highlighted in the original text
- **Plain-language explanation** in English, Urdu and Roman Urdu
- **What to do next:** concrete advice (do not click, do not share OTP, block the number, report to the official channel)
- **Alert my Circle:** one tap sends the flagged message and verdict to trusted contacts

---

## 5. Key Features

### 5.1 Core (MVP)

- **Multilingual scam analysis** for English, Urdu script and Roman Urdu
- **Screenshot analysis** using a vision-capable model
- **Colour-coded verdict card** with confidence and red flags
- **Highlighted suspicious phrases** inside the original message
- **Safety advice** tailored to the scam type
- **Circle:** add trusted contacts and alert them with one tap, using a pre-filled WhatsApp or email share link
- **History page** of past checks

### 5.2 Stretch

- **Voice note analysis** via speech-to-text, then scam analysis
- **Trending scams board** built from anonymised user reports
- **Scam Safety Score** per Circle member, encouraging safe habits
- **Mascot reactions** (a small alert character that says "Chaunk up!" when a scam is found)

---

## 6. User Flow

1. User opens ChaunkUp and sees a single, clean input screen.
2. User pastes a message or uploads a screenshot.
3. The app shows a short loading state, then the verdict card.
4. User reads the explanation in their preferred language.
5. If the verdict is Scam or Suspicious, user taps **Alert my Circle**.
6. The trusted contact receives the message, the verdict and the reasons, and can reply to the user directly.

---

## 7. System Architecture

```
Browser (HTML / JS frontend)
        |
        v
FastAPI backend
   |-- /analyze   : text or image in, structured verdict out
   |-- /circle    : manage trusted contacts
   |-- /alert     : build the shareable alert for the Circle
   |-- /history   : list past checks
        |
        |-- LLM API (analysis and explanation, structured JSON output)
        |
        v
SQLite (users, circle members, check history)
```

### Structured model output

The analysis endpoint instructs the model to return only JSON with a fixed schema:

- `verdict`: scam, suspicious or safe
- `confidence`: 0 to 100
- `scam_type`: for example wallet-phishing, prize-scam, fake-job, impersonation, fake-link
- `red_flags`: list of exact phrases found in the message, each with a short reason
- `explanation_en`, `explanation_ur`, `explanation_roman`: plain-language explanations
- `recommended_actions`: list of next steps

The backend validates the JSON before it reaches the interface, and falls back to a safe "could not analyse, treat with caution" response if parsing fails.

---

## 8. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Backend | Python, FastAPI | Fast to build, clean async API |
| AI | Claude API (text and vision) | Strong multilingual understanding and reliable structured output |
| Frontend | HTML, CSS, JavaScript | Zero build step, easy to demo on any device |
| Database | SQLite | No server, one file, fine for a prototype |
| Alerts | WhatsApp and email share links | Free and works with the apps people already use |
| Deployment | Local for the demo; Render or Railway if time allows | Presentable from a laptop with a backup recording |

---

## 9. What Makes ChaunkUp Different

1. **Built for Urdu and Roman Urdu** from day one, not translated as an afterthought.
2. **Explains, not just labels.** Every verdict teaches the user the pattern, so they get better at spotting scams themselves.
3. **The Circle.** The core idea is that a scam decision should not be made alone. Protection becomes social and family-centred.
4. **Local scam knowledge.** Prompts and test sets are built around scams actually seen in Pakistan.
5. **Designed for non-technical users:** one input, one clear answer, large readable text.

---

## 10. Impact

- Reduces the chance that someone shares an OTP, sends money or installs a malicious link
- Builds scam awareness in a language people think in
- Brings families into the protection loop, so the less technical members are never on their own
- Can be extended to universities, workplaces and community organisations as a shared scam-alert channel

**Success metrics for the prototype:**

- Correct verdict on a local test set of at least 30 real-style scam and legitimate messages
- Time from paste to verdict under 10 seconds
- A first-time user completes a check and a Circle alert without instructions

---

## 11. Privacy and Ethics

- **Minimal data:** only the submitted message and its verdict are processed. No access to the user's inbox, contacts or phone.
- **User-initiated alerts:** nothing is sent to the Circle unless the user taps the button.
- **Local-first storage:** history is kept in the user's own database file in the prototype.
- **Sensitive details:** the interface reminds users to hide OTPs, PINs and card numbers before uploading screenshots.
- **Honest uncertainty:** the app shows confidence and uses the Suspicious category instead of forcing a yes or no. It advises verification through official channels, and does not claim to be infallible.
- **No impersonation of authorities:** the app only advises users to contact official channels, never presents itself as one.

---

## 12. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| False positives (a real message flagged as scam) | Three-level verdict, confidence score, advice to verify via official channels |
| False negatives (a scam marked safe) | Conservative prompt that treats urgency, fees, OTP requests and unknown links as strong signals; "Looks Safe" always carries a reminder to stay cautious |
| Prompt injection (a scam message that tries to instruct the AI) | The message is passed as quoted data inside a fixed instruction frame, output is schema-validated, and the model is told to treat the content as untrusted |
| Model or API failure during the demo | Graceful error state, pre-tested sample messages, and a recorded backup demo |
| Poor screenshot quality | Clear guidance on the upload screen and a fallback prompt to paste the text |

---

## 13. Development Plan (4 Days After Kickoff)

| Day | Focus |
|---|---|
| **Day 1** | Backend setup, `/analyze` endpoint, prompt design, test set of 30 messages |
| **Day 2** | Screenshot input, Urdu and Roman Urdu explanations, phrase highlighting |
| **Day 3** | Circle and alert flow, history, UI polish |
| **Day 4** | Bug fixes, deployment, backup demo video, pitch deck |

---

## 14. Future Roadmap

- WhatsApp bot so users can forward a message and receive the verdict in-chat
- Browser extension and mobile share-sheet integration
- Community scam reporting with an anonymised trends dashboard
- Partnerships with universities and consumer-protection bodies to share verified scam patterns
- Support for Sindhi, Pashto, Punjabi and Balochi

---

## 15. Team

**Team name:** ChaunkUp Guards
**Team lead:** Anoosha Hassan
**Team size:** 2

| Name | Role | Devpost username |
|---|---|---|
| Anoosha Hassan | Team lead, backend and AI integration | hassan4720336 |
| Sana | Team member, frontend and testing | sana4706687 |

---

## 16. Repository Status

This repository currently contains documentation only, in line with the hackathon rules. All implementation begins after the official kickoff, and this SPEC.md will serve as the starting point for the build.

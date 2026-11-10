# HumAIn website (static, no build step)

Plain HTML + CSS + JS for the HumAIn YouTube channel ([@HumAInExplained](https://www.youtube.com/@HumAInExplained)).
Static site for GitHub Pages at [humainexplained.com](https://humainexplained.com) (repo: `irlafleur/humain-site`). The beehiiv email form is not connected yet, so the public site shows “Sign-up opens soon” and the course stays readable.

## Preview it locally

```bash
cd humain-site
python3 -m http.server 8765      # then open http://localhost:8765/
```

(Opening `index.html` directly with a double-click also works, but the clipboard "Copy" buttons need `http://localhost` or HTTPS.)

## What's in the site

| Page | File |
|---|---|
| Home (hero, latest videos, sign-up CTA) | `index.html` |
| Agent Library (10 copyable prompt packs) | `agents.html` |
| Prompt Library (20 prompts, 5 categories, copy button, search/filter) | `prompts.html` |
| Free Course overview + gate | `course.html` |
| 11 lessons (gated) | `course/lesson-01-….html` … `lesson-11-….html` |
| About | `about.html` |
| Privacy & email consent (CASL) | `privacy.html` |
| Post-sign-up landing page (sets the flag, redirects to the course) | `welcome.html` |
| Styles / scripts | `assets/css/style.css`, `assets/js/site.js`, `assets/js/config.js` |
| Video thumbnails (from the three YouTube videos) | `assets/img/` |
| Screenshots | `screenshots/` |
| Optional page generator (content lives here) | `_src/` |

Course outline: Part 1 Foundations (1 What is an agent, 2 How to prompt well, 3 Iterate and verify) · Part 2 Tokens (4 Tokens and context windows, 5 Token optimization) · Part 3 Agents (6 What's inside an agent, 7 Build your first agent, 8 Make it reusable, 9 The power of 1%, 10 Integrate into everyday tools, 11 Stay safe).

### Editing content

The HTML files are plain and can be edited by hand. If you prefer editing the source content, edit `_src/content_*.py` and run `python3 _src/build.py` (Python 3 only, no packages). That regenerates the HTML. It is optional: hosting needs no build.

## How the soft gate works

1. A visitor opens a lesson. If `localStorage["humain_subscribed_v1"]` isn't `"1"`, the lesson text is hidden and a sign-up form is shown.
2. The CASL consent checkbox is **never pre-ticked**. Ticking it reveals the beehiiv embed (an iframe).
3. After sign-up, beehiiv redirects the visitor to `welcome.html`, which sets the flag and sends them back to the lesson they came from (or `course.html`).
4. There is an "Already on the list? Unlock on this device" link for returning subscribers on a new device (honour system).
5. While `BEEHIIV_EMBED_URL` is empty the sign-up form shows a **Sign-up opens soon** message (no email is collected) and the course stays readable. Once the embed URL is set, the consent box reveals the beehiiv form and the soft gate turns on.

### Limits of this gate (please read)

- **It is not security.** A static site can't hide content. The lesson text is in the HTML that every visitor downloads, so anyone who views the page source, disables JavaScript, or sets the localStorage flag can read it. The "Already on the list?" link also unlocks without checking an email.
- With JavaScript off, lessons are visible (fail-open) and the form doesn't work.
- The GitHub repo must be public for free GitHub Pages, so the lesson source is public too.
- The gate is meant to *invite* sign-ups and build the list, not to guarantee that everyone who reads has signed up. Don't put anything in the lessons that you'd need to keep private or paid.
- If you later want real gating: send the lessons by email (beehiiv automation / welcome email), or host the course in a tool that supports member logins. Check current beehiiv plan limits first (the free plan was checked on Nov 10, 2026: up to 2,500 subscribers, 1 digital product).

## What's placeholder / TODO

| Where | What | Status |
|---|---|---|
| `assets/js/config.js` → `BEEHIIV_EMBED_URL` | beehiiv embed iframe `src` | **EMPTY (sign-up opens soon)** |
| `assets/js/config.js` → `SENDER_MAILING_ADDRESS` | Mailing address (CASL requires sender identification) | **set** |
| `assets/js/config.js` → `SENDER_CONTACT_EMAIL` | Contact email shown on forms, About and Privacy | **set** |
| `about.html` | Optional note about who is behind the channel (HTML comment marks the spot) | optional |
| `privacy.html` | Plain-language draft, not legal advice. Have it reviewed. | review |
| Video descriptions on YouTube | Add the site link after Ian-Remi's OK | not done |

The three video thumbnails were downloaded from YouTube's thumbnail service for the channel's own videos. The lesson text mentions the $40 dinner video's finding in general terms ("the total didn't match its own list"), so please confirm it still matches the published cut.

## Steps only you (Ian-Remi) can do

1. **Create a free beehiiv account** at beehiiv.com and create a publication (HumAIn). Don't add a card; the Free plan is $0 (up to 2,500 subscribers when checked on Nov 10, 2026: re-check the pricing page).
2. In your publication's email settings, make sure the footer shows your **mailing address and an unsubscribe link**, and consider turning on **double opt-in** (it also gives you proof of consent).
3. **Create the embedded form:** Settings → Subscribe Forms → create a form → in its **Settings** tab choose **Redirect to an external website** and enter your final `welcome.html` URL (full `https://…`, see step 6). Optionally tick "Remove emails from the redirect URL".
4. **Copy the embed code** (the `<iframe …>`). Paste *only the `src` URL* into `assets/js/config.js` as `BEEHIIV_EMBED_URL`. Adjust `BEEHIIV_EMBED_HEIGHT` if the form is cut off.
5. **Sender fields are filled** in `config.js` (they appear in the consent text, About and Privacy). Update them if the mailing address or contact email changes.
6. **GitHub Pages is set up** on the public repo `irlafleur/humain-site` (branch `main`, folder `/ (root)`). `_src/` and `screenshots/` are not in the published repo. A `CNAME` file points at `humainexplained.com` and `.nojekyll` is included. After DNS is in place, the beehiiv redirect URL for step 3 is `https://humainexplained.com/welcome.html` (until then, `https://irlafleur.github.io/humain-site/welcome.html`).
7. **Test the full flow in a private browser window** with a real email you control: tick the box → sign up → you should land on the welcome page and then the lesson. If the redirect doesn't fire, check the redirect URL in beehiiv. (beehiiv notes that some platforms restrict iframe navigation; GitHub Pages doesn't.)
8. **Custom domain `humainexplained.com`:** add the GitHub Pages DNS records at the registrar (apex A/AAAA + `www` CNAME), wait until they resolve, then tick *Enforce HTTPS* in the repo's Pages settings. Then set the beehiiv redirect URL to `https://humainexplained.com/welcome.html`.
9. Add the site link to the YouTube descriptions / pinned comment (after you approve).

## Facts verified on November 10, 2026 (Eastern Time) and where they come from

Cited on the relevant pages. Re-check before launch, because plans and limits change.

- Token rules of thumb and token categories: OpenAI Help Center "What are tokens and how to count them?"; OpenAI API "Advanced usage".
- Context windows and "context rot": Anthropic docs "Context windows"; Anthropic "Effective context engineering for AI agents".
- Prompt structure advice (clear and direct, examples, role, XML tags optional): Anthropic "Prompting best practices" and "Prompt engineering best practices for 2026".
- Custom GPT retirement (scheduled Dec 11, 2026): OpenAI Help Center FAQ. Gems read-only Nov 17, 2026 and removed Dec 17, 2026 (personal accounts 18+), skills available on all Google AI tiers 18+: Gemini Apps Help and Google blog (Sep 30, 2026).
- ChatGPT Projects (unlimited projects, 5 files on Free): OpenAI Help Center. Claude Projects (free accounts, max 5 projects, sharing only on Team/Enterprise): Claude Help Center.
- Zapier Free (100 tasks/month, two-step Zaps): Zapier Help + pricing page. Make Free (1,000 credits/month): Make pricing page.
- beehiiv embed redirect ("Redirect to an external website"): beehiiv Help "Creating an embedded subscribe form".
- CASL consent (unchecked opt-in box, identify the sender with mailing address and contact, state that consent can be withdrawn): CRTC FAQ, CRTC Bulletin 2012-549, Canada Gazette (Electronic Commerce Protection Regulations).
- Prompt injection definition and safety advice: OpenAI "Understanding prompt injections".
- No statistics are quoted. The 1%-a-day figures (1.35×, 2.70×, 37.8×; and the hypothetical $1,000 at 7% example) were computed directly. The made-up token price example is labelled as pretend.

## Quality checks that were run

- Playwright + Chrome: copy button, filters, gate (locked/unlocked), preview unlock, embed injection, welcome redirect, sign-out, progress, mobile nav: all pass; no console errors.
- axe-core 4.14: no violations on every page in locked and unlocked states.
- No horizontal scroll at 390 px wide; all internal links and anchors resolve; no duplicate IDs.
- Whole site is about 300 KB of HTML/CSS/JS plus three thumbnails; no frameworks, no web fonts, no trackers.

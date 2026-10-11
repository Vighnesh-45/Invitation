# ARCHITECTURE.md: Wedding Invitation Website

## 1. Summary
A **static, no-backend** single-page site. All content comes from one `events.json` and a `config` file. Everything dynamic (countdown, calendar links, intro animation) runs client-side. This keeps it cheap, fast, and with a minimal attack surface.

## 2. Decisions

| Decision | Choice | Why |
|---|---|---|
| Rendering | Static HTML + CSS + vanilla JS (ES modules) | No framework needed for one page; fastest load. Vite as optional dev tooling |
| Alternative | Astro or Vite + TypeScript | Use if you want components/typed data; still outputs static files |
| Backend | None | No accounts, no stored guest data |
| RSVP (optional) | Google Form link or WhatsApp deep link | Avoids building and securing a database |
| Maps | Google Maps embed iframe + external link | No custom map code |
| Calendar | Google Calendar template URL + generated `.ics` | No OAuth, no API key |
| Animation | CSS transitions + IntersectionObserver; Lottie only if needed | Small, GPU-friendly |
| Hosting | Netlify / Vercel / Cloudflare Pages (free tier) | HTTPS, CDN, custom headers |

## 3. System diagram

```
Guest phone/browser
        │  HTTPS
        ▼
   CDN / Static host ──► index.html, /css, /js, /assets, events.json
        │
        ├──► Google Maps (iframe embed)         [third party]
        ├──► Google Calendar (URL redirect)     [third party, user-initiated]
        └──► Google Form / WhatsApp (optional)  [third party, user-initiated]
```

No server code, no database.

## 4. Project structure

```
wedding-site/
├── index.html
├── public/
│   ├── og-preview.jpg            # 1200×630 WhatsApp/OG image
│   ├── favicon.svg
│   ├── fonts/                    # self-hosted WOFF2 (subset)
│   ├── avatars/
│   │   ├── groom.svg
│   │   └── bride.svg
│   ├── motifs/                   # toran, garland, paisley, ajrak SVGs
│   └── ics/                      # optional pre-generated .ics files
├── src/
│   ├── data/
│   │   ├── events.json           # single source of truth for events
│   │   └── config.json           # names, wedding datetime, contact
│   ├── js/
│   │   ├── main.js               # bootstraps modules
│   │   ├── intro.js              # avatar intro + open transition
│   │   ├── countdown.js
│   │   ├── events.js             # renders event cards from JSON
│   │   ├── calendar.js           # Google URL + .ics builders
│   │   ├── maps.js               # builds embed/directions URLs
│   │   └── reveal.js             # IntersectionObserver animations
│   └── css/
│       ├── tokens.css            # colours, spacing, fonts
│       ├── base.css
│       ├── components.css
│       └── motion.css
├── _headers                      # security headers (Netlify/Cloudflare)
├── README.md
├── DESIGN.md
├── ARCHITECTURE.md
└── SECURITY.md
```

## 5. Data model

```json
// events.json
[
  {
    "id": "mehendi",
    "title": { "en": "Mehendi", "mr": "मेहंदी", "sd": "مهندي" },
    "start": "2027-02-12T16:00:00+05:30",
    "end":   "2027-02-12T20:00:00+05:30",
    "venueName": "Venue name",
    "address": "Full street address, city, PIN",
    "mapQuery": "Venue name, full address",
    "description": { "en": "...", "mr": "...", "sd": "..." }
  }
]
```

`config.json`: `groomName`, `brideName` (each with en/mr/sd), `weddingStart` (ISO with `+05:30`), `contact`, `siteUrl`.

Validate this JSON at build time (simple script or JSON Schema) so a typo cannot ship a broken page.

## 6. Key modules

### Countdown
- Target = `new Date(config.weddingStart)` (offset included, so identical in every timezone).
- `setInterval` at 1s, cleared when the tab is hidden (`visibilitychange`) and recomputed on return to avoid drift.
- At ≤ 0, switch to "Today is the day / Shubh Vivah" state.

### Google Calendar link
```js
const fmt = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, ""); // UTC Zulu
const url = ev =>
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(ev.title.en)}` +
  `&dates=${fmt(ev.start)}/${fmt(ev.end)}` +
  `&details=${encodeURIComponent(ev.description.en)}` +
  `&location=${encodeURIComponent(ev.venueName + ", " + ev.address)}` +
  `&ctz=Asia/Kolkata`;
```

### .ics generation
Build a `VCALENDAR` string (`BEGIN:VEVENT`, `DTSTART`, `DTEND`, `SUMMARY`, `LOCATION`, `DESCRIPTION`, `UID`, `DTSTAMP`), escape commas/semicolons/newlines per RFC 5545, and download via `Blob` + object URL. "Add all" emits multiple `VEVENT`s in one file.

### Maps
- Embed: `https://www.google.com/maps?q=<encoded mapQuery>&output=embed` (no key), or the Maps Embed API with a referrer-restricted key.
- Directions link: `https://www.google.com/maps/dir/?api=1&destination=<encoded mapQuery>`.
- Create iframes lazily (on scroll into view) to protect load performance.

### Intro and transitions
- Intro is a fixed overlay; "Open Invitation" adds a class that runs the exit animation, then removes the overlay and focuses the hero heading (for keyboard/screen-reader users).
- `sessionStorage` flag to skip the intro on reload if desired (optional).
- Section reveals via a single IntersectionObserver.

### Optional guest personalisation
`?guest=Name` shows "Dear Name". Insert via `textContent` only, never `innerHTML`, and cap length (see SECURITY.md).

## 7. Build and deploy
- Dev: `npm run dev` (Vite) or any static server.
- Build: `npm run build` → `dist/` (minified, hashed assets).
- CI: validate JSON → build → Lighthouse CI check (perf ≥ 90, a11y ≥ 95) → deploy.
- Deploy `dist/` to the static host; attach custom domain; force HTTPS.
- Set cache headers: long-lived immutable for hashed assets, short for `index.html` and `events.json`.

## 8. SEO / sharing
- `<title>`, meta description, Open Graph and Twitter tags, 1200×630 preview image.
- `robots.txt` and `<meta name="robots" content="noindex">` if the couple wants the site unlisted.

## 9. Testing checklist
- Countdown correct when device timezone ≠ IST (test by changing system tz).
- Calendar links open prefilled in Google Calendar; `.ics` imports into Apple/Outlook with correct times.
- Maps render and fall back to a text address if blocked.
- Devanagari and Perso-Arabic render correctly on iOS Safari and low-end Android.
- Reduced-motion mode; keyboard-only navigation; screen reader pass.
- Real-device test of the WhatsApp link preview.

## 10. Future options (only if needed)
- RSVP with a tiny serverless function + managed DB (see SECURITY.md for requirements).
- Photo gallery / live-stream link section.
- Language switcher that shows one language at a time.

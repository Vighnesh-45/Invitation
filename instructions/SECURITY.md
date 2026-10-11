# SECURITY.md: Wedding Invitation Website

## 1. Threat model (what actually matters here)

| Asset | Risk | Likelihood | Impact |
|---|---|---|---|
| Venue addresses and timings | Shared beyond intended guests | Medium | Medium (privacy/safety) |
| Family names, phone number | Scraped, spam, scam calls | Medium | Medium |
| Domain / hosting account | Takeover, defacement | Low | High (reputation) |
| Google Maps API key (if used) | Abuse and billing | Medium | Medium |
| Guests | XSS via URL parameter, malicious redirects | Low | High |
| Optional RSVP data | Leak, spam submissions | Medium | High |

Being a static site with no database and no logins removes most server-side risks. Keep it that way unless a feature truly requires otherwise.

## 2. Principles
1. **Collect nothing you don't need.** No accounts, no stored guest data.
2. **Minimise third parties.** Only Google Maps / Calendar, loaded on demand.
3. **Treat all URL input as hostile.**
4. **Least privilege** for hosting and keys.

## 3. Transport and hosting
- HTTPS only; HSTS enabled (`max-age=31536000; includeSubDomains`).
- Host on a reputable static platform (Netlify, Vercel, Cloudflare Pages).
- Enable 2FA on the hosting, domain registrar, DNS, and Git accounts.
- Protect the main branch; require PR review or at least 2FA-protected pushes.
- Turn on registrar lock and DNSSEC if available. Auto-renew the domain.

## 4. Security headers (`_headers` example)

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://maps.gstatic.com https://maps.googleapis.com; font-src 'self'; frame-src https://www.google.com https://maps.google.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
```

Notes:
- No inline scripts or styles, so no `'unsafe-inline'`. Put JS/CSS in files (or use nonces/hashes).
- Self-hosting fonts avoids allowing Google Fonts domains.
- Test the CSP in the browser console; Maps embed may need small adjustments to `img-src` / `frame-src`.
- `frame-ancestors 'none'` blocks clickjacking. Do not enable it if you intend to embed the invite elsewhere.

## 5. Input handling and XSS
- The only user-controlled input is the optional `?guest=` parameter.
  - Read with `URLSearchParams`, trim, limit to ~40 characters, allow letters (any script), spaces, dots, hyphens.
  - Insert with `element.textContent = value`. Never `innerHTML`, `document.write`, or `eval`.
- Event data comes from your own `events.json`; still render with `textContent` and build links with `encodeURIComponent`.
- Calendar and map URLs are generated only for fixed hosts (`calendar.google.com`, `www.google.com/maps`); never accept a destination URL from the query string (prevents open redirects).
- `.ics` output: escape `\`, `;`, `,` and newlines per RFC 5545 so event text can't inject extra fields.

## 6. External links and embeds
- All outbound links: `rel="noopener noreferrer" target="_blank"`.
- Map iframes: `title`, `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`; consider `sandbox="allow-scripts allow-same-origin allow-popups"`.
- Prefer the **keyless** embed URL. If you use the Maps Embed API key:
  - Restrict by **HTTP referrer** (your domain only) and **API** (Maps Embed only).
  - Set a low quota and a billing alert.
  - Remember the key is public in the page source, so restriction is what protects it.

## 6a. Dependencies and supply chain
- Prefer zero runtime dependencies. If using Vite or similar, keep it as a dev dependency only.
- Commit the lockfile; run `npm audit` and enable Dependabot or Renovate.
- No third-party scripts from CDNs; if unavoidable, pin version and use Subresource Integrity (`integrity` + `crossorigin`).
- No analytics by default. If you want visitor counts, use a privacy-friendly, cookie-less option and mention it in the footer.

## 7. Privacy and access control
- **Venue and personal details:** decide who should see them. Options, from weakest to strongest:
  1. Unlisted link shared on WhatsApp, with `noindex` meta and `robots.txt` disallow.
  2. A shared passphrase gate. **Note:** a client-side gate only hides content from casual visitors; anyone can read the JS or JSON. Do not rely on it for real secrecy.
  3. Real access control (host-level password protection such as Netlify password or Cloudflare Access) if addresses must be genuinely private.
- Show a phone number only if needed; prefer a `wa.me` link over printing the number. Consider a family contact rather than a personal number.
- Strip EXIF/location metadata from all photos and exports before publishing.
- Add a short privacy note in the footer: "This site stores no personal data."
- No cookies are required. If you add any, add a consent notice.

## 8. If you add RSVP later (don't, unless needed)
Prefer a Google Form or WhatsApp. If you must build one:
- Serverless endpoint with strict input validation (length, type, allowlist).
- Rate limiting + CAPTCHA/Turnstile; honeypot field.
- Store minimal fields (name, count, dietary note). Encrypt at rest, restrict DB access to the function only, auto-delete after the event.
- CSRF protection (same-origin, `Origin` check), JSON only, CORS locked to your domain.
- Never log full payloads; keep secrets in environment variables, never in the repo.

## 9. Secrets and repo hygiene
- No API keys, tokens, or private contact data committed; add `.env*` to `.gitignore`.
- Run a secret scanner (e.g. gitleaks) in CI or as a pre-commit hook.
- Keep the repo private, or make sure nothing in it is sensitive if public. `events.json` ships to the browser, so treat it as public.

## 10. Availability and recovery
- Static hosting on a CDN handles WhatsApp-style traffic spikes.
- Keep a copy of the build and source in a second location.
- Keep a PDF/image version of the invitation as a fallback if the site is down.

## 11. Pre-launch checklist
- [ ] HTTPS and HSTS active; security headers verified (securityheaders.com or similar)
- [ ] CSP has no violations in the console on all sections
- [ ] `?guest=<script>alert(1)</script>` renders as harmless text
- [ ] Maps key (if any) restricted by referrer and API, quota set
- [ ] 2FA on hosting, registrar, DNS, Git
- [ ] `noindex` set (if unlisted) and `robots.txt` present
- [ ] No secrets in repo history; secret scan clean
- [ ] Photo EXIF removed
- [ ] Dependencies audited; lockfile committed
- [ ] Decision made on how private venue addresses must be
- [ ] Fallback image/PDF invite prepared

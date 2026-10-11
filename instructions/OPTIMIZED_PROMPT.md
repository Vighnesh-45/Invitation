# Optimized Prompt: Marathi × Sindhi Wedding Invitation Website

> Fill the `{{PLACEHOLDERS}}` first, then paste everything under "THE PROMPT" into your builder (Claude, Claude Code, etc.). Attach `DESIGN.md`, `ARCHITECTURE.md`, `SECURITY.md` as context.

## Inputs to fill in

| Placeholder | Example |
|---|---|
| `{{GROOM_NAME}}` / `{{BRIDE_NAME}}` | Groom (Marathi), Bride (Sindhi) |
| `{{FAMILY_NAMES}}` | "Son of Mr. & Mrs. ..., Daughter of ..." |
| `{{MEHENDI}}`, `{{HALDI}}`, `{{WEDDING}}` | Date, start time, end time (IST), venue name, full address |
| `{{WEDDING_DATETIME_ISO}}` | `2027-02-14T11:30:00+05:30` |
| `{{CONTACT}}` | Phone / WhatsApp for queries (optional) |
| `{{SINDHI_SCRIPT}}` | Devanagari, Perso-Arabic, or both (recommended: both) |
| `{{HOSTING}}` | Netlify / Vercel / Cloudflare Pages / GitHub Pages |

---

## THE PROMPT

**Role:** You are a senior front-end engineer and UI designer building a mobile-first, single-page wedding invitation website.

**Goal:** A warm, celebratory invitation for `{{GROOM_NAME}}` (Marathi) and `{{BRIDE_NAME}}` (Sindhi) that blends both cultures and feels like the couple is personally welcoming the guest.

### 1. Opening experience (first screen)
- Full-screen intro with illustrated avatars of the groom and bride, standing side by side in wedding attire, hands in namaste / welcoming pose.
- Speech-bubble or banner greeting in **Marathi and Sindhi**, plus English, e.g. "स्वागत आहे / ڀليڪار / Welcome". Reveal with a gentle animation.
- A single "Open Invitation" button (diya or flower motif) that transitions into the main page.
- Honour `prefers-reduced-motion` (skip animation, show static state).

### 2. Avatars
- Groom: Marathi wedding look (cream/off-white or yellow kurta-dhoti or shela, pheta/turban, mundavalya pearl strands on the turban or forehead).
- Bride: Sindhi wedding look (red/maroon bridal lehenga or saree, heavy gold jewellery, dupatta, Sindhi/ajrak-inspired embroidery accents).
- Same illustration style for both, flat-vector, friendly, transparent background. Deliver as SVG (preferred) or optimized WebP/PNG at 1x/2x. Include alt text.
- Cultural details are to be confirmed with the families before final.

### 3. Theme and colour
- Warm palette only: saffron, marigold, deep maroon, terracotta, gold, cream background.
- Subtle bilingual accents: Marathi (Devanagari) headings in one accent, Sindhi lines in another, so each language is visibly highlighted.
- Decorative motifs: toran/mango-leaf border, marigold garland, paisley (Marathi), ajrak-inspired geometric border (Sindhi). Keep them tasteful and light.
- Fonts: Devanagari serif for Marathi headings, Noto Naskh Arabic (or Nastaliq) for Perso-Arabic Sindhi, a refined serif + clean sans for English. Self-host fonts.
- Meet WCAG AA contrast on all text.

### 4. Sections (single page, smooth-scroll, sticky mini-nav)
1. **Hero:** names in three scripts, wedding date, tagline.
2. **Our families / blessing line.**
3. **Countdown** to `{{WEDDING_DATETIME_ISO}}` (days, hours, minutes, seconds). Compute against the fixed IST offset so it is identical for every viewer. Show a celebratory state when it reaches zero.
4. **Events:** Mehendi, Haldi, Wedding Day as timeline cards. Each card: icon, bilingual event name, date, time, venue, dress-code hint (optional), and the buttons below.
5. **Venue map:** per event, an embedded Google Map plus "Get Directions" link.
6. **Save the Date:** per event and for "all events".
7. **Footer:** contact, blessing, thank-you message.

### 5. Events data (single source of truth)
Store events in one `events.json`; the UI renders from it. Per event: `id`, `title` (en/mr/sd), `start`, `end` (ISO with +05:30), `venueName`, `address`, `mapQuery`, `description`.

### 6. Add to Google Calendar
- Button builds a `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...&ctz=Asia/Kolkata` link (no API key, no OAuth, no backend).
- Also offer a downloadable `.ics` file (works for Apple/Outlook). "Add all events" generates one `.ics` containing all three.
- URL-encode every field.

### 7. Maps
- Use Google Maps embed iframes (`loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`, `title` attribute) plus an external "Open in Google Maps" link.
- If using the Maps Embed API key, restrict it by HTTP referrer and API.

### 8. Motion
- Smooth section transitions with IntersectionObserver reveal (fade + translate), parallax-free, 60fps, GPU-friendly properties only (`transform`, `opacity`).
- Floating petals / diya flicker as subtle ambient effects, pausable, disabled under reduced motion.

### 9. Non-functional requirements
- Mobile-first (most guests open via WhatsApp). Test at 360px width.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90. Hero under 150 KB of images, total initial load under 1 MB.
- Semantic HTML, keyboard navigable, `lang` attributes on bilingual text (`mr`, `sd`, `en`) and `dir="rtl"` for Perso-Arabic blocks.
- Open Graph / Twitter card with a preview image so the WhatsApp link looks good.
- No tracking by default. Follow `SECURITY.md` for headers and CSP.

### 10. Output
- Project structure per `ARCHITECTURE.md`, running locally with one command, deployable as static files.
- README with: how to edit events, replace avatars, change colours, deploy.
- Briefly list any assumptions you made.

---

## What was improved vs. the original prompt

- Added a **role, goal, and output spec**, so the builder knows what "done" looks like.
- Turned vague phrases ("aesthetic", "smooth transitions") into **measurable requirements** (palette, fonts, performance budgets, motion rules).
- Specified the **bilingual handling** (scripts, fonts, `lang`/`dir`) which is the easiest thing to get wrong.
- Fixed **timezone correctness** for countdown and calendar links (IST offset).
- Chose a **no-backend calendar approach** (Google template URL + `.ics`) instead of OAuth.
- Added **events as data**, accessibility, reduced-motion, OG preview, and security expectations.
- Flagged **cultural details to verify** with the families.

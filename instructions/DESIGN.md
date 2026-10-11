# DESIGN.md: Marathi × Sindhi Wedding Invitation

## 1. Design principles
1. **Welcoming first:** the couple greets the guest before any information appears.
2. **Two cultures, one family:** Marathi and Sindhi elements sit side by side, never one dominating.
3. **Warm and light:** rich colour in accents, generous cream whitespace so text stays readable.
4. **Mobile first:** most guests arrive from a WhatsApp link on a phone.
5. **Gentle motion:** celebratory, never distracting; always optional.

## 2. Colour system (warm palette)

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FFF8EC` | Page background |
| `--ivory` | `#FFFDF7` | Cards |
| `--saffron` | `#F4A02B` | Primary accent, buttons |
| `--marigold` | `#FFC23C` | Highlights, garland |
| `--terracotta` | `#C8553D` | Secondary accent, Sindhi highlights |
| `--maroon` | `#7A1F2B` | Headings, footer |
| `--gold` | `#B8860B` | Borders, ornaments |
| `--ink` | `#3B1F1A` | Body text |

**Language highlighting:** Marathi (Devanagari) text uses `--maroon`; Sindhi text uses `--terracotta`; English uses `--ink`. Each bilingual heading shows a small language tag chip (म / سن / EN) on hover or focus. Verify AA contrast on cream (maroon and ink pass; check terracotta at small sizes and darken if needed).

Gradient (hero): `linear-gradient(180deg, #FFE3B3 0%, #FFF8EC 60%)`.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Marathi headings | Tiro Devanagari Marathi or Noto Serif Devanagari | `lang="mr"` |
| Sindhi (Perso-Arabic) | Noto Naskh Arabic (or Noto Nastaliq Urdu) | `lang="sd" dir="rtl"`, increase line-height to 1.9 |
| Sindhi (Devanagari) | Noto Sans Devanagari | If the family prefers this script |
| English display | Cormorant Garamond or Playfair Display | Names, section titles |
| English body | Inter or Poppins | 16px base, 1.6 line-height |

Self-host all fonts (WOFF2, subset to needed glyphs). Fluid sizes with `clamp()`; hero names ≈ `clamp(2.4rem, 8vw, 5rem)`.

## 4. Layout and spacing
- 8px spacing scale (8, 16, 24, 32, 48, 64, 96).
- Content max-width 1100px; text blocks max 65ch.
- Breakpoints: 360 (base), 768, 1100.
- Section order: Intro → Hero → Families → Countdown → Events → Maps → Save the Date → Footer.

## 5. Avatars (illustration spec)

| | Groom (Marathi) | Bride (Sindhi) |
|---|---|---|
| Garment | Cream/yellow kurta with dhoti or shela | Red/maroon bridal lehenga or saree |
| Headwear | Pheta (turban), possibly with mundavalya pearl strings | Dupatta over head, maang tikka |
| Jewellery | Gold chain, ring | Heavy gold necklace, bangles, nath (optional) |
| Details | Paisley or minimal zari border | Ajrak-inspired / Sindhi embroidery trim |
| Pose | Namaste, slight smile | Namaste, slight smile |

- Flat vector, consistent line weight, transparent background, canvas 600×900.
- Export SVG (grouped layers: body, arms, face, accessories) so arms/eyes can be animated; fallback WebP.
- Provide `alt`: "Illustration of the groom in a Marathi wedding outfit welcoming you."
- Have both families approve attire details before finalising.

## 6. Decorative motifs
- Top border: toran / mango-leaf strip.
- Dividers: marigold garland SVG (tileable).
- Backgrounds: very low-opacity (4–6%) paisley and ajrak geometric patterns.
- Icons: diya (intro), mehendi hand/cone, turmeric bowl, mandap / kalash.

## 7. Components

**Intro screen:** full viewport, gradient, avatars at 40% width each, centered speech banner with the trilingual welcome, "Open Invitation" button.

**Hero:** names in Marathi / Sindhi / English, "&" ornament, date line, scroll cue.

**Countdown:** four tiles (Days, Hours, Minutes, Seconds), ivory card, gold border, number in display font; labels in three languages. `aria-live="off"` on ticking numbers; a visually hidden static sentence updates once a minute for screen readers.

**Event card:** icon, bilingual title, date/time, venue, short note, buttons: *Add to Calendar*, *Directions*. Timeline connector on desktop, stacked on mobile.

**Map block:** 16:9 iframe, rounded corners, lazy loaded, "Open in Google Maps" link beneath.

**Buttons:** pill shape, saffron fill with maroon text (check contrast) or maroon fill with cream text; 48px min touch target; focus ring 3px gold.

## 8. Motion spec

| Interaction | Effect | Duration / easing |
|---|---|---|
| Intro load | Avatars slide in from sides, greeting fades up | 900ms, `cubic-bezier(.22,1,.36,1)` |
| Open Invitation | Curtain/toran lifts, intro fades, page scrolls to hero | 1000ms |
| Section reveal | Fade + 24px translate-up on enter viewport | 600ms, staggered 80ms |
| Countdown tick | Number flips/fades | 250ms |
| Petals / diya | Slow ambient loop | Pausable |

Rules: animate only `transform` and `opacity`; respect `prefers-reduced-motion: reduce` (disable ambient, replace transitions with simple fades); provide a small "pause animations" toggle.

## 9. Content notes (to verify with families)
- Greeting wording in Marathi and Sindhi, confirm spelling with a native speaker.
- Event names: Mehendi, Haldi (Marathi: हळद), Wedding / Lagna (लग्न). Confirm preferred Sindhi terms and spelling.
- Include family blessing line and hosts' names in the format the families use.

## 10. Accessibility checklist
- Contrast AA, visible focus states, skip-to-content link.
- `lang` per text run; `dir="rtl"` for Perso-Arabic blocks.
- Alt text on avatars; decorative motifs `aria-hidden`.
- Touch targets ≥ 44px; works at 200% zoom.
- Map iframes have `title`; every map has a text address alternative.

## 11. Performance budget
- Initial load < 1 MB; hero images < 150 KB; fonts < 200 KB total (subset).
- LCP < 2.5s on mid-range Android over 4G.

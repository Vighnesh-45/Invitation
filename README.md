# Wedding Invitation Website

A warm, celebratory, mobile-first wedding invitation website in English, built according to the architectural, design, and security specifications in the `instructions/` folder.

---

## 🌟 Key Features

1. **Welcoming Opening Experience (First Screen):**
   - Full-screen intro with illustrated avatars of Groom (Rohan) and Bride (Simran).
   - Welcoming banner: *"Welcome to Our Wedding! A Warm & Heartfelt Celebration"*.
   - "Open Invitation" button with interactive Diya motif and lifting transition.

2. **Hero & Guest Personalization:**
   - Elegant typography featuring the couple's names: **Rohan & Simran**.
   - Secure URL guest personalization via `?guest=Name` (e.g. `?guest=Amit%20Sharma`), rendered with `textContent` to prevent XSS.

3. **Our Families & Sacred Blessings:**
   - Family cards for Groom's family and Bride's family.
   - Elders' and grandparents' blessings and words of gratitude.

4. **Timezone-Accurate Live Countdown:**
   - Accurate IST countdown timer (`Asia/Kolkata`, UTC+5:30) displaying Days, Hours, Minutes, Seconds.
   - Screen-reader accessible live announcement (`aria-live="polite"` once per minute) and celebratory zero-state banner.

5. **Wedding Events Timeline (Single Source of Truth):**
   - Driven entirely from [src/data/events.json](file:///d:/Invitation/src/data/events.json):
     - **Mehendi & Sangeet Ceremony** (12th Feb 2027)
     - **Haldi & Pithi Ceremony** (13th Feb 2027)
     - **Wedding Ceremony & Grand Reception** (14th Feb 2027)
   - One-click **"Add to Google Calendar"** (prefilled template link, zero backend).
   - RFC 5545 compliant **.ICS file generator** (Apple Calendar, Outlook).
   - Master **"Download All Events (.ics)"** button.

6. **Venues & Directions:**
   - Lazy-loaded embedded Google Maps (`loading="lazy"`, sandbox protected).
   - "Open in Google Maps" turn-by-turn navigation links.

7. **Save the Date & RSVP:**
   - Direct WhatsApp confirmation button with prefilled celebratory text (`wa.me`).
   - Direct family coordinator phone link.

8. **Ambient Motion & Accessibility:**
   - Floating marigold petals and subtle Diya glow.
   - Pause/Resume animations button (`⏸ / ▶`).
   - Strict `prefers-reduced-motion` compliance and WCAG AA contrast.
   - Zero tracking cookies, zero external runtime dependencies.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Development
```bash
# Install development dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build
```bash
npm run build
```
The optimized, static output will be generated in the `dist/` directory ready for any CDN.

---

## 🎨 How to Customize

### 1. How to Edit Events
All event details are stored in [src/data/events.json](file:///d:/Invitation/src/data/events.json):
```json
{
  "id": "wedding",
  "icon": "mandap",
  "title": {
    "en": "Wedding Ceremony & Grand Reception"
  },
  "start": "2027-02-14T11:30:00+05:30",
  "end": "2027-02-14T16:30:00+05:30",
  "venueName": "The Royal Palace Grand Mandap",
  "address": "Senapati Bapat Road, Shivajinagar, Pune, Maharashtra 411016",
  "mapQuery": "Senapati Bapat Road, Shivajinagar, Pune",
  "dressCode": {
    "en": "Traditional Indian / Royal Festive"
  },
  "description": {
    "en": "Sacred wedding vows, pheras, and auspicious blessings uniting two loving families, followed by a grand celebratory banquet."
  }
}
```

### 2. How to Edit Names, Couple & RSVP Details
Configuration is located in [src/data/config.json](file:///d:/Invitation/src/data/config.json):
- `groomName`, `brideName`
- `weddingStart` (ISO 8601 with `+05:30`)
- `contact.whatsappPhone` and `contact.displayPhone`

### 3. How to Replace Images & Motifs
- Lord Ganesha image: [public/assets/ganesha.png](file:///d:/Invitation/public/assets/ganesha.png)
- Groom portrait: [public/assets/groom_image.png](file:///d:/Invitation/public/assets/groom_image.png)
- Bride portrait: [public/assets/bride_image.png](file:///d:/Invitation/public/assets/bride_image.png)
- Motifs (Toran, Garland, Diya, Paisley, Ajrak): located in [public/motifs/](file:///d:/Invitation/public/motifs/)

### 4. How to Change Colors & Fonts
Theme tokens are defined in [src/css/tokens.css](file:///d:/Invitation/src/css/tokens.css):
- `--cream`, `--ivory` (Backgrounds)
- `--saffron`, `--marigold` (Accents)
- `--maroon` (Headings, Borders)
- `--gold` (Ornaments)

---

## 🔒 Security & Privacy Spec
Follows [instructions/SECURITY.md](file:///d:/Invitation/instructions/SECURITY.md):
- Static architecture (no database, no credentials committed).
- Strict Content-Security-Policy & HSTS defined in [_headers](file:///d:/Invitation/_headers).
- Safe parameter insertion (`element.textContent = value`).
- Keyless Google Maps embeds and direct RFC 5545 downloads.

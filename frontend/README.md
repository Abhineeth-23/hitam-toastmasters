# HITAM Toastmasters — website

A dark, theatrical, scroll-driven site for the HITAM Toastmasters Club.
Stack: **Vite + React 19 + TypeScript**, **GSAP** (ScrollTrigger, SplitText), **Lenis** smooth scroll, **Three.js** (custom shaders), **Motion** (Framer Motion).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/
```

## The concept: "Find Your Voice"

| Idea | Where |
| --- | --- |
| Velvet **curtain** page transitions (True Maroon folds, gold fringe), with the destination page's name on the closed curtain | `components/Curtain.tsx` |
| **Preloader**: the timing lights come on while the Toastmaster of the Day opens with "Ladies and gentlemen…" | `components/Preloader.tsx` |
| **Voice Field** WebGL hero: sound-wave ridges that murmur like live speech, swell under the cursor and ripple on click. Optionally, the visitor's **own voice** drives them through the mic | `webgl/voiceField.ts`, `sections/Hero.tsx` |
| Variable-weight **"VOICE"** letters that bulk up near the pointer | `components/ProximityText.tsx` |
| **Speech-timer scroll progress**: reading a page is a 7-minute speech. Green at 5:00, yellow at 6:00, red at 7:00 | `components/ScrollTimer.tsx` |
| Manifesto lights up word by word while an "Ah-Counter" crosses out filler words | `sections/Manifesto.tsx` |
| Horizontal **Anatomy of a meeting**, with a playable widget on every role card (gavel, timer lights, ah-counter, word of the day…) | `sections/Anatomy.tsx`, `RoleWidgets.tsx` |
| A working **Table Topics** roulette with a real 1–2 minute timer. The room glows green, then yellow, then red | `sections/TableTopics.tsx` |
| A Pathways path that draws itself as you scroll, with a "you" marker travelling along it | `sections/Pathways.tsx` |
| Draggable, throwable photo pile | `sections/Moments.tsx` |
| Spotlight finale: your cursor is the only light on stage | `sections/Spotlight.tsx` |
| Page colour shifts as sections cross the viewport (`data-theme` on sections) | `lib/useSectionThemes.ts` |
| Navigation: full-screen menu with rolling letters and image previews, live breadcrumbs, a **⌘/Ctrl + K** command palette (pages, people, awards, actions), and a magnetic, context-aware cursor | `components/` |

Accessibility: reduced-motion is honoured everywhere (no smoothing, static layouts). There's keyboard navigation, focus rings and a skip link, and touch devices get fallbacks.

## Routes (from `reference/preview.webp`)

`/` · `/about` · `/achievements` · `/history` · `/team` · `/join` · `/contact` · `/admin`

## Updating content (most important)

**All club content is in `src/data/club.ts`.** It came from HITAM's published Toastmasters documents (hitam.org, 2025 and 2026).

- **New term?** Add it to the top of `TERMS`. The Team page always shows `TERMS[0]`, and History, the command palette and the stats update themselves.
- **New award?** Add it to `ACHIEVEMENTS`. Set `highlight: true` to show it as a big card.
- **Email:** `CLUB.email` is a placeholder (`toastmasters@hitam.org`). **Replace it with the club's real inbox before going live.**
- **Photos** are in `public/images/` (cropped from the college PDF, so they're low-resolution). Swap in higher-quality originals with the same filenames.

## Admin (`/admin`)

Default passcode: **`gavel@2018`**. To change it, put the SHA-256 of a new passcode into `PASS_HASH` in `src/pages/Admin.tsx`:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSCODE').digest('hex'))"
```

What officers can do:
- Override the next meeting's date, venue, theme, word of the day and role assignments. The site-wide countdown and the Contact page pick these up.
- Publish announcements. Pinned ones show in the home hero.
- View guest RSVPs and contact messages, and export them as CSV.
- Back up or restore everything as JSON.

⚠️ **The site has no backend, so this is a client-side gate.** It keeps casual visitors out of the UI, but it is not real security. Data is stored in *that browser's* localStorage: RSVPs submitted on a visitor's phone never reach an officer's laptop. To get shared, real-time data, connect the store (`src/lib/store.ts`) to a hosted backend such as Supabase, Firebase or Formspree.

## Deploy

The site is static, so any host works. SPA fallbacks are included: `vercel.json` for Vercel and `public/_redirects` for Netlify.

## Brand

Colours come from the Toastmasters International brand manual: Loyal Blue `#004165`, True Maroon `#772432`, Cool Gray `#A9B2B1`, Happy Yellow `#F2DF74`. **HITAM Green** `#208840` (sampled from the HITAM logo) is used sparingly and only for things that are about the college: the "HITAM" in the logo, green-dot "campus" eyebrows (`.eyebrow--campus`), the HITAM co-brand row in the footer, and the timing-light green, which shares its hue. Use `var(--campus)` for green text; it adjusts to each section theme. Montserrat is the manual's suggested stand-in for Gotham. The footer carries the club-website disclaimer the manual requires. The globe mark in the header is an original drawing, not the TI logo. If you want the official logo, get it from the Toastmasters Brand Portal.

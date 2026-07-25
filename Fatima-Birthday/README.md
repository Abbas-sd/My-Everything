# Fatima Birthday ❤️

An interactive birthday journey — a personal surprise site built with vanilla HTML, CSS, and JavaScript.

## Project structure

```
Fatima-Birthday/
├── index.html
├── css/
│   ├── style.css
│   └── animations.css
├── js/
│   ├── app.js        — scene manager, music controls
│   ├── content.js    — your letter (edit this!)
│   ├── effects.js    — stars, hearts, typewriter, confetti
│   └── scenes.js     — per-scene init/cleanup
├── assets/
│   ├── music/        — add piano.mp3 here
│   ├── images/
│   ├── fonts/
│   └── icons/
└── README.md
```

## What's built

| Scene | Status |
|-------|--------|
| 1 – The Beginning | ✅ Dark sky, twinkling stars, fade-in text, Start button |
| 2 – A Magical Journey | ✅ Pink/purple sky, floating hearts, zoom, typewriter |
| 3 – Birthday Cake | ✅ Cake, candles, confetti, blow-out, optional birthday song |
| 4 – Your Letter | ✅ Envelope open animation, handwritten letter |
| 5–9 + 365 notes | 🔜 Coming next |

## Run locally

Open `index.html` in a browser, or use a simple local server:

```bash
npx serve .
```

## Personalize your letter

Edit `js/content.js` — replace the placeholder letter and sign it with your name.

## Add music

Drop a soft piano track at `assets/music/piano.mp3`. Optional: `assets/music/happy-birthday.mp3` for Scene 3. Music starts on first tap/click (browser autoplay rules).

## 7-day build plan

1. **Today** — Scenes 1–2 ✅
2. **Day 2** — Scenes 3–4 (cake + letter) ✅
3. **Day 3** — Scenes 5–6 (photos + 50 reasons)
4. **Day 4** — Scenes 7–8 + finale
5. **Day 5** — 365 daily notes + localStorage
6. **Day 6** — Your personal content (letter, photos, notes)
7. **Day 7** — Polish + deploy (Netlify / GitHub Pages)

---
name: Akshay Maru Portfolio
description: A Renaissance sketchbook kept by an engineer. Classical European art in the craft, code in the annotations, management in the structure. Plain English for a global audience.
colors:
  canvas: "oklch(0.965 0.012 85)"
  canvas-deep: "oklch(0.935 0.018 82)"
  canvas-shade: "oklch(0.90 0.024 80)"
  rule: "oklch(0.82 0.025 75)"
  ink: "oklch(0.22 0.02 55)"
  ink-muted: "oklch(0.40 0.02 58)"
  ink-faint: "oklch(0.52 0.02 62)"
  sanguine: "oklch(0.52 0.14 38)"
  sanguine-deep: "oklch(0.45 0.13 36)"
  gilt: "oklch(0.68 0.10 78)"
  lapis: "oklch(0.42 0.10 255)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Garamond, Georgia, serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Cormorant Garamond, Garamond, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.05
  body:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sm: "2px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.sanguine}"
    textColor: "{colors.canvas}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  input-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: Akshay Maru Portfolio

## 1. Overview

**Creative North Star: "The Atelier Notebook"**

Leonardo's notebooks were part art, part engineering spec, part project plan. This portfolio is built the same way. Classical European art gives it its feel: warm canvas, a Garamond book face, red-chalk accents, gilt hairlines, framed "figures" with gallery captions. Code shows up in the annotations: monospace labels, `// 01 — section` markers, dotted-key ledgers. Management shows up in the structure: clear sections, numbered figures, a leadership ledger, claims stated plainly.

**The art lives in form, never in wording.** All copy is plain, professional English that reads well in translation and in a second language. No archaic phrasing, no Latin, no costume.

This system rejects: literal medieval pastiche (blackletter, heraldry, "thou"), dark navy plus neon, glassmorphism, gradient text, the hero-metric template (big numbers with small labels), and identical icon-card walls.

## 2. Colors

- **Canvas / Canvas Deep / Canvas Shade**: the page and its raised surfaces. Warm and light, like primed linen under gallery light.
- **Ink / Ink Muted / Ink Faint**: sepia-black for headings, body, and meta.
- **Sanguine** (red chalk): the one accent. Primary hover, the italic emphasis word in a headline, the active state, section markers. Use it on less than 10% of any screen.
- **Gilt**: hairlines only: frames, figure numbers, the monogram ring. Never fills or text blocks.
- **Lapis**: code only: inline `code` and ledger keys.

## 3. Typography

- **Cormorant Garamond** speaks: headlines, figure captions, one italic emphasis word per headline.
- **EB Garamond** reads: all body prose, capped at about 66ch.
- **Geist Mono** annotates: nav, labels, meta, section markers, buttons, ledger keys.
- The `.initial` class opens a key passage with a large italic sanguine initial. Use it at most once per view.

## 4. Structure and ornament

- **SectionRule** (`// 01 — The case` plus a gilt hairline) opens every major section, so the page reads like a commented file.
- **Frame** (`.frame`): a 1px gilt border with an offset outline, like a passe-partout. Use it for the featured work, the capability grid, and the hero study.
- **Drafting grid** (`.drafting`): a faint squared-paper background, used only behind the interactive hero study.
- **Figures**: work cards are numbered `Fig. II…` with mono medium lines (`role · 2025 — NOW`), like gallery placards.
- **Monogram**: an italic "AM" in a gilt ring is the site mark.
- No soft shadows. Depth comes from rules, frames, and canvas tone steps.

## 5. Layout and components

Home page order: **Hero → Exhibition (01) → miii spotlight (02) → Career (03) → Method (04) → Contact (05)**. Each section opens with a `SectionRule`.

- **Hero**: split layout. The statement and CTAs sit on the left; the **Placard** on the right is a gallery wall label that doubles as a live status object (live IST clock, current role, what's being built, open-to).
- **Exhibition**: replaces the card grid. An index wall of works (a vertical tablist with arrow, Home, and End keys; hover previews) next to one lit piece in a frame, with a faint roman-numeral watermark. On mobile, the index becomes a horizontal scroller.
- **miii spotlight**: copy plus a copy-to-clipboard install command, an illustrative terminal session that types itself in when scrolled into view (shown whole under reduced motion), a feature ledger, and provider chips. Use only claims published on miii.in.
- **Career ("Provenance")**: a sticky intro next to a gilt-line timeline. Each role's leadership line is called out in a sanguine-tinted box with a team icon. Every claim must trace to the résumé.
- **Method**: the interactive principles sketch next to a numbered list of capabilities (a list, not a card wall).
- **Contact**: an email composer. Pick a reason, add your name, company, and context, and it opens a pre-addressed email. Nothing is stored.
- **Command palette**: ⌘K / Ctrl+K, or the header search button. Covers sections, deep-dives, copy actions, and external links.
- **Side index**: a scroll-tracking margin table of contents, shown only at 2xl widths, where there is a real margin.
- **Buttons**: hard corners, mono uppercase. Primary is an ink fill that turns sanguine on hover; outline is an ink hairline that turns sanguine.
- **Chat**: canvas field, sanguine caret and send button, a 1px sanguine rule marking the user's turns.

## 6. Do's and Don'ts

- **Do** keep copy plain, specific, and verifiable. A global reader should never need to decode a joke.
- **Do** keep sanguine rare and gilt thin.
- **Do** keep motion to feedback and subtle reveals under 300ms. Respect reduced-motion settings.
- **Don't** use blackletter, heraldry, Latin, or archaic English.
- **Don't** use gradient text, decorative blur, pills on buttons, or stat-wall hero metrics.
- **Don't** use colored side stripes thicker than 1px.

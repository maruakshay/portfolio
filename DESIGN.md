---
name: Akshay Maru Portfolio
description: "Paper Robot" — warm paper, thin dark guides, and a boxy ceramic robot built in three.js. Freelance-first, creator-second.
colors:
  paper: "#efece6"
  ink: "#141414"
  dim: "rgba(20,20,20,.5)"
  guide: "rgba(20,20,20,.09)"
  brand-gradient: "conic-gradient(from 200deg, #ffb347, #ff8a3d 18%, #ff5a5f 34%, #ff3d8b 50%, #ff5a5f 66%, #ff8a3d 82%, #ffb347)"
  accent-text: "#c2410c (token: volt; AA on paper)"
typography:
  sans: "Schibsted Grotesk (variable), 400 for headlines"
  mono: "IBM Plex Mono 300/400/500, uppercase, 0.04–0.06em, every small label"
  serif: "Instrument Serif italic, inner pages only (taglines, the one human word)"
  script: "Yellowtail, header wordmark only"
---

# Design System: "Paper Robot"

## 1. North star

Within five seconds a visitor knows: this person builds AI products, is open for freelance work, and makes content. The robot makes it memorable; the copy makes it clear.

## 2. Layout

- Three fixed 1px guides at 17%, 50%, 83% (`--col: 17%`). Outer guides hide under 900px.
- Fixed chrome (`components/site-header.tsx`, styles in `app/globals.css`): 30px announcement bar that slides away after 40px of scroll or on ×, plus a 52px blurred-paper nav (`17% 1fr 12% 17%`).
- Home (`components/landing/`): Intro → Services → Content are transparent 100vh stages over the robot; Work and Contact are solid paper sheets that cover it. A right rail labels the current section; its MENU opens the ⌘K palette.

## 3. The robot (`components/landing/robot-scene.tsx`)

three.js 0.160 (pinned), RoundedBoxGeometry + RoomEnvironment. Scroll (`p = scrollY / innerHeight`, 0–2, smoothed 8%/frame) blends Intro (full body on a pedestal, head tilted left) to a head close-up for Services and Content. The face shows two blinking eyes, then a play mark once p > 1.55 (Content). Pointer adds parallax and head tracking. Rendering stops once the solid sheets cover the stage.

## 4. Colour

Paper and ink do almost all the work. The brand gradient is decorative only: headline box outlines, the logo, the Hire me border, the robot's face ring. Never put text in gradient except the tiny "Now:" label. Text accents use `volt` (#c2410c), which passes AA on paper.

## 5. Type

Schibsted Grotesk 400 for headlines, set large and quiet. IBM Plex Mono uppercase for labels, buttons, meta. Headline lines sit in 2px gradient-outlined boxes; the first has its bottom-right corner cut at 45°.

## 6. Brand mark

- **Header wordmark:** "Akshay" in Yellowtail (ink, 34px) with "MARU" in IBM Plex Mono (11px, 0.42em tracking, brand gradient) tucked under its baseline. The script has a paper-coloured stroke painted behind its fill, so any crossing cuts a clean gap. Styles: `.wordmark*` in `app/globals.css`; markup in `components/site-header.tsx`.
- **Icon mark:** an "@" stroked with the brand gradient. Used for the favicon (`app/icon.svg`), OG + apple icons (`lib/brand.tsx`) and the inner-page footer (`Monogram` in `components/ornament.tsx`). Change those three together.

## 7. Motion

Reveal: `.rv` blocks rise 26px and fade in over 1s (`cubic-bezier(.2,.7,.2,1)`), staggered .1s. Tab strip slides every 2.4s. Channel swap fades out with a 10px drop over .45s. Everything respects `prefers-reduced-motion`.

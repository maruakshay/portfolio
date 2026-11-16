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

## 3. The town (`components/game/`) — replaces the robot as of 2026-11-16

- `lib/game-data.ts`: spots (experiences from `career`, skill shops, the AI Core), evolution `stages`, street `LAYOUT`. No three.js import, so mobile never downloads it.
- `world.ts` builds the street, buildings (canvas window textures with a night glow map), lamps, trees, sky dome, stars, sun/moon. `daylightAt(hours)` maps local time to sky colours and light levels.
- `character.ts`: jointed person (~1.8 units: hips→knees→feet, shoulders→elbows→hands). Stages swap the top (tee, hoodie, jacket, shirt, blazer), widen the shoulders, and add headphones, backpack, glasses, watch, cape, halo, glow. Hosts reuse it in the outfit of their era; shopkeepers wear an apron.
- Buildings: brick / plaster / glass-curtain-wall styles, instanced framed windows with sills (lit at night), shopfronts with sign bands, cornices, parapets, AC units, water tanks. Street: asphalt, paving, curbs, zebra crossings, parked cars, curbside lamps, instanced trees.
- Conversations (`dialogue.tsx`, scripts from `scriptFor()` in `lib/game-data.ts`): E at a door starts an RPG-style chat with Akshay from that year; the camera cuts to a two-shot; the medal is handed over at the end. The AI Core is a chat with the companion AI.
- Open world (`components/game/vehicles.ts`): parked cars you can get into (F) and drive, four traffic cars that keep to their lanes, brake for you and U-turn at glitch walls, and twelve pedestrians who walk the pavements and hop clear of fast cars. Cars have real car-vs-car collision (traffic stops rather than overlap, waits for a clear lane before U-turning, and turns back if stuck for 3 s). Mouse-look third-person camera (click to lock, Esc frees), a rotating radar with yellow blips for unvisited doors, glowing markers at those doors, and a big banner on every medal / cleared street / boss.
- The gun: a sci-fi blaster in the right hand. Hold left-click or J to fire (24-round magazine, R or auto reload), right-click for an over-the-shoulder aim. Bullets are flat hitscan rays with a small aim-assist cone; they hit bugs, the Black Box, cars and pedestrians, and stop at buildings. Cars smoke, then blow up after ~10 hits (hurts if you're within 4 m) and get replaced 14 s later; a shot pedestrian is knocked flat, gets up and runs off (no blood), and gunfire makes everyone nearby flee. Damage scales with stage power.
- Fights (`FIGHTS`, `FOES`, `BOSS` in `lib/game-data.ts`; `components/game/combat.ts`): five laser-fence walls block the street. Walk up and the foes behind come out (Bugs, Scope Creep, Flaky Tests, Merge Conflicts, Hallucinations, Prompt Injections); beat them all and the wall drops. left-click / J shoots, Q sends the companion AI as a homing shot, Space jumps shots and shockwaves. Every stage adds power and HP. Knocked out = reboot south of the wall. With all 14 medals the boss wall opens and **The Black Box** wakes in an arena in front of the AI Core: slam + shockwave, orb volleys, charges, summons at 66% / 33%; armoured except while dazed. Beating it opens the Core. Progress persists in `am:town:fights:v1`.
- `engine.ts`: input (WASD/arrows, Shift, Space, E), collisions, follow camera, companion orb, effects. `town.tsx` is the React HUD, panels, minimap, win screen and the mobile card. Progress persists in localStorage (`am:town:medals:v1`).

## 3b. The old robot (removed)

three.js 0.160 (pinned), RoundedBoxGeometry + RoomEnvironment. Scroll (`p = scrollY / innerHeight`, 0–2, smoothed 8%/frame) blends Intro (full body on a pedestal, head tilted left) to a head close-up for Services and Content. The face shows two blinking eyes, then a play mark once p > 1.55 (Content). Pointer adds parallax and head tracking. Rendering stops once the solid sheets cover the stage.

## 4. Colour

Paper and ink do almost all the work. The brand gradient is decorative only: headline box outlines, the logo, the Hire me border, the robot's face ring. Never put text in gradient except the tiny "Now:" label. Text accents use `volt` (#c2410c), which passes AA on paper.

## 5. Type

Schibsted Grotesk 400 for headlines, set large and quiet. IBM Plex Mono uppercase for labels, buttons, meta. Headline lines sit in 2px gradient-outlined boxes; the first has its bottom-right corner cut at 45°.

## 6. Brand mark (2026-11-16)

- **The AM mark:** an "A" and "M" drawn as one gradient stroke on an ink tile; the letters read as rooftops, and the pink dot above the M is the companion AI. Geometry lives in `LOGO` in `lib/brand.tsx` (`MarkSvg`), copied in `app/icon.svg`, drawn on canvas for the welcome arch in `components/game/world.ts`. Used in the header, footer (`Monogram`), game HUD, title card and mobile card. It replaces the old text wordmark and the "@" icon.

## 7. Motion

Reveal: `.rv` blocks rise 26px and fade in over 1s (`cubic-bezier(.2,.7,.2,1)`), staggered .1s. Tab strip slides every 2.4s. Channel swap fades out with a 10px drop over .45s. Everything respects `prefers-reduced-motion`.

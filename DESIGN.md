---
name: Akshay Maru Portfolio
description: "Signal" — a dark, high-voltage stage for an engineer who ships fast. Every interaction pays out a small reward; every path ends at a call.
colors:
  canvas: "oklch(0.145 0.012 275)"
  canvas-deep: "oklch(0.18 0.014 275)"
  canvas-shade: "oklch(0.23 0.016 275)"
  rule: "oklch(0.30 0.016 275)"
  ink: "oklch(0.975 0.006 100)"
  ink-muted: "oklch(0.80 0.012 275)"
  ink-faint: "oklch(0.64 0.014 275)"
  volt: "oklch(0.92 0.21 125)"
  flare: "oklch(0.68 0.20 295)"
  cyan: "oklch(0.82 0.12 210)"
  hot: "oklch(0.70 0.20 25)"
typography:
  display: "Bricolage Grotesque, 700–800, tight tracking (-0.03 to -0.045em)"
  serif: "Instrument Serif italic — the one human word per headline (h1/h2/h3 em)"
  body: "Geist, 1.0625rem / 1.6"
  label: "Geist Mono, 0.75rem, uppercase, 0.06em"
---

# Design System: "Signal"

## 1. North star

The visitor should feel momentum within five seconds: this person is confident, fast, and thinks clearly.
The site rewards attention (counters, achievements, games, confetti) and routes every reward toward one action: **book a 20-minute call**.

**Truth rule:** dopamine is allowed; fabrication is not. Every number, outcome, and game answer traces to the résumé, the deep-dives, or miii.in. No fake scarcity, fake viewers, or invented testimonials.

## 2. Colour

- **Volt** (acid lime) is the reward colour: primary CTAs, the emphasis word, unlocked states, scores. When volt appears, something good happened.
- **Flare** (violet) is energy: open-source badges, game kickers, ambient glow.
- **Hot** (coral) means wrong or danger: bugs, missed answers, the last 5 seconds.
- **Cyan** is for code only.
- Ambient glows (blurred volt/flare circles) are allowed behind the hero, arcade, and contact sections only.

## 3. Type

- Bricolage Grotesque, extra-bold, does the talking.
- One Instrument Serif italic `<em>` per headline is the human counterweight. Never synthesize italics on the grotesk.
- Geist Mono annotates: labels, buttons, meta, scores.

## 4. Brand mark

`A_`: a rounded volt tile with a hand-cut A and a blinking terminal cursor ("A, shipping"). Source in `components/ornament.tsx` (`Monogram`), with matching copies in `app/icon.svg` and `lib/brand.tsx` (used by the OG and apple icons). Change all three together.

## 5. Page flow (home)

Hero (claim, rotator, two CTAs, proof wall with count-up) → Marquee → **01 Shipped** (bento cards with cursor spotlight) → **02 Arcade** (3 games) → miii lab → **03 Track record** → **04 Your move** (call CTA plus letter composer). A floating "Book a 20-min call" pill appears after the hero and hides at the contact section.

## 6. Engagement systems

- **Achievements** (`components/achievements.tsx`): 10 achievements with XP, a header meter, and a slide-over panel. Each unlock fires a toast and confetti. At 100%, the panel opens with a call CTA. Progress lives in localStorage only.
- **Arcade** (`components/arcade/`): *Make the call* (real product decisions), *Bug Rush* (20-second reflex game with combos), *Spot the injection* (LLM guardrail quiz). Every result screen ends with "Talk to the real thing" and a pre-filled call request that includes the score.
- **Booking:** set `profile.booking` in `lib/content.ts` to a Cal.com or Calendly URL. Until then, every call CTA opens a pre-written email.

## 7. Motion

Spring for rewards (`--ease-spring`), quart for UI. Pops ≤ 420ms, shakes ≤ 300ms. Everything respects `prefers-reduced-motion`: confetti, count-ups, rotator, and marquee all stand still.

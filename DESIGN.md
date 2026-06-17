---
name: Akshay Maru Portfolio
description: Brutalist-editorial portfolio for an AI Product Engineer. Warm voice, raw structure, terminal-dark.
colors:
  signal-amber: "oklch(0.76 0.16 65)"
  signal-amber-deep: "oklch(0.70 0.16 60)"
  signal-tint: "oklch(0.30 0.05 65)"
  ink-ground: "oklch(0.17 0.008 65)"
  ink-surface: "oklch(0.21 0.008 65)"
  ink-surface-alt: "oklch(0.25 0.008 65)"
  rule-line: "oklch(0.33 0.008 65)"
  paper: "oklch(0.95 0.01 80)"
  paper-muted: "oklch(0.74 0.012 75)"
  paper-faint: "oklch(0.56 0.01 70)"
  destructive: "oklch(0.64 0.19 28)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.75rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.75rem, 4.5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.signal-amber}"
    textColor: "{colors.ink-ground}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-amber-deep}"
    textColor: "{colors.ink-ground}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper-muted}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  badge:
    backgroundColor: "{colors.signal-tint}"
    textColor: "{colors.signal-amber}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  input-field:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  demo-surface:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: Akshay Maru Portfolio

## 1. Overview

**Creative North Star: "The Lit Terminal"**

A warm machine in a dark room. Structure is exposed, like a well-set page proof with the grid lines left visible: rules, columns, and ledger meta on display rather than hidden behind soft cards. The ground is a warm near-black, never navy, never pure `#000`. Type does the heavy lifting, an editorial serif for voice and a monospace for everything procedural. One amber signal is the only color, used like a cursor blink: rare, deliberate, alive. The brutalist shell is the discipline; the warmth in the serif and the amber is the human. That tension is the whole point.

This system explicitly rejects: glassmorphism and blur used decoratively, particle backgrounds, aurora gradients, gradient text, the hero-metric template (big number / small label / gradient accent), generic SaaS portfolio energy (dark navy + neon grid cards), identical icon-grid card walls, and cold brutalism (edge for its own sake, raw at the cost of legibility). It also rejects the previous version's centerpiece entirely: no chat UI, no message bubbles, no "ask me anything" pattern.

**Key Characteristics:**
- Warm near-black ground (`oklch(0.17 0.008 65)`), never navy, never `#000`
- Depth comes from 1px rule lines and surface lightness steps, not shadows
- Hard corners (0 to 4px); pills are forbidden
- Editorial serif (Fraunces) for voice, monospace (Geist Mono) for structure and meta
- Amber appears on under 10% of any screen; its rarity is the signal
- Motion is responsive feedback only: state transitions plus subtle entrance reveals, never choreography

## 2. Colors: The Single Signal Palette

A warm grayscale carries the entire interface; one amber does all the talking.

### Primary
- **Signal Amber** (`oklch(0.76 0.16 65)`): The only chromatic color. Primary CTAs, the live cursor/active state, focus rings, the one link or word per view that must be noticed, the AI demo's active affordance. Appears on under 10% of any screen.
- **Signal Amber Deep** (`oklch(0.70 0.16 60)`): Hover and pressed state for amber surfaces only.
- **Signal Tint** (`oklch(0.30 0.05 65)`): Amber pulled to near-zero chroma against the dark ground. Badge backgrounds, low-emphasis amber washes.

### Neutral
- **Ink Ground** (`oklch(0.17 0.008 65)`): Page background. Warm near-black. The dark room.
- **Ink Surface** (`oklch(0.21 0.008 65)`): Raised surfaces, the AI demo container, input fields. One step up from ground.
- **Ink Surface Alt** (`oklch(0.25 0.008 65)`): Hover surfaces, alternating rows, second-level raise.
- **Rule Line** (`oklch(0.33 0.008 65)`): Every border, divider, and exposed grid line. One weight (1px), one color, used structurally.
- **Paper** (`oklch(0.95 0.01 80)`): Headings and high-emphasis text. Warm paper-white, never pure `#fff`.
- **Paper Muted** (`oklch(0.74 0.012 75)`): Body prose, descriptions. The workhorse.
- **Paper Faint** (`oklch(0.56 0.01 70)`): Meta, timestamps, captions, disabled text.

### Destructive
- **Alert Red** (`oklch(0.64 0.19 28)`): Errors and destructive confirmation only. Never decorative.

### Named Rules
**The One Voice Rule.** Signal Amber appears on no more than 10% of any given screen. If amber is everywhere, it says nothing. Reserve it for the single thing you most want someone to do or notice.

**The No Navy Rule.** The dark ground is warm (hue 65), never blue. Navy-on-neon is the anti-reference; if the background reads cool, the chroma or hue is wrong.

**The No Gradient Text Rule.** Text is never rendered with `background-clip: text` over a gradient. Emphasis comes from weight, size, or the amber, never from a gradient fill.

## 3. Typography

**Display Font:** Fraunces (Georgia, serif fallback)
**Body / Mono Font:** Geist Mono (ui-monospace fallback)

**Character:** A characterful editorial serif paired with a precise monospace. The serif carries the human voice (headlines, statements, the things a person says); the mono carries everything procedural (body copy, labels, meta, the AI demo's input and output). The contrast between the two IS the hierarchy. No third family.

### Hierarchy
- **Display** (Fraunces 400, `clamp(2.75rem, 8vw, 6rem)`, 0.98 line-height, -0.02em): Hero statement only. One per page. Big, tight, serif.
- **Headline** (Fraunces 500, `clamp(1.75rem, 4.5vw, 3rem)`, 1.08, -0.015em): Section openers.
- **Title** (Fraunces 500, 1.5rem, 1.2, -0.01em): Project and subsection headings.
- **Body** (Geist Mono 400, 0.9375rem, 1.7): All prose. Cap line length at 70ch. Color is Paper Muted, not Paper.
- **Label** (Geist Mono 500, 0.75rem, 0.08em, UPPERCASE): Nav, meta, section numbers, ledger labels, badges, timestamps. The terminal signal.

### Named Rules
**The Two Voices Rule.** Serif speaks, mono operates. Never set body prose in the serif, never set a hero statement in mono. The split is load-bearing.

**The Weight Floor Rule.** Never use a weight below 400. Fraunces below 400 reads as decorative; Geist Mono below 400 reads as faint. 400 is the floor for prose, 500 for labels and headings.

## 4. Elevation

This system is flat by structure. There are no decorative drop shadows. Depth is conveyed by 1px Rule Lines and by stepping surface lightness (Ground to Surface to Surface Alt). The exposed grid is the brutalist signal: structure is shown, not blurred away.

### Shadow Vocabulary
- **Hard Offset** (`box-shadow: 4px 4px 0 oklch(0.33 0.008 65)`): The single permitted shadow, used only on the signature AI demo container and only as a deliberate brutalist gesture. A solid, unblurred offset block in the rule-line color. No soft shadows anywhere else.

### Named Rules
**The Rule Line Rule.** Separation and depth come from 1px borders in Rule Line color and from surface lightness steps, never from soft shadows. If you reach for a blurred shadow to separate two elements, use a border or a lightness step instead.

**The State-Response Rule.** Surfaces are flat at rest. The only motion of depth is a border shifting to amber, or a surface stepping one level lighter, in response to hover or focus.

## 5. Components

### Buttons
- **Shape:** Hard corners (0px). No rounding, no pills, ever.
- **Primary:** Signal Amber fill, Ink Ground text (dark text on amber for contrast), Label typography (uppercase mono), 12px/24px padding. Hover: fill shifts to Amber Deep. Transition 180ms ease-out.
- **Outline:** Transparent fill, 1px Rule Line border, Paper text, uppercase mono. Hover: border shifts to Signal Amber, text shifts to Paper. No background fill on hover.
- **Ghost:** No border, no fill, Paper Muted text. Hover: text shifts to Paper, optional Ink Surface Alt background. For nav and low-emphasis controls.
- **Focus:** 2px Signal Amber outline, 2px offset. Never a soft ring.

### Badges / Status
- **Style:** Hard corners (0px), Signal Tint background, Signal Amber text, Label typography. A 6px amber square (not a dot, not a pill) may precede status text. Used for status only ("AVAILABLE FOR WORK"), never for navigation or tags.

### Inputs / Fields
- **Style:** Ink Surface background, 1px Rule Line border, hard corners, Paper text, mono body typography. Placeholder in Paper Faint.
- **Focus:** Border shifts to Signal Amber, plus a 1px amber inset (no blur, no glow). The cursor caret is amber.
- **Error:** Border shifts to Alert Red, message in Alert Red below the field.

### Navigation / Header
- **Style:** Ink Ground background, 1px Rule Line bottom border. No shadow; the rule line alone separates header from content.
- **Type:** Wordmark in Fraunces; nav items in uppercase mono Label. Active item carries an amber underline (1px) or amber text. Hover: Paper Muted to Paper.

### Project Entry (signature component)
The portfolio leads with the work, so the project entry carries the system's character. One per open-source project or role: miii-cli, miii, mii-ai-security, copytap, react-jsx-skills-framework, plus the JupiterOne and Remote Leaps roles.
- **Style:** No card. Entries sit on the Ink Ground, separated by 1px Rule Lines (a ledger, not a card wall). Vary density between entries; never an identical grid.
- **Structure:** A mono uppercase Label row for meta (language, stars, status), a Fraunces Title for the name, mono body for the one specific sentence that earns it. The repo link is the one amber affordance per entry, on hover.
- **Reveal:** Subtle eased entrance on scroll (the responsive-feedback motion), staggered per row, never choreographed.

### AI Chat (small supporting component)
Demoted from centerpiece to a quiet, well-built touch. It must never dominate a viewport or open first.
- **Style:** Ink Surface background, 1px Rule Line border, hard corners. The Hard Offset shadow (the only shadow in the system) is reserved for the single most important focal block; use it here only if the chat is genuinely the page's focal point, otherwise a plain rule-line border.
- **Header:** A mono uppercase Label row reading like a terminal prompt (a leading amber block plus a short name).
- **Input:** Field component as above; the submit affordance is the only persistent amber in the resting view.
- **Output:** Mono body, brief eased entrance, no typewriter gimmick, never a spinner-only dead state.
- **Empty / loading / error states are mandatory**, each specific and in-voice.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Amber for exactly one action or focal point per viewport. Its rarity is the signal.
- **Do** keep the ground warm (hue 65) and near-black (`oklch(0.17 ...)`). Never navy, never `#000`.
- **Do** convey depth with 1px Rule Lines and surface lightness steps, not soft shadows.
- **Do** keep corners hard (0 to 4px). Reserve the single Hard Offset shadow for the AI demo only.
- **Do** split the type: Fraunces serif speaks, Geist Mono operates. Cap body prose at 70ch.
- **Do** write specific, in-voice empty, loading, and error states for the AI demo. The demo is the argument.
- **Do** keep motion to responsive feedback: state transitions and subtle entrance reveals under 300ms, ease-out.

### Don't:
- **Don't** use gradient text (`background-clip: text` over a gradient). Absolute ban. Emphasis comes from weight, size, or amber.
- **Don't** use the hero-metric template (large number, small label, supporting stats row, gradient accent). SaaS cliché. Use specific, earned claims in prose.
- **Don't** use glassmorphism or decorative `backdrop-filter: blur`. Rare and functional (a true overlay scrim) or nothing.
- **Don't** use particle backgrounds, aurora animations, or scroll-driven choreography. Motion is atmosphere; it never carries meaning.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, or callout. Use full Rule Line borders or a Signal Tint background.
- **Don't** build identical icon-grid card walls. Vary density and structure; let the grid lines, not repeated cards, carry the layout.
- **Don't** use dark navy with neon or gradient accents. That is the named anti-reference: generic AI/SaaS portfolio energy.
- **Don't** fall into cold brutalism: raw structure that sacrifices legibility. The grid is opinionated; contrast and line length stay comfortable.
- **Don't** reintroduce any chat or message-bubble UI. The centerpiece is the focused AI demo, not a chatbot.
- **Don't** use pills (`rounded-full`) on any element. Hard corners only.

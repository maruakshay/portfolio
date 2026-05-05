---
name: Akshay Maru Portfolio
description: Personal portfolio for a Senior AI Product Engineer. Curious, human, warm.
colors:
  primary: "#2563eb"
  secondary: "#7c3aed"
  bg: "#f8fafc"
  surface: "#ffffff"
  surface-alt: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  border: "#e2e8f0"
  signal-tint: "#eff6ff"
  destructive: "#dc2626"
typography:
  display:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "#1d4ed8"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  badge:
    backgroundColor: "{colors.signal-tint}"
    textColor: "#1e40af"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  prompt-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "12px"
  chat-bubble-user:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  chat-bubble-assistant:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
---

# Design System: Akshay Maru Portfolio

## 1. Overview

**Creative North Star: "The Open Notebook"**

A designer's personal journal: ordered but not rigid, annotated with intention, visible thinking made real. This system does not perform confidence — it demonstrates it through care. Every element earns its presence. The palette is quiet; the structure is deliberate; the warmth comes from specificity, not decoration.

The physical scene: a hiring manager at an AI company, evaluating candidates on a MacBook in a bright open-plan office. Light mode is correct here, not a default. The design should read cleanly under daylight and hold up in a tab next to a dozen other portfolios that all look the same.

This system explicitly rejects: glassmorphism used decoratively, particle backgrounds, excessive choreography, gradient text, the hero-metric template (big number / small label / gradient accent), generic SaaS portfolio energy (dark navy + neon grid cards), and identical card grids.

**Key Characteristics:**
- Whitespace functions as signal, not filler
- Blue (#2563eb) is a voice, not wallpaper — it appears only when something requires action or attention
- Surfaces are white and flat at rest; shadow responds to state
- Typography tracks tight at large sizes, breathes at body scale
- Motion is atmosphere only: subtle, purposeful, never load-bearing

## 2. Colors: The Restrained Signal Palette

One accent does all the work. Everything else steps back.

### Primary
- **Clear Confidence Blue** (#2563eb): Primary CTA buttons, interactive links, focus rings, active states, user chat bubbles. Appears on less than 10% of any screen. Its rarity is the point.

### Secondary
- **Considered Purple** (#7c3aed): Secondary action buttons and the accent complement. Used sparingly alongside blue when a second action hierarchy is needed; never both at once in the same view without clear purpose.

### Neutral
- **Quiet Slate** (#f8fafc): Page background. The canvas. No pure white — this tint keeps it from feeling clinical.
- **Open White** (#ffffff): Card surfaces, modals, input fields, chat bubbles. Sits above the page background.
- **Lifted Slate** (#f1f5f9): Hover states on ghost elements, muted backgrounds, subtle alternating rows.
- **Deep Ink** (#0f172a): All headings, high-emphasis text. Not pure black — has a slight blue tint that ties it to the accent family.
- **Soft Graphite** (#475569): Body text, descriptions, supporting labels. The workhorse.
- **Paper Edge** (#e2e8f0): All borders and dividers. One weight, one color, consistently applied.
- **Signal Tint** (#eff6ff): Badge backgrounds and hover tints on interactive elements. The blue family at near-zero saturation.

### Named Rules
**The One Voice Rule.** The primary accent (#2563eb) appears on no more than 10% of any given screen. If blue is everywhere, it says nothing. Reserve it for the one thing you most want someone to do or notice.

**The No Gradient Text Rule.** Text is never rendered via `background-clip: text` with a gradient. Gradient text is decoration pretending to be meaning. Use weight or size for emphasis instead.

## 3. Typography

**Display Font:** Geist Sans (system-ui, sans-serif fallback)
**Body Font:** Geist Sans (same family, weight contrast carries the hierarchy)
**Mono Font:** Geist Mono (code snippets, technical labels)

**Character:** A single geometric sans with weight doing the heavy lifting. The hierarchy is scale + weight contrast, not typeface switching. Tight tracking at large sizes gives headings authority; normal tracking at body scale keeps reading comfortable.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.75rem), 1.1 line-height, -0.03em): Hero headline only. One per page.
- **Headline** (700, clamp(1.5rem, 4vw, 2.25rem), 1.2, -0.02em): Section headings, major titles.
- **Title** (700, 1.5rem, 1.3, -0.01em): Card headings, subsection labels.
- **Body** (400, 1rem, 1.625): All prose. Cap line length at 65ch. Color is Soft Graphite (#475569), not Deep Ink.
- **Label** (500, 0.875rem, 1.4): UI labels, badges, navigation items, timestamps, meta text.
- **Caption** (400 or 500, 0.75rem): Footer notes, helper text, "Powered by" lines.

### Named Rules
**The Weight Minimum Rule.** Never use 300 or lighter weight in this system. Geist at low weights reads as hesitant. 400 is the floor for body; 500 for labels; 700 for headings.

## 4. Elevation

Ambient layering: surfaces are never completely flat. A constant, subtle shadow distinguishes cards and interactive elements from the page background at rest, without drama.

### Shadow Vocabulary
- **Ambient** (`box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`): Default state for cards, assistant chat bubbles, textarea containers. Always present; barely visible.
- **Resting** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)`): Default for primary input containers and floating elements.
- **Elevated** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.05)`): Hover state on buttons and interactive cards. Appears only as a response to state.

### Named Rules
**The State-Response Rule.** Shadows increase only in response to user interaction (hover, focus, active). No component goes from ambient to elevated without a triggering state change.

## 5. Components

### Buttons
Shape: gently rounded (8px). The corner is inviting without being childish.

- **Primary:** Clear Confidence Blue (#2563eb) fill, white text, 10px/16px padding, height 40px. Hover: lifts 2px (`translateY(-2px)`) and adds Elevated shadow. Transition: 200ms all.
- **Primary Hover:** Background shifts to #1d4ed8, shadow escalates to Elevated level.
- **Secondary:** Considered Purple (#7c3aed) fill, white text. Same geometry as primary. Used when a second action exists alongside a primary.
- **Outline:** White background, Paper Edge border (#e2e8f0), Deep Ink text. Hover: background lifts to Lifted Slate, border steps to #cbd5e1. Adds mild Resting shadow on hover.
- **Ghost:** No background, no border. Hover: Lifted Slate (#f1f5f9) background appears. Text stays Deep Ink. For navigation and icon-adjacent controls.
- **Icon:** 40x40px square, rounded-lg (8px), same fill logic as primary or ghost. Never round (pill) for icon-only actions — that reads as floating action button.

**Focus:** All buttons show a 2px offset focus outline in #2563eb for keyboard navigation. No ring-style focus; outline-offset-2 is cleaner.

### Badges / Status Chips
- **Style:** Rounded pill (9999px), Signal Tint background (#eff6ff), #1e40af text, Paper Edge border (#e2e8f0). Small dot indicator (6x6px, #2563eb filled) precedes status text.
- **Typography:** 0.75rem, 500 weight.
- **Use:** Status indicators only ("Available for opportunities"). Not for navigation or filtering.

### Prompt Chips
- **Style:** Open White background, Paper Edge border, Soft Graphite text, rounded-lg (12px), 12px internal padding.
- **Hover:** Border shifts to #93c5fd (blue-300), background shifts to Signal Tint (#eff6ff), text shifts to #1d4ed8.
- **Typography:** 0.875rem body weight. Left-aligned text. No icon.
- **Use:** Suggested chat prompts on the hero. Not a general-purpose card pattern.

### Chat Bubbles
The primary interactive component. Two distinct voices.

- **User bubble:** Clear Confidence Blue (#2563eb) fill, white text, rounded-2xl (16px) with the bottom-right corner flattened (`border-bottom-right-radius: 4px`). max-width 42ch on desktop. Shadow-md.
- **Assistant bubble:** Open White fill, Paper Edge border, Deep Ink text, rounded-2xl (16px) with the bottom-left corner flattened (`border-bottom-left-radius: 4px`). Ambient shadow.
- **Loading state:** Assistant bubble shell renders immediately with a pulsing indicator. No layout shift when content arrives.

### Textarea / Chat Input
- **Style:** Open White background, Paper Edge border (#e2e8f0), rounded-xl (12px), Ambient shadow. When inside a chat input container, the outer container takes rounded-2xl (16px) and Resting shadow; the textarea itself has no border.
- **Focus:** Border steps to #60a5fa (blue-400), adds `ring: 2px solid #bfdbfe` (blue-100). The outer container's shadow steps to Elevated.
- **Placeholder:** Soft Graphite, 0.875rem.
- **Send button:** Nested absolutely, rounded-full, primary fill, 40x40px. Disabled state: 50% opacity, no hover effect.

### Navigation / Header
- **Style:** Open White background, Paper Edge bottom border. No shadow — the border alone separates header from content.
- **Title:** 1.125rem, 700 weight, Deep Ink. Subtitle at 0.75rem, Soft Graphite.
- **Controls:** Ghost button pattern (icon only) for close/back actions.

## 6. Do's and Don'ts

### Do:
- **Do** use #2563eb for exactly one action per primary viewport — the most important thing you want the user to do.
- **Do** track headings tight: -0.02em on headlines, -0.03em on display. Never apply loose tracking to large type.
- **Do** cap body prose at 65ch. Anything wider breaks comfortable reading.
- **Do** start with Ambient shadow on resting cards and step up to Elevated only on hover or activation.
- **Do** use rounded-full (9999px) only for pill badges and the chat send button. All other interactive elements use md (8px) or lg (12px).
- **Do** flatten the directional corner on chat bubbles (bottom-right for user, bottom-left for assistant). It signals conversation origin without icons.
- **Do** keep animation duration under 300ms and use ease-out curves. Motion is feedback, not performance.

### Don't:
- **Don't** use gradient text (`background-clip: text` with a gradient fill). This is an absolute ban. The current hero headline uses this pattern — it should be replaced with a single solid color, with weight or size providing emphasis.
- **Don't** use the hero-metric template: large number, small label, supporting stats row with gradient accents. This is a SaaS cliché. The current metrics row (5K+, 25+, 3, 0→1) is this pattern. Replace with specific, earned claims in prose or remove.
- **Don't** use glassmorphism (`backdrop-filter: blur`) for decoration. If a blurred overlay exists, it must serve a functional purpose (modal scrim, focused overlay). Never as aesthetic texture.
- **Don't** use particle backgrounds, aurora animations driving primary visual interest, or scroll-driven choreography. Motion is atmosphere; it never carries meaning.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, or callout. Use background tint or full borders instead.
- **Don't** build identical card grids (same-size card, icon + heading + body text, repeated). If a grid is needed, vary density, not decoration.
- **Don't** use dark navy backgrounds with neon or gradient accents. That is the anti-reference: generic AI/SaaS portfolio energy.
- **Don't** use purple (#7c3aed) as a decorative gradient companion to blue. Secondary means secondary: it appears when a second action exists, not for visual texture.

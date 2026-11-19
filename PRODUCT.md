# Product

## Register

brand

## Users

Two audiences, in this order:

1. **Freelance clients**: founders, startup teams and product leads who need an AI feature or product built (assistants, RAG on their docs, agents, LLM security reviews, the product UI around them). Often non-technical. They want to know within 10 seconds what Akshay builds, that he has shipped it before, and how to start a conversation.
2. **Followers and brands**: people who find him through Instagram (@akshaay.lifts for fitness) and brands looking for creator collabs.

Every headline must make sense in plain English. Technical detail lives in the work deep-dives.

## Product Purpose (2026-11 revamp)

Make two things unmistakable: **Akshay is open for freelance AI projects**, and **he is a content creator**. Every path ends at one of three actions: book a 20-minute intro call, email, or follow @akshaay.lifts on Instagram.

The proof is real and specific: an enterprise AI assistant on AWS Bedrock (JupiterOne), an AI SaaS founded, grown to 40K+ users and sold (Remote Leaps), and open-source AI tooling (miii-cli, miii, mii-ai-security). The Work section and the deep-dives carry it.

The AI chat (/chat) stays a small supporting feature.

## Home (2026-11-19 redo)

Home is a single-page, content-first portfolio (`app/page.tsx`, `components/home/`): hero with a canvas neural-network dot field, proof counters, three Selected Work cards with looping UI illustrations, expandable experience timeline, What I do bento, Open source & 3D lab, Creator, final CTA. Dark "Night Edition" theme: #0B0B0C, warm off-white, one accent (#FF5A1F) only on CTAs and key numbers. Copy lives in `lib/home.ts`; reel thumbnails go in `lib/home.ts` → `reels`.

The 3D town (`components/game/`) moved to `/town`, linked from the hero as an optional way to explore.

## Brand Personality

Dark, premium, editorial. Big serif headlines, precise mono labels, fast subtle motion. Confident without shouting.

## Guardrails

- Truth over hype. Every claim traces to the résumé, the deep-dives, or miii.in. No invented testimonials, client logos, follower counts or fake availability slots.
- Motion is decoration: the page reads fully without canvas or JavaScript motion.
- Reduced motion is honoured (no typing loop, no tab auto-slide, no idle robot motion).
- Personal details beyond what Akshay publishes on his channels stay off the page unless he adds them.

## Accessibility & Inclusion

WCAG AA text contrast on the dark page. All controls keyboard-operable with visible focus. Motion carries delight, never meaning.

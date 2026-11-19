// Content for the town game. Buildings are career stops (oldest at the start of
// the street, newest near the AI Core), shops are skills. Every line traces to
// lib/content.ts, the résumé, or the deep-dives. No invented claims.

import { career, ledger, profile } from "@/lib/content";

export type SpotKind = "experience" | "skill" | "core";

export interface SpotLink {
  label: string;
  href: string;
}

export interface Spot {
  id: string;
  kind: SpotKind;
  name: string;
  /** Short line on the building sign. */
  sign: string;
  title: string;
  meta: string;
  points: string[];
  lead?: string;
  links: SpotLink[];
  /** What the AI companion says it learned when the medal is collected. */
  learned: string;
  /** Building look. `color` tints the walls, `accent` is trim, door and sign. */
  color: string;
  accent: string;
  style: BuildingStyle;
  floors: number;
  /** Nameplate for the host who greets you at the door. */
  host: string;
  /** Index into `stages`: what Akshay wore back then (shops use an apron). */
  era: number;
}

export type BuildingStyle = "brick" | "plaster" | "glass";

const ledgerLink = (title: string): SpotLink[] => {
  const e = ledger.find((l) => l.title === title);
  return e ? [{ label: e.hrefLabel, href: e.href }] : [];
};

const byOrg = (org: string) => {
  const c = career.find((x) => x.org === org);
  if (!c) throw new Error(`career entry missing: ${org}`);
  return c;
};

const exp = (
  org: string,
  look: { color: string; accent: string; style: BuildingStyle; floors: number; era: number },
  learned: string,
  extraLinks: SpotLink[] = [],
): Spot => {
  const c = byOrg(org);
  return {
    id: `exp-${org.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "experience",
    name: org,
    sign: c.years.replace(" — ", "–"),
    title: c.title,
    meta: `${c.years} · ${c.place}`,
    points: c.points,
    lead: c.lead,
    links: [...ledgerLink(org), ...extraLinks],
    learned,
    host: `Akshay · ${c.years.replace(" — ", "–")}`,
    ...look,
  };
};

/** Left side of the street, walked in chronological order. */
export const experiences: Spot[] = [
  exp(
    "KGN Technologies · TopDoc AI",
    { color: "#c9b79c", accent: "#7a5c3a", style: "brick", floors: 3, era: 0 },
    "Akshay started in frontend: accessible, secure features for a state platform and a dental software UI.",
  ),
  exp(
    "Rapid Innovation",
    { color: "#9fb4c7", accent: "#2f4b66", style: "brick", floors: 4, era: 1 },
    "At Rapid Innovation he built a full NFT marketplace and mentored 5 junior engineers.",
  ),
  exp(
    "Virtual Internships",
    { color: "#b9c9a7", accent: "#3d5a2a", style: "plaster", floors: 4, era: 3 },
    "He led a TypeScript migration across 20+ services: 40% fewer incidents, shipping twice as fast.",
  ),
  exp(
    "Remote Leaps",
    { color: "#e7b38f", accent: "#9a3412", style: "plaster", floors: 5, era: 5 },
    "He founded Remote Leaps, grew it to 40,000+ users in 25 countries, and sold it.",
  ),
  exp(
    "JupiterOne",
    { color: "#a9a2d6", accent: "#3b2f8f", style: "glass", floors: 8, era: 6 },
    "At JupiterOne he designed and built Juno, an AI assistant that solved support cases 35% faster.",
  ),
  exp(
    "Commotion",
    { color: "#e9a3b5", accent: "#a3164a", style: "glass", floors: 10, era: 6 },
    "Now at Commotion, he does full-stack AI and security, and led the sign-in and permissions overhaul.",
  ),
];

const skill = (
  id: string,
  name: string,
  title: string,
  points: string[],
  links: SpotLink[],
  learned: string,
  look: { color: string; accent: string },
): Spot => ({
  id: `skill-${id}`,
  kind: "skill",
  name,
  sign: "SKILL SHOP",
  title,
  meta: "Skill",
  points,
  links,
  learned,
  style: "brick",
  floors: 2,
  host: "Akshay · shopkeeper",
  era: 2,
  ...look,
});

/** Right side of the street. */
export const skills: Spot[] = [
  skill(
    "frontend",
    "React & Next.js",
    "Frontends people enjoy using",
    [
      "React, Next.js and TypeScript, from first screen to production.",
      "Led a TypeScript migration across 20+ services at Virtual Internships.",
      "Streaming AI interfaces: Juno answers word by word, with live tables.",
    ],
    [{ label: "react-jsx-skills-framework", href: "https://github.com/maruakshay/react-jsx-skills-framework" }],
    "Akshay's base craft is React, Next.js and TypeScript, the screen you actually touch.",
    { color: "#f2d16b", accent: "#1f6feb" },
  ),
  skill(
    "3d",
    "3D Web",
    "Interactive 3D in the browser",
    [
      "NeuroAtlas: explore the brain from whole lobes down to single cells.",
      "Eye Atlas: 29 eye structures generated in code, about 248 KB in total.",
      "three.js and React Three Fiber, like this town you are walking in.",
    ],
    [
      { label: "NeuroAtlas deep-dive", href: "/work/neuroatlas" },
      { label: "Eye Atlas deep-dive", href: "/work/eye-anatomy" },
    ],
    "He builds 3D on the web: NeuroAtlas, Eye Atlas, and this town.",
    { color: "#8fd3c7", accent: "#0e6e7e" },
  ),
  skill(
    "product",
    "Product & Leadership",
    "From idea to team to exit",
    [
      "Founded Remote Leaps and owned the roadmap, architecture and hiring.",
      "Led a 4-person engineering team, and mentored 5 junior engineers before that.",
      "Starts with the problem, ships, then measures what real people do.",
    ],
    [],
    "He has led teams of 4 to 5 engineers and owned a product from idea to sale.",
    { color: "#f4a261", accent: "#7c2d12" },
  ),
  skill(
    "rag",
    "LLMs & RAG",
    "AI that answers from your own docs",
    [
      "Retrieval-augmented generation for Juno at JupiterOne, on AWS Bedrock.",
      "Cut the AI's workload about 45% with caching and summaries.",
      "Local RAG with Chroma in miii, so your documents never leave your machine.",
    ],
    [{ label: "miii deep-dive", href: "/work/miii" }],
    "He builds AI that answers from a company's own documents, and makes it cheaper to run.",
    { color: "#b6a6ff", accent: "#4c1d95" },
  ),
  skill(
    "evals",
    "Evals & Guardrails",
    "Checking the AI before users do",
    [
      "Set up JupiterOne's first automatic quality checks on AI answers in production.",
      "RAGAS and Braintrust for measuring answer quality.",
      "His résumé AI was built never to invent experience.",
    ],
    [],
    "He measures AI answers in production instead of hoping they are right.",
    { color: "#a7e08f", accent: "#166534" },
  ),
  skill(
    "agents",
    "AI Agents",
    "Agents that do the work, safely",
    [
      "miii-cli: an open-source coding agent that works with 14+ AI providers.",
      "Runs your tests until they pass, and rolls back what breaks.",
      "MCP servers, hooks, subagents, and a permission check before every risky step.",
    ],
    [
      { label: "miii-cli deep-dive", href: "/work/miii-cli" },
      { label: "miii.in", href: "https://miii.in/" },
    ],
    "He built miii-cli, a free AI coding agent with 56 public releases.",
    { color: "#ff9f9f", accent: "#991b1b" },
  ),
  skill(
    "security",
    "AI Security",
    "Stopping AI from leaking data",
    [
      "mii-ai-security: 58 practical guides mapped to OWASP LLM Top 10 and MITRE.",
      "Prompt-injection and data-leak hardening in a SOC2 / GDPR product.",
      "AI security is part of his day job at a cybersecurity company.",
    ],
    [{ label: "mii-ai-security deep-dive", href: "/work/mii-ai-security" }],
    "He knows how AI gets tricked into leaking data, and how to stop it.",
    { color: "#9cc3ff", accent: "#1e3a8a" },
  ),
  skill(
    "creator",
    "Creator Studio",
    "Making content on Instagram",
    [
      "@akshaay.lifts: training, progress, and the honest days of getting stronger.",
    ],
    [
      { label: "@akshaay.lifts", href: profile.instagramLifts },
    ],
    "He is also a creator: training and fitness on @akshaay.lifts.",
    { color: "#ffb3d9", accent: "#be185d" },
  ),
];

export const core: Spot = {
  id: "core",
  kind: "core",
  name: "The AI Core",
  sign: "AI CORE",
  title: "Meet Akshay's AI",
  meta: "Final stop",
  points: [],
  links: [],
  learned: "",
  color: "#f4f1ea",
  accent: "#ff5a5f",
  style: "glass",
  floors: 1,
  host: "Akshay's AI",
  era: 7,
};

export const medalSpots = [...experiences, ...skills];

/** Street layout, shared by the 3D world and the minimap (no three.js here). */
export const LAYOUT = {
  exp: { x: -16, w: 12, d: 11, z: [34, 12, -10, -32, -54, -76] },
  shop: { x: 14, w: 8, d: 10, z: [40, 26, 12, -2, -16, -30, -44, -58] },
  core: { x: 0, z: -112, r: 7.5 },
};

export function footprint(s: Spot) {
  const isExp = s.kind === "experience";
  const L = isExp ? LAYOUT.exp : LAYOUT.shop;
  const i = (isExp ? experiences : skills).indexOf(s);
  return { x: L.x, z: L.z[i], w: L.w, d: L.d };
}
export const TOTAL_MEDALS = medalSpots.length;

// ── Evolution ────────────────────────────────────────────────────────────────
// Every two medals the walker levels up: new clothes, broader shoulders,
// a little taller, faster, jumps higher, hits harder and takes more hits.

export type Top = "tee" | "hoodie" | "jacket" | "shirt" | "blazer";

export interface Stage {
  min: number;
  name: string;
  top: Top;
  topColor: string;
  /** Inner layer under a jacket or blazer. */
  under: string;
  pants: string;
  shoes: string;
  /** Shoulder width / limb thickness multiplier. */
  build: number;
  height: number;
  speed: number;
  jump: number;
  /** Damage per hit. */
  power: number;
  /** Hit points. */
  hp: number;
  headphones?: boolean;
  backpack?: boolean;
  glasses?: boolean;
  watch?: boolean;
  cape?: string;
  halo?: boolean;
  glow?: boolean;
}

export const stages: Stage[] = [
  { min: 0, name: "Newcomer", top: "tee", topColor: "#c9c6bf", under: "#c9c6bf", pants: "#3f5a7a", shoes: "#ecebe7", build: 1, height: 0.97, speed: 6.4, jump: 1.15, power: 1, hp: 5 },
  { min: 2, name: "Junior Dev", top: "hoodie", topColor: "#2f6fd6", under: "#2f6fd6", pants: "#2c3e57", shoes: "#f5f5f4", build: 1.04, height: 0.98, speed: 6.9, jump: 1.25, power: 1.2, hp: 6 },
  { min: 4, name: "Developer", top: "hoodie", topColor: "#11766d", under: "#11766d", pants: "#263244", shoes: "#f5f5f4", build: 1.08, height: 0.99, speed: 7.4, jump: 1.35, power: 1.4, hp: 6, headphones: true },
  { min: 6, name: "Senior Engineer", top: "jacket", topColor: "#3a3f47", under: "#e7e2d8", pants: "#1d2633", shoes: "#d64541", build: 1.12, height: 1, speed: 7.9, jump: 1.45, power: 1.6, hp: 7, headphones: true, backpack: true },
  { min: 8, name: "Tech Lead", top: "shirt", topColor: "#27416b", under: "#27416b", pants: "#2b2b2b", shoes: "#5b3a24", build: 1.16, height: 1.01, speed: 8.4, jump: 1.55, power: 1.8, hp: 8, backpack: true, glasses: true, watch: true },
  { min: 10, name: "Founder", top: "blazer", topColor: "#8a3b1c", under: "#f4f1ea", pants: "#3b3428", shoes: "#2a1a10", build: 1.2, height: 1.02, speed: 8.9, jump: 1.65, power: 2.1, hp: 9, glasses: true, watch: true },
  { min: 12, name: "AI Architect", top: "blazer", topColor: "#2e2a6e", under: "#f4f1ea", pants: "#1b1b24", shoes: "#111111", build: 1.24, height: 1.03, speed: 9.4, jump: 1.75, power: 2.4, hp: 10, glasses: true, watch: true, cape: "#ff5a5f" },
  { min: 14, name: "AI Master", top: "blazer", topColor: "#d9a72b", under: "#fff6dc", pants: "#2a2210", shoes: "#d9a72b", build: 1.28, height: 1.05, speed: 10, jump: 1.9, power: 3, hp: 12, glasses: true, watch: true, cape: "#ff3d8b", halo: true, glow: true },
];

export function stageFor(medals: number): Stage {
  let s = stages[0];
  for (const st of stages) if (medals >= st.min) s = st;
  return s;
}

// ── Fights ──────────────────────────────────────────────────────────────────
// Glitch walls block the street between doors. Walk up to one and the bugs
// behind it come out; beat them all and the wall drops. Every medal makes you
// hit harder and take more hits. The Black Box guards the AI Core.

export type FoeKind = "bug" | "creep" | "flaky" | "conflict" | "halluc" | "inject";

export const FOES: Record<FoeKind, { name: string; hp: number; color: string; glow: string }> = {
  bug: { name: "Bug", hp: 3, color: "#3b1f3f", glow: "#ff4d6d" },
  creep: { name: "Scope Creep", hp: 9, color: "#2e7d32", glow: "#a3ff6b" },
  flaky: { name: "Flaky Test", hp: 3, color: "#8a5a00", glow: "#ffc93c" },
  conflict: { name: "Merge Conflict", hp: 5, color: "#3a3a3a", glow: "#ff5a5f" },
  halluc: { name: "Hallucination", hp: 4, color: "#b9a6ff", glow: "#a78bfa" },
  inject: { name: "Prompt Injection", hp: 3, color: "#0e7490", glow: "#22d3ee" },
};

export interface Fight {
  z: number;
  name: string;
  foes: FoeKind[];
  /** What the companion says when the wall opens. */
  intro: string;
}

export const FIGHTS: Fight[] = [
  { z: 47, name: "Bug swarm", foes: ["bug", "bug", "bug"], intro: "Bugs! Hold left-click (or J) to shoot. Q fires me at them." },
  { z: 19, name: "Scope creep", foes: ["creep", "bug", "bug"], intro: "Scope creep. It grows the longer you leave it, so shoot it early." },
  { z: -24, name: "Flaky tests", foes: ["flaky", "flaky", "flaky", "bug"], intro: "Flaky tests blink around. Shoot right after they land." },
  { z: -38.25, name: "Merge conflicts", foes: ["conflict", "conflict", "halluc"], intro: "Merge conflicts charge in a straight line. Step aside. And that one's a hallucination: jump its shots." },
  { z: -67, name: "Prompt injections", foes: ["inject", "inject", "inject", "halluc"], intro: "Prompt injections flash, then dash. Move when they flash." },
];
export const FIGHT_SPAN = 27; // half-width: the whole town, so there is no way around

export const BOSS = {
  name: "The Black Box",
  hp: 150,
  /** The wall across the street that only opens for an AI Master. */
  gateZ: -88,
  /** Arena centre and radius, in front of the Core. */
  arena: { x: 0, z: -96.5, r: 9 },
};

// ── Conversations ────────────────────────────────────────────────────────────

export type Speaker = "host" | "you" | "ai";
export interface Line {
  who: Speaker;
  text: string;
}
export interface Choice {
  id: string;
  label: string;
  reply: Line[];
  links?: SpotLink[];
  /** What happens after the reply. */
  then?: "medal" | "leave" | "chat" | "hire";
}
export interface Script {
  speaker: string;
  intro: Line[];
  choices: Choice[];
}

const h = (text: string): Line => ({ who: "host", text });

export function scriptFor(s: Spot, collected: boolean, medals: number): Script {
  if (s.kind === "core") {
    const ai = (text: string): Line => ({ who: "ai", text });
    return {
      speaker: s.host,
      intro: [
        ai(`You made it. ${TOTAL_MEDALS} medals, and I learned something behind every door.`),
        ai("Here's what I know now. Akshay builds AI products end to end: the screens, the AI behind them, and the guardrails around it."),
        ai("He founded an AI startup and sold it, built an enterprise AI assistant on AWS Bedrock, and keeps shipping open source. And he's open for freelance projects."),
      ],
      choices: [
        { id: "ask", label: "Can I ask you anything about him?", reply: [ai("Anything about his work. Go ahead.")], then: "chat" },
        { id: "hire", label: "How do I work with him?", reply: [ai("Book a 20-minute intro call. Bring the problem, he'll tell you honestly whether he's the right person.")], then: "hire" },
        { id: "bye", label: "I'll keep exploring.", reply: [ai("I'll be right here, glowing.")], then: "leave" },
      ],
    };
  }

  const medal: Choice = collected
    ? { id: "bye", label: "Good to see you again. Bye!", reply: [h("Anytime. Enjoy the rest of the street.")], then: "leave" }
    : {
        id: "medal",
        label: "Thanks! Can I have the medal?",
        reply: [h(medals + 1 === TOTAL_MEDALS ? "That's the last one. The AI Core is waiting for you." : "You earned it. Here you go.")],
        then: "medal",
      };

  if (s.kind === "experience") {
    const [years, place] = s.meta.split(" · ");
    const current = /now/i.test(years);
    const choices: Choice[] = [
      { id: "work", label: current ? "What are you working on?" : "What did you work on here?", reply: s.points.map(h) },
    ];
    if (s.lead) choices.push({ id: "lead", label: current ? "Are you leading anything?" : "Did you lead anyone?", reply: [h(s.lead)] });
    if (s.links.length) choices.push({ id: "links", label: "Where can I see it?", reply: [h("Have a look:")], links: s.links });
    choices.push(medal);
    return {
      speaker: s.host,
      intro: current
        ? [h(`Hey, welcome to ${s.name}! I'm Akshay, and this is where I work right now.`), h(`I'm a ${s.title} here, ${place}.`)]
        : [h(`Hey, welcome to ${s.name}! I'm Akshay. Well, Akshay back in ${years}.`), h(`I was a ${s.title} here, ${place}.`)],
      choices,
    };
  }

  const choices: Choice[] = [{ id: "shelves", label: "What's on the shelves?", reply: s.points.map(h) }];
  if (s.links.length) choices.push({ id: "proof", label: "Any proof?", reply: [h("Right here:")], links: s.links });
  choices.push(medal);
  return {
    speaker: s.host,
    intro: [h(`Welcome to the ${s.name} shop!`), h(`Everything in here is about one thing: ${s.title.charAt(0).toLowerCase()}${s.title.slice(1)}.`)],
    choices,
  };
}

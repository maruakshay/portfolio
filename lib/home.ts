// Copy for the single-page home. Every claim traces to lib/content.ts
// (résumé, deep-dives, miii.in). Keep it that way: no invented numbers.

export const hero = {
  eyebrow: ["Production AI engineer", "ex-JupiterOne", "sold my AI SaaS"],
  headline: ["I take your AI app", "from demo to production."],
  sub: "Secured, cheaper to run, and trusted by your customers. I harden the app, lock down the AI, and cut your AI bill, so you can say yes to real users and enterprise deals.",
};

/** How I work: trust first, then deep understanding of the client's customers. */
export const approach = {
  label: "How I work",
  title: ["Trust first.", "Then we go deep."],
  intro:
    "Before I touch your code, we build trust. Then I go deeper: into your business, your customers and how they feel when they use your AI.",
  steps: [
    {
      n: "01",
      t: "Build trust",
      d: "A small, clear first step. Honest findings, plain language, no surprises. You see exactly what I see.",
    },
    {
      n: "02",
      t: "Understand your customers",
      d: "What they expect, what worries them, and where the AI lets them down. Their trust is what we are protecting.",
    },
    {
      n: "03",
      t: "Fix what matters to them",
      d: "Every fix is chosen for the people using your product, not just to pass a checklist.",
    },
  ],
};

/** "Why AI apps break in production": the three risks the offer fixes. */
export const risks = [
  {
    t: "Security",
    d: "Prompt injection, data leaks, weak auth and exposed keys. One incident can cost you your biggest customer.",
  },
  {
    t: "Cost",
    d: "AI bills that grow faster than revenue. Wasted calls, oversized prompts, no caching.",
  },
  {
    t: "Trust",
    d: "Hallucinated answers, silent failures, no monitoring. Customers stop relying on it.",
  },
];

/** How an engagement runs, start to finish. */
export const process = [
  { n: "01", t: "20-min call", d: "Understand your app, users and risks." },
  { n: "02", t: "Audit", d: "I review security, AI and cost; you get a scored report." },
  { n: "03", t: "Fix", d: "Hardening sprint, highest risk first, with progress updates." },
  { n: "04", t: "Stay safe", d: "Optional monthly monitoring and support." },
];

export const faq = [
  {
    q: "Do you work with apps built with Cursor, Lovable, Bolt or Replit?",
    a: "Yes. Many of my clients built fast with AI tools and now need it production-ready.",
  },
  {
    q: "What stack do you work with?",
    a: "React, Next.js, TypeScript, Node, AWS (including Bedrock), and most major AI providers, cloud or local.",
  },
  {
    q: "Do you need access to my code?",
    a: "For the audit, yes: read access to the repo and a staging environment. I sign an NDA before starting.",
  },
  {
    q: "Will you test my live app for vulnerabilities?",
    a: "Only with your written permission, and preferably on staging.",
  },
  {
    q: "What time zones do you work in?",
    a: "I'm based in India and work remotely with US and EU teams, with daily overlap hours.",
  },
  {
    q: "What if I just want a feature built?",
    a: "Happy to talk, but my focus is making AI apps secure, cheaper and reliable.",
  },
];

/** What happens on the intro call. Removes the "what am I signing up for" doubt. */
export const callSteps = [
  { n: "01", t: "You show me the demo", d: "Or describe the feature. No deck, no prep needed." },
  { n: "02", t: "I tell you what breaks", d: "Where it will fail in production: cost, accuracy, security, speed." },
  { n: "03", t: "You leave with next steps", d: "A clear path to ship it, whether or not we work together." },
];

export interface ProofItem {
  /** Number to count up to. Omit for a word stat like "Sold". */
  value?: number;
  prefix?: string;
  suffix?: string;
  word?: string;
  label: string;
}

export const proofStrip: ProofItem[] = [
  { value: 40, suffix: "K+", label: "users on the AI SaaS I founded" },
  { word: "Sold", label: "that AI SaaS, Remote Leaps" },
  { value: 45, prefix: "~", suffix: "%", label: "AI cost cut on an enterprise assistant" },
  { value: 35, suffix: "%", label: "more interviews for job seekers" },
  { value: 14, suffix: "+", label: "AI providers in miii-cli" },
];

export type PreviewKind = "juno" | "leaps" | "miii";

export interface WorkItem {
  id: PreviewKind;
  /** The result, said first: the hook line of the card. */
  outcome: string;
  /** Which production risks this project proves out. */
  tags: string[];
  /** One line on how it was hardened. */
  lead: string;
  index: string;
  org: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  stack: string[];
  href: string;
  hrefLabel: string;
  external: boolean;
}

export const selectedWork: WorkItem[] = [
  {
    id: "juno",
    outcome: "Support cases solved 35% faster.",
    tags: ["Security", "Cost", "Enterprise trust"],
    lead: "Made safe for SOC2 / GDPR enterprise customers, with ~45% less AI workload per question.",
    index: "01",
    org: "JupiterOne · 2025–26",
    title: "Juno",
    kicker: "Enterprise AI security assistant",
    summary:
      "An AI assistant that answers big companies' questions about their own security, live, as they type. Answers stream in word by word with live tables of their systems.",
    points: [
      "Streaming answers + live data tables on AWS Bedrock",
      "Hardened against the OWASP LLM Top 10 in a SOC2 / GDPR product",
      "~45% less AI workload per question with caching and summaries",
    ],
    stack: ["React", "TypeScript", "AWS Bedrock", "SSE", "RAG"],
    href: "https://www.jupiterone.com/",
    hrefLabel: "jupiterone.com",
    external: true,
  },
  {
    id: "leaps",
    outcome: "40,000 users, then acquired.",
    tags: ["Trust", "Scale"],
    lead: "AI built to never invent experience, trusted by 40K+ users in 25 countries, then acquired.",
    index: "02",
    org: "Remote Leaps · founded & sold",
    title: "Remote Leaps",
    kicker: "AI résumé SaaS, built and acquired",
    summary:
      "I started an AI résumé product, designed it, built it, and grew it to 40,000+ users in 25 countries before selling it. Its AI was built never to invent experience.",
    points: [
      "40K+ users across 25 countries",
      "Scoring model lifted interview rates 35%",
      "Led a 4-person team: roadmap, architecture, hiring",
    ],
    stack: ["Next.js", "Fine-tuned scoring", "Constrained decoding"],
    href: "#experience",
    hrefLabel: "See the timeline",
    external: false,
  },
  {
    id: "miii",
    outcome: "An agent that fixes its own mistakes.",
    tags: ["Reliability"],
    lead: "An agent that tests its own work and rolls back anything that breaks.",
    index: "03",
    org: "Open source · 56 releases",
    title: "miii-cli",
    kicker: "Open-source coding agent",
    summary:
      "Describe a change; it plans it, writes the code, runs your tests and keeps going until they pass, rolling back anything that breaks. Works with any model, even local ones.",
    points: [
      "14+ AI providers, cloud or fully local",
      "Runs tests until green, with automatic rollback",
      "Checkpoints every turn; every risky step asks first",
    ],
    stack: ["TypeScript", "Node", "Ink", "MCP"],
    href: "/work/miii-cli",
    hrefLabel: "Read the deep-dive",
    external: false,
  },
];

/** One-line impact per role, keyed by `career[].org` in lib/content.ts. */
export const roleImpact: Record<string, string> = {
  Commotion: "Full-stack AI and security for SaaS products. Led the sign-in and permissions overhaul.",
  JupiterOne: "Designed and built Juno, the company's enterprise AI assistant. Support cases solved 35% faster.",
  "Remote Leaps": "Founded an AI résumé SaaS, grew it to 40K+ users, and sold it.",
  "Virtual Internships": "Led a TypeScript migration across 20+ services: 40% fewer incidents.",
  "Rapid Innovation": "Built a full NFT marketplace and mentored 5 junior engineers.",
  "KGN Technologies · TopDoc AI": "Accessible frontends for a state platform and dental software (+28% engagement).",
};

export type SkillIcon = "rag" | "agents" | "evals" | "security" | "stream" | "three";

export interface Skill {
  icon: SkillIcon;
  title: string;
  body: string;
  span: "wide" | "narrow";
}

export const skills: Skill[] = [
  {
    icon: "rag",
    title: "LLMs & RAG",
    body: "Assistants that answer from your own docs and data, with sources, not guesses.",
    span: "wide",
  },
  {
    icon: "agents",
    title: "AI Agents",
    body: "Multi-step agents that plan, call tools and check their own work.",
    span: "narrow",
  },
  {
    icon: "evals",
    title: "Evals & Guardrails",
    body: "Automatic quality checks on AI answers in production (RAGAS, Braintrust).",
    span: "narrow",
  },
  {
    icon: "security",
    title: "AI Security",
    body: "Prompt injection and data-leak reviews mapped to the OWASP LLM Top 10.",
    span: "narrow",
  },
  {
    icon: "stream",
    title: "Streaming UIs",
    body: "React and Next.js interfaces where answers stream in word by word, with live tables and no spinners.",
    span: "wide",
  },
  {
    icon: "three",
    title: "3D Web",
    body: "Lightweight interactive 3D in the browser: NeuroAtlas, Eye Atlas.",
    span: "narrow",
  },
];

export type LabPreview = "terminal" | "grid" | "neuron" | "eye";

export interface LabItem {
  slug: string;
  name: string;
  tag: string;
  line: string;
  preview: LabPreview;
  external: { label: string; href: string };
}

export const lab: LabItem[] = [
  {
    slug: "miii-cli",
    name: "miii-cli",
    tag: "TypeScript · 56 releases",
    line: "A free coding agent that works with any model, including local ones.",
    preview: "terminal",
    external: { label: "miii.in", href: "https://miii.in/" },
  },
  {
    slug: "mii-ai-security",
    name: "mii-ai-security",
    tag: "58 guides · OWASP / MITRE",
    line: "A security playbook for teams shipping LLM apps, mapped to OWASP LLM Top 10 and MITRE.",
    preview: "grid",
    external: { label: "GitHub", href: "https://github.com/maruakshay/mii-ai-security" },
  },
  {
    slug: "neuroatlas",
    name: "NeuroAtlas",
    tag: "3D · 5 scales · 15 disorders",
    line: "Zoom from the whole brain to one nerve cell, and see what a disease changes at every level.",
    preview: "neuron",
    external: { label: "Live", href: "https://neuroatlas-topaz.vercel.app" },
  },
  {
    slug: "eye-anatomy",
    name: "Eye Atlas",
    tag: "3D · ~248 KB",
    line: "A medically accurate 3D eye for patient education, generated in code instead of shipped as a 30 MB model.",
    preview: "eye",
    external: { label: "Live", href: "https://eye-anatomy-delta.vercel.app" },
  },
];

export interface Reel {
  /** Instagram reel URL */
  href: string;
  /** Thumbnail in /public, e.g. "/reels/ai-1.jpg". */
  src: string;
  alt: string;
}

/**
 * Reel thumbnails per channel. Empty = the card shows a designed cover.
 * To add real ones: drop images into public/reels/ and list them here.
 */
export const reels: Record<"lifts", Reel[]> = {
  lifts: [],
};

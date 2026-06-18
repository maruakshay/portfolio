// Single source of truth for portfolio content.
// Ledger entries (roles + open source, mixed by impact) and miii deep-dives.

export const profile = {
  name: "Akshay Maru",
  role: "AI Product Engineer",
  statementLead: "Most AI demos die in production. I build the ones that don't.",
  statementRest:
    "End to end: the streaming interface and the model behind it. Right now, an enterprise AI assistant on AWS Bedrock at JupiterOne. Before it, an AI SaaS I founded, grew past 40,000 users, and sold. Alongside it, local-first AI tooling I maintain in the open.",
  location: "India",
  availability: "Open to US / UK / Canada · remote or relocation · needs visa sponsorship",
  email: "maruakshay4@gmail.com",
  github: "https://github.com/maruakshay",
  linkedin: "https://linkedin.com/in/akshaymaru61",
  resume:
    "https://docs.google.com/document/d/1_CcUyc3-QAS77It1ttnfuSSbDVObDvKKjtnvpkNVnwg/export?format=pdf",
};

export type LedgerKind = "role" | "oss";

export interface LedgerEntry {
  kind: LedgerKind;
  slug?: string; // present when there is a deep-dive route
  meta: string; // mono key column: year range or lang/stars
  title: string;
  sub: string; // role title or one-line project tagline
  blurb: string; // the one earned sentence
  href: string; // external link (repo / live)
  hrefLabel: string;
}

// Ordered by impact, roles and OSS interleaved.
export const ledger: LedgerEntry[] = [
  {
    kind: "role",
    meta: "2025 — NOW",
    title: "JupiterOne",
    sub: "Senior LLM Engineer / AI Systems Architect",
    blurb:
      "Built Juno end to end: a React + TypeScript AI assistant on AWS Bedrock with SSE token streaming, live asset-graph tables, and OWASP-aware RAG hardening. Cut enterprise support resolution time 35% and stood up the company's first production LLM monitoring.",
    href: "https://www.jupiterone.com/",
    hrefLabel: "jupiterone.com",
  },
  {
    kind: "oss",
    slug: "miii-cli",
    meta: "TS · 21★",
    title: "miii-cli",
    sub: "Local-first AI coding agent in your terminal",
    blurb:
      "A coding agent that reads code, writes features, runs tests, and fixes bugs entirely on your hardware via Ollama. No API keys, no cloud, no per-token billing. Permission-gated tools and path confinement keep it safe to point at a real repo.",
    href: "https://github.com/maruakshay/miii-cli",
    hrefLabel: "github.com/maruakshay/miii-cli",
  },
  {
    kind: "role",
    meta: "2023 — 2025",
    title: "Remote Leaps",
    sub: "Founder & Senior AI Product Engineer · Acquired",
    blurb:
      "Founded, built, and exited an AI resume SaaS that reached 40K+ users across 25 countries. Sole frontend architect plus a zero-hallucination generation engine using constrained decoding and a fine-tuned scoring model that lifted interview conversion 35%.",
    href: "https://github.com/maruakshay",
    hrefLabel: "case study",
  },
  {
    kind: "oss",
    slug: "mii-ai-security",
    meta: "PY · npm",
    title: "mii-ai-security",
    sub: "Open-source LLM security skills framework",
    blurb:
      "58 structured security guides across 12 domains, mapped to OWASP LLM Top 10 and MITRE, with framework-native controls for LangChain, LlamaIndex, AutoGen and more. Think like an attacker, ship like a defender.",
    href: "https://github.com/maruakshay/mii-ai-security",
    hrefLabel: "github.com/maruakshay/mii-ai-security",
  },
  {
    kind: "oss",
    slug: "miii",
    meta: "TS · 8★",
    title: "miii",
    sub: "Privacy-first local AI assistant (web + terminal)",
    blurb:
      "One local assistant, two front ends sharing memory: a Next.js web UI and an Ink TUI. LangGraph routes tools, Chroma grounds answers in your documents, Tavily adds optional live search. Runs 100% on your machine.",
    href: "https://github.com/maruakshay/miii",
    hrefLabel: "github.com/maruakshay/miii",
  },
  {
    kind: "oss",
    meta: "TS · MV3",
    title: "copytap",
    sub: "Chrome text expander",
    blurb:
      "Type :addr, get your full address, in any input on any site. A small, fast Manifest V3 extension that syncs snippets across signed-in browsers. Built for the friction of typing the same thing twice.",
    href: "https://github.com/maruakshay/copytap",
    hrefLabel: "github.com/maruakshay/copytap",
  },
  {
    kind: "oss",
    meta: "DOCS",
    title: "react-jsx-skills-framework",
    sub: "Engineering implementation frameworks",
    blurb:
      "Style guides are abstract; this turns them into executable specs. Decision matrices and verification checklists for React/JSX, JavaScript, and CSS-in-JS that kill ambiguity before it becomes technical debt.",
    href: "https://github.com/maruakshay/react-jsx-skills-framework",
    hrefLabel: "github.com/maruakshay/react-jsx-skills-framework",
  },
];

export interface DeepDiveSection {
  heading: string;
  body: string; // markdown-lite: paragraphs separated by \n\n, "- " for list items
}

export interface DeepDive {
  slug: string;
  name: string;
  tagline: string;
  meta: { label: string; value: string }[];
  links: { label: string; href: string }[];
  sections: DeepDiveSection[];
}

export const deepDives: DeepDive[] = [
  {
    slug: "miii-cli",
    name: "miii-cli",
    tagline: "A local-first AI coding agent that never leaves your disk.",
    meta: [
      { label: "Stack", value: "TypeScript · Node ≥18 · Ink · Ollama" },
      { label: "Status", value: "Actively maintained · 21★ · 11 releases" },
      { label: "Install", value: "npm i -g miii-agent" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/maruakshay/miii-cli" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Cloud coding agents are useful right up until you point them at proprietary code. Then you are shipping your source to a third party, managing API keys, and watching a per-token meter run. For a lot of teams that is a non-starter, not a preference.\n\nmiii-cli is the answer to a narrow question: can a genuinely capable coding agent run with nothing leaving the machine?",
      },
      {
        heading: "The decisions that mattered",
        body: "- Local model execution through Ollama, so there is no internet dependency and no key management. The agent stays on your disk, period.\n- A permission system with persistent approval rules, because an agent that can run bash and edit files needs a real consent model, not a yes-to-everything prompt.\n- Path confinement that blocks directory traversal, so the agent cannot wander outside the repo you handed it.\n- Lossless output spill: truncated tool results page through instead of silently dropping data, which is the difference between trusting the output and double-checking everything by hand.",
      },
      {
        heading: "What it does",
        body: "It reads code, writes features, runs tests, and fixes bugs from an interactive terminal UI built with Ink. The tool suite covers file read/write, precise edits, glob and regex search, and bash execution. `miii doctor` validates your local model setup before you start, so failures are legible instead of mysterious.",
      },
      {
        heading: "Why it is on this page",
        body: "It is the clearest statement of how I think about AI products: small surface, real safety model, no hand-waving about privacy. Five S's, on purpose, small, simple, smart, strategic, semantic.",
      },
    ],
  },
  {
    slug: "miii",
    name: "miii",
    tagline: "A privacy-first local AI assistant with two front ends and one memory.",
    meta: [
      { label: "Stack", value: "Next.js · React 19 · Tailwind 4 · Ink · LangGraph · Ollama" },
      { label: "Status", value: "Actively maintained · 8★" },
      { label: "Surfaces", value: "Web UI + terminal TUI" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/maruakshay/miii" }],
    sections: [
      {
        heading: "The problem",
        body: "Most assistants make you choose: the convenience of a hosted chat, or the privacy of keeping your prompts on your own hardware. miii refuses the trade. It runs entirely on your machine and still does the things you actually want, tool use, document grounding, live search.",
      },
      {
        heading: "The decisions that mattered",
        body: "- Two front ends, shared memory. A Next.js web UI and an Ink terminal app talk to the same local brain, so a conversation started in one continues in the other.\n- LangGraph for agentic tool routing, so the assistant decides which skill to invoke instead of me hard-coding branches.\n- Chroma-based RAG for document-aware answers, kept local.\n- Pluggable skills defined as JSON, so extending the assistant does not mean touching the core.\n- Tavily web search as an explicit opt-in, not an always-on data leak.",
      },
      {
        heading: "What it shows",
        body: "miii is the product-shaped sibling of miii-cli: the same local-first conviction, applied to a general assistant instead of a coding agent. It is where I work out what a privacy-respecting AI product feels like end to end, from streaming NDJSON to slash commands to model switching.",
      },
    ],
  },
  {
    slug: "mii-ai-security",
    name: "mii-ai-security",
    tagline: "Think like an attacker. Ship like a defender.",
    meta: [
      { label: "Stack", value: "Python · machine-readable skill index" },
      { label: "Distribution", value: "MIT · npm: miii-security" },
      { label: "Coverage", value: "58 skills · 12 domains" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/maruakshay/mii-ai-security" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Teams ship production LLM systems faster than the security practices around them mature. There is plenty of high-level advice about prompt injection and data leakage, and very little that an engineer can actually pick up and apply during a review.",
      },
      {
        heading: "The decisions that mattered",
        body: "- Structure security as skills, not prose. 58 SKILL.md guides, each with an attacker mental model, a control table with severity ratings, and quick wins you can ship today.\n- Make it framework-native. Controls are written for LangChain, LlamaIndex, Semantic Kernel, AutoGen, CrewAI and others, because generic advice dies on contact with a real codebase.\n- Map everything to OWASP LLM Top 10 and MITRE, so the work plugs into how security teams already think.\n- Ship a machine-readable index, validation pipeline, adversarial fixtures, and red-team scripts, so the framework is testable, not just readable.",
      },
      {
        heading: "Why it matters to me",
        body: "I do AI security as part of my day job at a cybersecurity company. This is me turning that into something portable: the review I wish every team running LLMs in production had open in a tab.",
      },
    ],
  },
];

export function getDeepDive(slug: string) {
  return deepDives.find((d) => d.slug === slug);
}

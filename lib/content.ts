// Single source of truth for portfolio content.
// Ledger entries (roles + open source, mixed by impact) and miii deep-dives.

export const profile = {
  name: "Akshay Maru",
  role: "Senior / Staff AI Engineer & Product Engineer",
  statementLead:
    "Most AI demos die in production. I build the ones that don't.",
  statementRest:
    "End to end: the streaming interface and the model behind it. Right now, full-stack AI and security for SaaS products at Commotion. Before that, an enterprise AI assistant on AWS Bedrock at JupiterOne, and an AI SaaS I founded, grew past 40,000 users, and sold. Alongside it, local-first AI tooling I maintain in the open.",
  location: "India",
  availability:
    "Open to US / UK / Canada · remote or relocation · needs visa sponsorship",
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
    meta: "2026 — NOW",
    title: "Commotion",
    sub: "Senior Full-Stack AI Engineer",
    blurb:
      "Helping SaaS products strengthen their cybersecurity. Revamped the app with graded, measurable performance improvements, and managed the multi-authentication overhaul with updated authorization for every sub-consumer of the platform.",
    href: "https://gocommotion.com/",
    hrefLabel: "gocommotion.com",
  },
  {
    kind: "role",
    meta: "2025 — 2026",
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
    meta: "TS · 38★ · v3.10",
    title: "miii-cli",
    sub: "The open-source alternative to Claude Code. Any model, free forever.",
    blurb:
      "A coding agent for the terminal or browser that plans, edits, runs, and verifies its own work, with Claude, GPT, Gemini, DeepSeek, or a model running 100% on your own GPU. 14+ providers, fix-until-green with auto-rollback, MCP, hooks, subagents. MIT, no account.",
    href: "https://miii.in/",
    hrefLabel: "miii.in",
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
    meta: "TS · 9★",
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
    tagline:
      "The open-source alternative to Claude Code. Any model, free forever.",
    meta: [
      { label: "Stack", value: "TypeScript · Node ≥18 · Ink · 14+ providers" },
      { label: "Status", value: "v3.10.2 · 38★ · 49 releases · MIT" },
      { label: "Install", value: "npm i -g miii-agent" },
    ],
    links: [
      { label: "miii.in", href: "https://miii.in/" },
      { label: "GitHub", href: "https://github.com/maruakshay/miii-cli" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Cloud coding agents are useful right up until you point them at proprietary code, or the bill arrives. Then you are shipping your source to a third party, juggling an account per vendor, and watching a per-token meter run. And you are locked to whichever model that vendor sells.\n\nmiii-cli answers two questions at once: can a genuinely capable coding agent run with nothing leaving the machine, and can the same agent use any model you choose when you do want the cloud?",
      },
      {
        heading: "The decisions that mattered",
        body: "- Model-agnostic from the core. 14+ providers, Claude, GPT, Gemini, DeepSeek, Grok, Mistral, Kimi, GLM, Groq, OpenRouter, Cerebras, plus local runtimes (Ollama, LM Studio, llama.cpp, vLLM) for Qwen3 Coder, Devstral, gpt-oss and Llama. Bring your own key, or no key at all.\n- Fix-until-green with auto-rollback. The agent runs your tests, keeps iterating until they pass, and checkpoints so a bad turn can be rewound instead of hand-reverted.\n- `miii doctor` grades models on real agent tasks, so you pick a model by evidence, not by benchmark marketing.\n- Permission-gated edits and commands with persistent approval rules, because an agent that can run bash needs a real consent model, not a yes-to-everything prompt.\n- Path confinement and lossless output spill, so the agent stays inside the repo you handed it and never silently drops tool output.",
      },
      {
        heading: "What it does",
        body: "It reads code, plans, writes features, runs tests, and verifies its own work, from an Ink terminal UI or a browser app (`miii web`). MCP servers, hooks, and subagents extend it the same way the commercial agents do. `miii provider add anthropic` wires up Claude in one line; skip it and everything runs 100% offline.\n\nApna code, apna model, apni marzi. Your code, your model, your choice.",
      },
      {
        heading: "Why it is on this page",
        body: "It is the clearest statement of how I think about AI products: small surface, real safety model, no lock-in, no hand-waving about privacy. Forty-nine releases in, it is also proof I maintain what I ship.",
      },
    ],
  },
  {
    slug: "miii",
    name: "miii",
    tagline:
      "A privacy-first local AI assistant with two front ends and one memory.",
    meta: [
      {
        label: "Stack",
        value: "Next.js · React 19 · Tailwind 4 · Ink · LangGraph · Ollama",
      },
      { label: "Status", value: "Actively maintained · 9★" },
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
      {
        label: "GitHub",
        href: "https://github.com/maruakshay/mii-ai-security",
      },
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

// Career, newest first. `lead` lines are the management signal, shown accented.
export interface CareerEntry {
  years: string;
  org: string;
  place: string;
  title: string;
  points: string[];
  lead?: string;
}

export const career: CareerEntry[] = [
  {
    years: "Sep 2026 — now",
    org: "Commotion",
    place: "India · remote",
    title: "Senior Full-Stack AI Engineer",
    points: [
      "Helping SaaS products strengthen their cybersecurity.",
      "Revamped the app with graded, measurable performance improvements.",
    ],
    lead: "Managed the multi-authentication overhaul and updated authorization for every sub-consumer of the app.",
  },
  {
    years: "2025 — 2026",
    org: "JupiterOne",
    place: "London, UK · remote",
    title: "Senior LLM Engineer / AI Systems Architect",
    points: [
      "Built Juno end to end: React + TypeScript AI assistant on AWS Bedrock with SSE streaming and live asset-graph tables.",
      "OWASP LLM Top 10 guardrails and RAG hardening in a SOC2 / GDPR production environment.",
      "RAGAS + Braintrust eval pipeline; caching and token-aware summarisation cut prompt load ~45%.",
    ],
    lead: "Set UI architecture, TypeScript standards, and code-review culture; mentored the team on LLMOps and frontend.",
  },
  {
    years: "2023 — 2025",
    org: "Remote Leaps",
    place: "India · remote",
    title: "Founder & Senior AI Product Engineer · acquired",
    points: [
      "Grew an AI resume SaaS to 40K+ users across 25 countries, then sold it.",
      "Zero-hallucination generation engine plus a fine-tuned scoring model: +35% interview conversion.",
    ],
    lead: "Led a 4-person engineering team with full ownership of roadmap, architecture, and hiring.",
  },
  {
    years: "2023",
    org: "Virtual Internships",
    place: "London, UK · remote",
    title: "Senior Software Developer",
    points: [
      "Semantic search for 25,000+ interns and 3,000+ companies: +25% retention.",
      "RTK Query caching layer: 37% fewer redundant API calls.",
    ],
    lead: "Led a TypeScript migration across 20+ microservices: 40% fewer incidents, 2x developer velocity.",
  },
  {
    years: "2021 — 2023",
    org: "Rapid Innovation",
    place: "Noida, India",
    title: "Software Developer",
    points: ["Full-stack NFT marketplace (MetaMask + Solidity); gas optimisations cut user cost ~15%."],
    lead: "Mentored 5 junior engineers on API design, testing, and deployment.",
  },
  {
    years: "2020 — 2021",
    org: "KGN Technologies · TopDoc AI",
    place: "India",
    title: "Frontend Engineer · UI Developer",
    points: ["WCAG / OWASP-compliant state platform features (−20% bounce); dental SaaS UI (+28% engagement)."],
  },
];

// miii-cli, as published on miii.in.
export const miii = {
  version: "v3.10.2",
  stars: 38,
  releases: 49,
  install: "npm install -g miii-agent",
  site: "https://miii.in/",
  repo: "https://github.com/maruakshay/miii-cli",
  providers: [
    "Claude", "GPT", "Gemini", "DeepSeek", "Grok", "Mistral", "Kimi", "GLM",
    "Qwen3 Coder", "Devstral", "gpt-oss", "Llama", "Groq", "OpenRouter",
    "Cerebras", "Ollama", "LM Studio", "llama.cpp", "vLLM",
  ],
  features: [
    { k: "fix-until-green", v: "Runs your tests and keeps going until they pass, with auto-rollback." },
    { k: "miii doctor", v: "Grades models on real agent tasks before you trust one." },
    { k: "rewind", v: "Checkpoints every turn, so a bad edit is one step back." },
    { k: "permissions", v: "Every edit and command is gated; approvals persist." },
    { k: "extend", v: "MCP servers, hooks, and subagents." },
    { k: "miii web", v: "The same agent in your browser." },
  ],
};

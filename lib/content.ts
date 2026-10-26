// Single source of truth for portfolio content.
// Ledger entries (roles + open source, mixed by impact) and miii deep-dives.

export const siteUrl = "https://akshay-portfolio-zeta.vercel.app";

export const profile = {
  name: "Akshay Maru",
  role: "Senior / Staff / Lead AI & Product Engineer",
  statementLead:
    "Most AI demos die in production. I build the ones that don't.",
  statementRest:
    "End to end: the streaming interface and the model behind it. Right now, full-stack AI and security for SaaS products at Commotion. Before that, an enterprise AI assistant on AWS Bedrock at JupiterOne, and an AI SaaS I founded, grew past 40,000 users, and sold. Alongside it, local-first AI tooling I maintain in the open.",
  location: "India",
  availability:
    "Open to roles worldwide · remote or relocation",
  email: "maruakshay4@gmail.com",
  github: "https://github.com/maruakshay",
  linkedin: "https://linkedin.com/in/akshaymaru61",
  resume:
    "https://docs.google.com/document/d/1_CcUyc3-QAS77It1ttnfuSSbDVObDvKKjtnvpkNVnwg/export?format=pdf",
  // Paste a Cal.com / Calendly link here and every "Book a call" button
  // switches from a pre-written email to the scheduler.
  booking: "https://calendar.app.google/XVvjoayuq9H6iPxZA",
};

/** Every "Book a call" CTA points here: the scheduler if set, else a ready email. */
export function callHref(context?: string) {
  if (profile.booking) return profile.booking;
  const subject = "20-minute call with Akshay";
  const body = [
    "Hi Akshay,",
    "",
    context ?? "I went through your portfolio and would like to set up a 20-minute call this week.",
    "",
    "Times that work for me:",
    "",
  ].join("\n");
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Real, sourced numbers only (résumé + miii.in). Shown as the hero proof wall.
export const proof = [
  { value: 40, suffix: "K+", label: "people used the AI product I founded, then sold" },
  { value: 25, suffix: "", label: "countries those users came from" },
  { value: 35, suffix: "%", label: "faster customer support, with an AI assistant I built" },
  { value: 45, suffix: "%", label: "less work for the AI on every question, cutting cost" },
  { value: 56, suffix: "", label: "public releases of my free AI coding tool" },
  { value: 40, suffix: "%", label: "fewer outages after a code overhaul I led" },
];

// The 30-second version, for anyone skimming (recruiters first).
export const quickFacts = [
  { k: "What I do", v: "Design and build AI products end to end: the idea, the screens, and the AI behind them." },
  { k: "Experience", v: "7 years. Founded and sold an AI startup. Led and mentored teams of 4 to 5 engineers." },
  { k: "Looking for", v: "Senior, Staff, or Lead AI / Product Engineer roles." },
  { k: "Where", v: "Based in India. Open to roles anywhere in the world, remote or relocation." },
];

// How I work, each step proven by something real.
export const process = [
  {
    step: "Think",
    line: "Start with the problem, not the tech. Who is this for, what hurts, and what would success look like?",
    proof: "Eye Atlas: patients can't picture their diagnosis, and 30 MB atlases won't load in a waiting room. That one insight shaped every decision.",
    href: "/work/eye-anatomy",
  },
  {
    step: "Design",
    line: "Shape how it should feel before writing code: the flow, the screens, and what to leave out.",
    proof: "Juno streams answers word by word with live tables, so security teams never sit staring at a spinner.",
    href: "#work",
  },
  {
    step: "Build",
    line: "Build it end to end, from the screen you touch to the AI behind it, and make it safe to trust.",
    proof: "miii-cli tests its own work until it passes, asks before every risky action, and rolls back what breaks.",
    href: "/work/miii-cli",
  },
  {
    step: "Measure",
    line: "Ship it, watch what real people do, and improve. Numbers settle arguments, not opinions.",
    proof: "Remote Leaps: 40,000+ users, 35% more interviews for them, and an acquisition at the end.",
    href: "#career",
  },
];

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
  stack?: string; // the technical line, for engineers; the copy above stays plain
}

// Ordered by impact, roles and OSS interleaved. `sub` and `blurb` are written
// for anyone (recruiters included); `stack` carries the detail for engineers.
export const ledger: LedgerEntry[] = [
  {
    kind: "role",
    meta: "2026 — NOW",
    title: "Commotion",
    sub: "Senior Full-Stack AI Engineer",
    blurb:
      "I help software companies keep their products and customers safe. I made the app measurably faster, and led the rebuild of how people sign in and what each kind of user is allowed to see.",
    href: "https://gocommotion.com/",
    hrefLabel: "gocommotion.com",
    stack: "Full-stack · AI · authentication & authorization · performance",
  },
  {
    kind: "role",
    meta: "2025 — 2026",
    title: "JupiterOne",
    sub: "Senior LLM Engineer / AI Systems Architect",
    blurb:
      "I designed and built Juno, an AI assistant that answers big companies' questions about their own security, live, as they type. Support cases were solved 35% faster, and I set up the company's first checks on AI answers in production.",
    href: "https://www.jupiterone.com/",
    hrefLabel: "jupiterone.com",
    stack: "React · TypeScript · AWS Bedrock · SSE streaming · RAG · OWASP LLM Top 10",
  },
  {
    kind: "oss",
    slug: "miii-cli",
    meta: "42★ · 56 RELEASES",
    title: "miii-cli",
    sub: "A free AI coding assistant, like Claude Code, that can run on your own computer.",
    blurb:
      "You describe a change; it plans it, writes the code, runs the tests and keeps going until they pass, undoing anything that breaks. It works with any AI model, including ones that never leave your machine. Free, no account.",
    href: "https://miii.in/",
    hrefLabel: "miii.in",
    stack: "TypeScript · Node · Ink · 14+ model providers · MCP · subagents",
  },
  {
    kind: "role",
    meta: "2023 — 2025",
    title: "Remote Leaps",
    sub: "Founder & Senior AI Product Engineer · Acquired",
    blurb:
      "I started an AI résumé product, designed it, built it, and grew it to 40,000+ users in 25 countries before selling it. Its AI was built never to invent experience, and its scoring helped users land 35% more interviews.",
    href: "https://github.com/maruakshay",
    hrefLabel: "case study",
    stack: "Next.js · constrained decoding · fine-tuned scoring model · led a team of 4",
  },
  {
    kind: "oss",
    slug: "mii-ai-security",
    meta: "OPEN SOURCE · npm",
    title: "mii-ai-security",
    sub: "A security playbook for teams building with AI",
    blurb:
      "AI chatbots can be tricked into leaking data or doing things they shouldn't. These 58 practical guides show engineers how to stop that, organised the way security teams already work.",
    href: "https://github.com/maruakshay/mii-ai-security",
    hrefLabel: "github.com/maruakshay/mii-ai-security",
    stack: "Python · OWASP LLM Top 10 · MITRE · LangChain, LlamaIndex, AutoGen",
  },
  {
    kind: "oss",
    slug: "neuroatlas",
    meta: "LIVE · 3D",
    title: "NeuroAtlas",
    sub: "Explore the human brain in 3D, from whole lobes to single cells",
    blurb:
      "Zoom from the whole brain down to one nerve cell, then switch on a disease like Alzheimer's or stroke and see what it changes at every level. It shows what textbooks can only describe.",
    href: "https://neuroatlas-topaz.vercel.app",
    hrefLabel: "neuroatlas-topaz.vercel.app",
    stack: "Next.js · React Three Fiber · three.js · Zustand · procedural geometry",
  },
  {
    kind: "oss",
    slug: "eye-anatomy",
    meta: "LIVE · 3D",
    title: "Eye Atlas",
    sub: "A 3D eye that helps patients understand their diagnosis",
    blurb:
      "Turn, take apart and slice a medically accurate eye, follow how sight travels to the brain, and try simple vision checks. The whole app loads in about 248 KB, smaller than most photos.",
    href: "https://eye-anatomy-delta.vercel.app",
    hrefLabel: "eye-anatomy-delta.vercel.app",
    stack: "React 19 · three.js · Vite · Tailwind v4 · runtime-generated geometry",
  },
  {
    kind: "oss",
    slug: "miii",
    meta: "OPEN SOURCE · 9★",
    title: "miii",
    sub: "A private AI assistant that runs on your own computer",
    blurb:
      "Chat in the browser or the terminal, and both remember the same conversation. It can read your documents and search the web when you allow it. Nothing leaves your machine.",
    href: "https://github.com/maruakshay/miii",
    hrefLabel: "github.com/maruakshay/miii",
    stack: "Next.js · Ink · LangGraph · Chroma · Ollama",
  },
  {
    kind: "oss",
    meta: "CHROME EXTENSION",
    title: "copytap",
    sub: "Type a shortcut, get the full text",
    blurb:
      "Type :addr and your full address appears, in any box on any website. A small Chrome extension for anything you type more than twice, synced across your browsers.",
    href: "https://github.com/maruakshay/copytap",
    hrefLabel: "github.com/maruakshay/copytap",
    stack: "TypeScript · Chrome Manifest V3",
  },
  {
    kind: "oss",
    meta: "DOCS",
    title: "react-jsx-skills-framework",
    sub: "Clear rules so a whole team builds the same way",
    blurb:
      "Style guides say what good code looks like, not how to decide. These step-by-step checklists for React, JavaScript and styling turn opinions into decisions a team can follow.",
    href: "https://github.com/maruakshay/react-jsx-skills-framework",
    hrefLabel: "github.com/maruakshay/react-jsx-skills-framework",
    stack: "React · JavaScript · CSS-in-JS · decision matrices",
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
  /** One plain-English paragraph anyone can follow. */
  inShort: string;
  /** My part, in three beats: the thinking, the design, the build. */
  how: { think: string; design: string; build: string };
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
      { label: "Status", value: "v3.13.1 · 42★ · 56 releases · MIT" },
      { label: "Install", value: "npm i -g miii-agent" },
    ],
    links: [
      { label: "miii.in", href: "https://miii.in/" },
      { label: "GitHub", href: "https://github.com/maruakshay/miii-cli" },
    ],
    inShort:
      "A free AI helper for programmers. You tell it what to change; it writes the code, tests it, and fixes its own mistakes. It works with paid AI models, or with ones that run privately on your own computer.",
    how: {
      think: "Developers want AI help, but often can't send private code to a cloud company or pay by the word.",
      design: "One small app for the terminal or browser, with a clear \"may I?\" before every risky step, so you stay in control.",
      build: "14+ AI providers, test-until-green with automatic rollback, a checkpoint at every step, and 56 public releases.",
    },
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
        body: "It is the clearest statement of how I think about AI products: small surface, real safety model, no lock-in, no hand-waving about privacy. Fifty-six releases in, it is also proof I maintain what I ship.",
      },
    ],
  },
  {
    slug: "neuroatlas",
    name: "NeuroAtlas",
    tagline: "Explore the brain in 3D from lobes to ion channels, and see what goes wrong in disease.",
    meta: [
      { label: "Stack", value: "Next.js · React Three Fiber · three.js · Zustand · shadcn" },
      { label: "Scope", value: "5 scales · 70+ structures · 15 disorders" },
      { label: "Status", value: "Live on Vercel" },
    ],
    links: [
      { label: "Live", href: "https://neuroatlas-topaz.vercel.app" },
      { label: "GitHub", href: "https://github.com/maruakshay/neuroatlas" },
    ],
    inShort:
      "A 3D map of the human brain you explore in your browser, from whole lobes down to single nerve cells, and see how diseases like Alzheimer's or stroke change it.",
    how: {
      think: "Textbooks teach the brain one level at a time, but a disease hits every level at once.",
      design: "One continuous zoom across five levels, with a disease switch that shows its effect wherever you are.",
      build: "A brain shape generated in code, a working nerve-signal model, and one shared state keeping five 3D scenes in sync.",
    },
    sections: [
      {
        heading: "The problem",
        body: "Neuroscience is taught one scale at a time: a lobe diagram in one chapter, a synapse cartoon in the next, an action-potential graph somewhere else. Disease cuts across all of them at once, and that connection is exactly what static figures cannot show.\n\nNeuroAtlas puts every scale into one navigable 3D space, from the whole brain down to tissue, neurons, synapses, and the ion channels in a single membrane, and lets you watch a disorder land on each of them.",
      },
      {
        heading: "The decisions that mattered",
        body: "- One typed data model for every scale. Structures, neurotransmitters and disorders live in plain TypeScript data, and each disorder declares its effects per scale (atrophy, demyelination, tangles, BBB leak, reactive astrocytes), so a new disease is data, not new scene code.\n- A procedural cortex. The brain surface is generated with noise, and every vertex is assigned to a lobe and functional area (Broca, Wernicke, motor, visual cortex) using the central and Sylvian fissures as boundaries. No multi-megabyte mesh to download, and every region is clickable.\n- A real action-potential model, not a looping animation. Membrane voltage is computed over time with separate modes for normal firing, persistent sodium current, and pump failure, and the channels on screen follow the same curve.\n- Zustand as the single source of state, so the sidebar, info panel, search (⌘K) and five WebGL scenes stay in sync without prop drilling.\n- Mobile and SEO treated as product features: a mobile guide, per-scale metadata, and generated Open Graph images.",
      },
      {
        heading: "What it shows",
        body: "Complex, data-heavy 3D UI, done with production discipline: a typed domain model, scene code that stays dumb, and state that stays in one place. The same skills that go into building an AI product's interface.",
      },
    ],
  },
  {
    slug: "eye-anatomy",
    name: "Eye Atlas",
    tagline: "An interactive 3D atlas of the human eye, built for patient education.",
    meta: [
      { label: "Stack", value: "Vite · React 19 · Tailwind v4 · three.js" },
      { label: "Payload", value: "~248 KB gzipped, Three.js included" },
      { label: "Scope", value: "29 structures · ~231k triangles" },
    ],
    links: [
      { label: "Live", href: "https://eye-anatomy-delta.vercel.app" },
      { label: "GitHub", href: "https://github.com/maruakshay/eye-anatomy" },
    ],
    inShort:
      "A 3D model of the human eye that patients can turn, take apart and explore, so they understand what their eye doctor is telling them.",
    how: {
      think: "Patients struggle to picture their diagnosis, and existing 3D atlases are too heavy for a phone or a clinic screen.",
      design: "A few simple modes (the eye, how it sees, vision checks) with symptoms and red flags linked to each part.",
      build: "29 structures computed from real measurements as the page loads, so the app is ~248 KB instead of 30 MB+.",
    },
    sections: [
      {
        heading: "The problem",
        body: "When a doctor explains a diagnosis, patients nod along to a plastic model or a flat diagram and leave without really understanding it. Most 3D anatomy atlases are 30 MB+ downloads under restrictive share-alike licences, which rules them out for a clinic website or a phone in a waiting room.",
      },
      {
        heading: "The decisions that mattered",
        body: "- Generate the geometry, do not ship it. The eye is nearly spherical and radially symmetric, so all 29 structures are computed at runtime from measured anatomical dimensions. The derived axial length (23.88 mm) and lens thickness (3.53 mm) land on the clinical averages, and the whole app is ~248 KB gzipped.\n- Map vessels in clinical coordinates. Retinal arcades are drawn in fundus coordinates (mm from the fovea) and wrapped onto the sphere, across all five circulations, each selectable to explain a specific disease.\n- Teach the visual pathway by its failures. Eight lesion sites, from retina to occipital cortex, each paired with the visual-field defect it produces, colour-coded by hemifield.\n- Make the screening tests honest. Acuity, Amsler grid, contrast, colour and astigmatism tests are calibrated against a physical reference object, so the measurements mean something on any screen.\n- Tie anatomy to symptoms: a disease database and a red-flag system that tells patients when a symptom needs urgent care.",
      },
      {
        heading: "What it shows",
        body: "First-principles engineering instead of reaching for assets: solving the geometry turned a 30 MB problem into a 248 KB one. It is also a product built for a real audience, patients, with clinical accuracy as the requirement rather than a nice-to-have.",
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
    inShort:
      "A personal AI assistant, like ChatGPT, that runs entirely on your own computer, so your conversations stay private.",
    how: {
      think: "People shouldn't have to choose between a useful assistant and keeping their data to themselves.",
      design: "Two ways to use it, a web app and a terminal app, sharing one memory, with web search off until you turn it on.",
      build: "LangGraph picks the right tool, Chroma lets it answer from your documents, and Ollama runs the model locally.",
    },
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
    inShort:
      "AI chatbots can be tricked into leaking data or misbehaving. This is a free, practical playbook that shows engineering teams how to prevent it.",
    how: {
      think: "Teams ship AI faster than their security habits mature, and most advice is too vague to act on.",
      design: "58 short guides, each with how an attacker thinks, what to fix, and quick wins, written for the tools teams already use.",
      build: "Mapped to OWASP LLM Top 10 and MITRE, with a machine-readable index, validation, and red-team test scripts.",
    },
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
      "Designed and built Juno end to end, an AI assistant for enterprise security teams: answers stream in word by word, with live tables of their systems (React, TypeScript, AWS Bedrock).",
      "Added safety rules so the assistant can't be tricked into leaking data, in a SOC2 / GDPR regulated product (OWASP LLM Top 10, RAG hardening).",
      "Set up automatic quality checks on AI answers, and cut the AI's workload ~45% with caching and summaries (RAGAS, Braintrust).",
    ],
    lead: "Set how the frontend is structured and reviewed, and mentored the team on running AI in production.",
  },
  {
    years: "2023 — 2025",
    org: "Remote Leaps",
    place: "India · remote",
    title: "Founder & Senior AI Product Engineer · acquired",
    points: [
      "Grew an AI resume SaaS to 40K+ users across 25 countries, then sold it.",
      "Built AI writing that sticks to the user's real experience, plus a scoring model that lifted interview rates 35%.",
    ],
    lead: "Led a 4-person engineering team with full ownership of roadmap, architecture, and hiring.",
  },
  {
    years: "2023",
    org: "Virtual Internships",
    place: "London, UK · remote",
    title: "Senior Software Developer",
    points: [
      "Smarter search matching 25,000+ interns with 3,000+ companies: 25% more of them stayed.",
      "A caching layer that cut wasted server requests by 37% (RTK Query).",
    ],
    lead: "Led a TypeScript migration across 20+ services: 40% fewer incidents, and the team shipped twice as fast.",
  },
  {
    years: "2021 — 2023",
    org: "Rapid Innovation",
    place: "Noida, India",
    title: "Software Developer",
    points: ["Built a full NFT marketplace and cut users' transaction fees ~15% (MetaMask, Solidity)."],
    lead: "Mentored 5 junior engineers on API design, testing, and deployment.",
  },
  {
    years: "2020 — 2021",
    org: "KGN Technologies · TopDoc AI",
    place: "India",
    title: "Frontend Engineer · UI Developer",
    points: ["Accessible, secure features for a state platform (20% fewer people leaving early) and a dental software UI (+28% engagement)."],
  },
];

// miii-cli, as published on miii.in.
export const miii = {
  version: "v3.13.1",
  stars: 42,
  releases: 56,
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

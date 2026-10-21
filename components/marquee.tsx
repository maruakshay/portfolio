// A running ticker of what's been shipped and with what. Pure CSS, pauses on
// hover, frozen under reduced motion.
const ITEMS = [
  "Commotion",
  "JupiterOne",
  "AWS Bedrock",
  "Remote Leaps · acquired",
  "miii-cli",
  "OWASP LLM Top 10",
  "LangGraph",
  "RAG",
  "SSE streaming",
  "Next.js",
  "TypeScript",
  "Python",
  "Braintrust evals",
  "MCP",
  "Ollama",
  "LoRA / PEFT",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="group relative overflow-hidden border-y border-rule bg-canvas-deep py-4" aria-label="Companies and tools">
      <div className="flex w-max [animation:marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 font-display text-xl font-bold tracking-tight text-ink-faint md:text-2xl" aria-hidden={i >= ITEMS.length}>
            {t}
            <span className="text-volt">✦</span>
          </span>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-canvas-deep to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-canvas-deep to-transparent" />
    </div>
  );
}

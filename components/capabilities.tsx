import {
  LayoutTemplate,
  Cpu,
  Activity,
  ShieldCheck,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./reveal";

type Cap = { n: string; icon: LucideIcon; k: string; p: string };

const CAPS: Cap[] = [
  {
    n: "01",
    icon: LayoutTemplate,
    k: "Frontend & AI UX",
    p: "React / Next streaming interfaces. The part users actually touch.",
  },
  {
    n: "02",
    icon: Cpu,
    k: "LLM Backend",
    p: "RAG, agents, tool use on Bedrock, OpenAI, Claude, and local models.",
  },
  {
    n: "03",
    icon: Activity,
    k: "LLMOps",
    p: "Evals, caching, monitoring. Catches model regressions before users do.",
  },
  {
    n: "04",
    icon: ShieldCheck,
    k: "AI Security",
    p: "OWASP LLM Top 10, prompt-injection defense, RAG hardening. My day job.",
  },
  {
    n: "05",
    icon: Rocket,
    k: "0 → 1 Product",
    p: "Founded, shipped, and sold an AI SaaS. 40K+ users across 25 countries.",
  },
];

export function Capabilities() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
        <p className="label mb-4 text-amber">The case</p>
        <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.015em] text-paper">
          Most teams split this across three hires. It is one person.
        </h2>
        <p className="prose-mono mt-5 text-[0.9375rem] leading-[1.7] text-paper-muted">
          Frontend, the model behind it, the ops that keep it honest, and the
          security that keeps it shippable. One stack, one owner, no handoffs.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {CAPS.map((c, i) => (
            <Reveal key={c.k} delay={Math.min(i * 0.05, 0.25)} className="h-full">
              <div className="group flex h-full flex-col bg-ground p-5 transition-colors hover:bg-surface">
                <div className="flex items-start justify-between">
                  <c.icon
                    className="size-6 text-paper-faint transition-colors group-hover:text-amber"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="label text-paper-faint">{c.n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-medium leading-tight text-paper">
                  {c.k}
                </h3>
                <p className="prose-mono mt-2.5 text-[0.8125rem] leading-[1.6] text-paper-muted">
                  {c.p}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

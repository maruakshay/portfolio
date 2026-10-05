import {
  LayoutTemplate,
  Cpu,
  Activity,
  ShieldCheck,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { HeroVisual } from "./hero-visual";
import { SectionRule, roman } from "./ornament";

type Cap = { icon: LucideIcon; k: string; p: string };

const CAPS: Cap[] = [
  { icon: LayoutTemplate, k: "Frontend & AI UX", p: "React / Next streaming interfaces. The part users actually touch." },
  { icon: Cpu, k: "LLM Backend", p: "RAG, agents, tool use on Bedrock, OpenAI, Claude, and local models." },
  { icon: Activity, k: "LLMOps", p: "Evals, caching, monitoring. Catches model regressions before users do." },
  { icon: ShieldCheck, k: "AI Security", p: "OWASP LLM Top 10, prompt-injection defense, RAG hardening." },
  { icon: Rocket, k: "0 → 1 Product", p: "Founded, shipped, and sold an AI SaaS. 40K+ users, 25 countries." },
  { icon: Users, k: "Engineering Leadership", p: "Roadmap, architecture, hiring, mentoring, code-review culture." },
];

// How I work: the interactive study of principles on the left, the
// disciplines it produces on the right, as a numbered list not a card wall.
export function Method() {
  return (
    <section id="method" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionRule n="04" label="Method" />
        <h2 className="max-w-[22ch] pt-8 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1] text-ink">
          Most teams split this across three hires.{" "}
          <em className="italic text-sanguine">It is one person.</em>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <figure>
            <div className="frame bg-canvas-deep/50">
              <div className="flex items-center justify-between border-b border-rule px-5 py-3">
                <span className="label flex items-center gap-2 text-ink">
                  <span className="mark mark-blink" aria-hidden />
                  Study of a method
                </span>
                <span className="label">drag · tap to read</span>
              </div>
              <HeroVisual />
            </div>
            <figcaption className="mt-4 text-center font-display text-base italic text-ink-faint">
              Five principles, ink on canvas, rendered live.
            </figcaption>
          </figure>

          <ol className="border-t border-rule">
            {CAPS.map((c, i) => (
              <li key={c.k} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-rule py-4">
                <span className="font-display text-base italic text-gilt">{roman(i + 1)}</span>
                <div>
                  <h3 className="font-display text-[1.5rem] font-normal leading-tight text-ink transition-colors group-hover:text-sanguine">
                    {c.k}
                  </h3>
                  <p className="mt-1 text-[1.0625rem] leading-snug text-ink-muted">{c.p}</p>
                </div>
                <c.icon
                  className="size-5 self-center text-ink-faint transition-colors group-hover:text-sanguine"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

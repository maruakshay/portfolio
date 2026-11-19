import { ArrowUpRight } from "lucide-react";
import { callHref } from "@/lib/content";
import { hero } from "@/lib/home";
import { HeroField } from "./hero-field";
import { Reveal, StaggerWords } from "./motion";

export function Hero() {
  const external = callHref().startsWith("http");
  return (
    <section className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col overflow-hidden" aria-labelledby="hero-title">
      <HeroField />
      {/* Keep copy legible over the field on small screens */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(11,11,12,0.85),transparent_65%)] lg:bg-[radial-gradient(ellipse_at_15%_50%,rgba(11,11,12,0.9),transparent_55%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-4 pb-48 pt-36 sm:justify-center sm:px-6 sm:pb-56 sm:pt-24 lg:px-10 lg:pb-16 lg:pt-16">
        <h1
          id="hero-title"
          className="max-w-[17ch] text-[clamp(2.5rem,min(5.2vw,8.5vh),4.75rem)] leading-[1] tracking-[-0.045em]"
        >
          <StaggerWords text="I don't build demos." />{" "}
          <StaggerWords text="I build AI your customers rely on for years." className="hl" delay={0.2} />
        </h1>

        <Reveal delay={0.45}>
          <p className="mt-6 text-[1.05rem] text-ink">
            {hero.line.map((t, i) => (
              <span key={t}>
                <span className="whitespace-nowrap">
                  {t}
                  {i < hero.line.length - 1 && " ·"}
                </span>{" "}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <a
            href={callHref()}
            target={external ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn-primary mt-12"
          >
            Book a free 20-min call
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

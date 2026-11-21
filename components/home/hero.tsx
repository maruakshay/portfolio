import { ArrowUpRight } from "lucide-react";
import { callHref } from "@/lib/content";
import { hero } from "@/lib/home";
import { availability } from "@/lib/offer";
import { HeroField } from "./hero-field";
import { StaggerWords } from "./motion";

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

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-4 pb-48 pt-32 sm:justify-center sm:px-6 sm:pb-56 sm:pt-24 lg:px-10 lg:pb-16 lg:pt-16">
        <p className="label fade-rise mb-6">
          {hero.eyebrow.map((t, i) => (
            <span key={t}>
              <span className="whitespace-nowrap">
                {t}
                {i < hero.eyebrow.length - 1 && " ·"}
              </span>{" "}
            </span>
          ))}
        </p>

        <h1
          id="hero-title"
          className="max-w-[17ch] text-[clamp(2.5rem,min(5.2vw,8.5vh),4.75rem)] leading-[1] tracking-[-0.045em]"
        >
          <StaggerWords text={hero.headline[0]} />{" "}
          <StaggerWords
            text={hero.headline[1]}
            className="hl"
            delay={0.2}
            marks={{ demo: "mark-strike", production: "mark-volt" }}
          />
        </h1>

        <p
          className="fade-rise mt-6 max-w-[58ch] text-[1.05rem] leading-relaxed text-ink-muted sm:text-[1.15rem]"
          style={{ animationDelay: "0.45s" }}
        >
          {hero.sub.split("**").map((part, i) =>
            i % 2 ? (
              <strong key={i} className="mark-sub">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
        </p>

        <div className="fade-rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.55s" }}>
          <a
            href={callHref()}
            target={external ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book a free 20-min call
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <a href="#services" className="btn-ghost">
            See the Production Trust Audit
          </a>
        </div>

        <p
          className="fade-rise mt-5 flex items-center gap-2.5 text-[0.9rem] text-ink-muted"
          style={{ animationDelay: "0.65s" }}
        >
          <span className="live-dot live-dot-ok" aria-hidden />
          {availability}
        </p>
      </div>
    </section>
  );
}

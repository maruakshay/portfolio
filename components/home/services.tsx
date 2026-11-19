import { profile } from "@/lib/content";
import { skills, type SkillIcon } from "@/lib/home";
import { Reveal } from "./motion";

/* Small looping line icons. Animations live in globals.css (.ico-*) and are
   switched off by the global reduced-motion rule. */
function Icon({ kind }: { kind: SkillIcon }) {
  const common = {
    width: 56,
    height: 56,
    viewBox: "0 0 56 56",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    "aria-hidden": true,
  } as const;
  switch (kind) {
    case "rag":
      return (
        <svg {...common}>
          <rect x="10" y="8" width="26" height="34" rx="2" opacity="0.35" />
          <rect x="16" y="13" width="26" height="34" rx="2" opacity="0.6" />
          <rect x="22" y="18" width="26" height="34" rx="2" />
          <path d="M27 27h16M27 32h12M27 37h14M27 42h9" opacity="0.55" />
          <rect className="ico-scan" x="22" y="18" width="26" height="3" fill="currentColor" stroke="none" opacity="0.5" />
        </svg>
      );
    case "agents":
      return (
        <svg {...common}>
          <circle cx="28" cy="12" r="4" />
          <circle cx="12" cy="40" r="4" />
          <circle cx="44" cy="40" r="4" />
          <path d="M25.5 15.5 14.5 36.5M30.5 15.5l11 21M16 40h24" opacity="0.4" />
          <circle className="ico-orbit" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "evals":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${10 + i * 10})`}>
              <rect x="8" y="0" width="7" height="7" rx="1.5" opacity="0.5" />
              <path className="ico-tick" style={{ animationDelay: `${i * 0.35}s` }} d="M9.5 3.6l1.8 1.8 3-3.4" />
              <path d="M20 3.5h28" opacity="0.25" />
              <path
                className="ico-bar"
                style={{ animationDelay: `${i * 0.35}s` }}
                d={`M20 3.5h${[24, 18, 27, 21][i]}`}
                strokeWidth="1.6"
              />
            </g>
          ))}
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <defs>
            <clipPath id="shield-clip">
              <path d="M28 6 46 12v14c0 12-8 20-18 24C18 46 10 38 10 26V12z" />
            </clipPath>
          </defs>
          <path d="M28 6 46 12v14c0 12-8 20-18 24C18 46 10 38 10 26V12z" />
          <path d="M28 12 40 16v10c0 8-5 14-12 17" opacity="0.35" />
          <g clipPath="url(#shield-clip)">
            <rect className="ico-sweep" x="6" y="6" width="44" height="2" fill="currentColor" stroke="none" opacity="0.6" />
          </g>
        </svg>
      );
    case "stream":
      return (
        <svg {...common}>
          <rect x="6" y="9" width="44" height="38" rx="3" opacity="0.45" />
          {[17, 24, 31, 38].map((y, i) => (
            <path
              key={y}
              className="ico-type"
              style={{ animationDelay: `${i * 0.5}s` }}
              d={`M12 ${y}h${[30, 26, 32, 18][i]}`}
              strokeWidth="1.6"
              pathLength={1}
            />
          ))}
        </svg>
      );
    case "three":
      return (
        <svg {...common}>
          <g className="ico-spin" style={{ transformOrigin: "28px 28px" }}>
            <ellipse cx="28" cy="28" rx="20" ry="20" />
            <ellipse cx="28" cy="28" rx="8" ry="20" opacity="0.55" />
            <ellipse cx="28" cy="28" rx="15" ry="20" opacity="0.35" />
          </g>
          <ellipse cx="28" cy="28" rx="20" ry="7" opacity="0.55" />
        </svg>
      );
  }
}

export function Services() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="label">What I do</p>
            <h2 id="about-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
              The model <em>and</em> the screen it lives on.
            </h2>
          </div>
          <p className="max-w-[48ch] text-ink-muted">
            I&apos;m Akshay, a freelance AI engineer {profile.location === "India" ? "based in India" : ""}, working
            remotely with teams worldwide. Most AI projects stall between the demo and production. I take them across:
            the retrieval, the agent, the evals and security, and the interface people actually use.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {skills.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={(i % 3) * 0.06}
              className={`group flex min-h-[220px] flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7 ${
                s.span === "wide" ? "lg:col-span-2" : ""
              }`}
            >
              <span className="text-ink-muted transition-colors duration-300 group-hover:text-ink">
                <Icon kind={s.icon} />
              </span>
              <span className="mt-10 block">
                <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">{s.title}</span>
                <span className="mt-2 block max-w-[40ch] text-[0.95rem] leading-snug text-ink-muted">{s.body}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

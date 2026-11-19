import { proofStrip } from "@/lib/home";
import { CountUp } from "./motion";

// Spans keep the hairline grid full at every width: 2 cols → 3+2 → 5.
const SPAN = [
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-3",
  "col-span-2 sm:col-span-3",
];

export function Proof() {
  return (
    <section aria-label="Proof" className="border-y border-rule">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-rule sm:grid-cols-6 lg:grid-cols-5">
        {proofStrip.map((p, i) => (
          <li key={p.label} className={`bg-canvas px-4 py-7 sm:px-6 lg:col-span-1 lg:px-8 lg:py-8 ${SPAN[i]}`}>
            <div className="flex flex-col gap-2">
            <span className="text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-volt">
              {p.value !== undefined ? (
                <>
                  {p.prefix}
                  <CountUp to={p.value} />
                  {p.suffix}
                </>
              ) : (
                <span className="hl text-volt">{p.word}</span>
              )}
            </span>
            <span className="max-w-[22ch] text-[0.95rem] leading-snug text-ink-muted">{p.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

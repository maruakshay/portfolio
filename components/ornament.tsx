// Shared ornaments: a section rule that reads like a code comment framing a
// gallery caption, and an artist's monogram used as the site mark.

export function SectionRule({
  n,
  label,
  className = "",
}: {
  n: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="label whitespace-nowrap text-sanguine">
        <span className="text-ink-faint">{"// "}</span>
        {n} — {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-gilt to-transparent" aria-hidden />
    </div>
  );
}

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <circle cx="16" cy="16" r="15" stroke="var(--color-gilt)" strokeWidth="1" />
      <circle cx="16" cy="16" r="12.5" stroke="var(--color-rule)" strokeWidth="0.75" />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fontSize="13"
        fontStyle="italic"
        fontFamily="var(--font-display)"
        fill="var(--color-sanguine)"
      >
        AM
      </text>
    </svg>
  );
}

/** Roman numerals for figure and chapter numbers (1–39 is all we need). */
export function roman(n: number) {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

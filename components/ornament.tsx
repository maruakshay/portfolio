// Shared ornaments: a section rule that reads like a code comment, and the
// site mark.

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
      <span className="label whitespace-nowrap text-volt">
        <span className="text-ink-faint">{"// "}</span>
        {n} — {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-rule to-transparent" aria-hidden />
    </div>
  );
}

/**
 * The mark: a hand-cut "A" whose apex is a chevron, followed by a terminal
 * cursor that keeps blinking. "A, shipping." The cursor stops under
 * reduced motion; on hover the mark tilts like a key being pressed.
 */
export function Monogram({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--color-volt)" />
      <path
        d="M6 23.5 12.1 8.5h1.3l6.1 15"
        stroke="var(--color-canvas)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.9 18.4h7.6" stroke="var(--color-canvas)" strokeWidth="3" strokeLinecap="round" />
      <rect
        x="21.2"
        y="21"
        width="6.4"
        height="2.8"
        rx="1.2"
        fill="var(--color-canvas)"
        className={animated ? "mark-blink" : undefined}
      />
    </svg>
  );
}

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
 * The mark: an "@" stroked with the brand gradient. Matching copies live in
 * `app/icon.svg` and `lib/brand.tsx`; change all three together.
 */
export function Monogram({ className = "" }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      stroke="url(#am-mark-grad)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="am-mark-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="0.45" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#ff3d8b" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  );
}

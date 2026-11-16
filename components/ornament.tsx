import { MarkSvg } from "@/lib/brand";

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

/** The "AM" mark (see lib/brand.tsx). Matching copy in app/icon.svg. */
export function Monogram({ className = "" }: { className?: string; animated?: boolean }) {
  return (
    <span className={className} aria-hidden style={{ display: "inline-block", lineHeight: 0 }}>
      <MarkSvg size={24} id="am-mono" />
    </span>
  );
}

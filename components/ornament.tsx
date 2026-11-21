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
      <span className="label whitespace-nowrap">
        {n} — {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-rule to-transparent" aria-hidden />
    </div>
  );
}

/** The "am." mark (see lib/brand.tsx). Matching copy in app/icon.svg. */
export function Monogram({ className = "" }: { className?: string; animated?: boolean }) {
  return (
    <span className={className} aria-hidden style={{ display: "inline-block", lineHeight: 0 }}>
      <MarkSvg size={24} id="am-mono" />
    </span>
  );
}

/**
 * Text version of the mark for the header and footers: live serif "am" plus
 * the orange square full stop, sized in em so it follows the font size.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`hl inline-flex items-baseline normal-case ${className}`}>
      am
      <span
        aria-hidden
        className="ml-[0.06em] inline-block size-[0.17em] bg-volt"
      />
    </span>
  );
}

// The mark as plain JSX for next/og image routes (icons, social cards),
// where CSS variables and classes aren't available. Mirrors components/ornament.tsx (the "@").
export const BRAND = {
  paper: "#efece6",
  ink: "#141414",
  dim: "#7a7873",
  amber: "#ffb347",
  orange: "#ff8a3d",
  coral: "#ff5a5f",
  pink: "#ff3d8b",
};

export function MarkSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="g" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRAND.amber} />
          <stop offset="0.45" stopColor={BRAND.orange} />
          <stop offset="1" stopColor={BRAND.pink} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4" stroke="url(#g)" strokeWidth="2.4" />
      <path
        d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"
        stroke="url(#g)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

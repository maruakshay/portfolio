// The brand mark: an "AM" ligature drawn as one stroke. The A and the M read
// as rooftops on a street, and the dot above the M is the little AI that walks
// with you in the town. Plain JSX so next/og routes (icons, social cards) can
// use it; the canvas sign in the game draws the same paths.

export const BRAND = {
  paper: "#efece6",
  ink: "#141414",
  dim: "#7a7873",
  amber: "#ffb347",
  orange: "#ff8a3d",
  coral: "#ff5a5f",
  pink: "#ff3d8b",
};

/** Geometry on a 32×32 grid. */
export const LOGO = {
  stroke: "M6.5 24 L11.75 8.5 L17 24 V9.5 L21.25 17.5 L25.5 9.5 V24",
  bar: "M8.9 18.4 H14.6",
  dot: { cx: 21.25, cy: 6.4, r: 2 },
  width: 2.7,
};

export function MarkSvg({ size, tile = true, id = "am-g" }: { size: number; tile?: boolean; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRAND.amber} />
          <stop offset="0.5" stopColor={BRAND.orange} />
          <stop offset="1" stopColor={BRAND.pink} />
        </linearGradient>
      </defs>
      {tile && <rect width="32" height="32" rx="8" fill={BRAND.ink} />}
      <path d={LOGO.stroke} stroke={`url(#${id})`} strokeWidth={LOGO.width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={LOGO.bar} stroke={`url(#${id})`} strokeWidth={LOGO.width} strokeLinecap="round" />
      <circle {...LOGO.dot} fill={BRAND.pink} />
    </svg>
  );
}

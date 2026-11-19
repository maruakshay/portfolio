// Brand marks. BRAND + LOGO: the original stroke "AM" ligature, still painted
// on the town's street sign (components/game/world.ts). MARK + MarkSvg: the
// current site mark used for icons, social cards and the town HUD. Plain JSX
// so next/og routes can render it.

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

/**
 * Site mark (2026-11 Night Edition): "AM" in Source Serif 4 bold italic,
 * converted to outlines, on a near-black tile with an orange baseline bar.
 * Same geometry as app/icon.svg and app/favicon.ico (64×64 grid).
 */
export const MARK = {
  ink: "#0B0B0C",
  paper: "#F2ECE2",
  accent: "#FF5A1F",
  am: "M5.5 38.55 5.89 36.53 8.39 36.34 18.44 17.45H22.43L25.38 36.4L27.86 36.53L27.47 38.55H17.22L17.61 36.53L20.28 36.4L19.73 32.29H12.7L10.61 36.34L13.21 36.53L12.82 38.55ZM19.47 30.36 18.16 20.72 17.1 23.68 13.69 30.36ZM27.6 38.55 27.98 36.53 30.84 36.34 34.76 19.57 32.29 19.47 32.67 17.45H40.51L42.66 32.77L44.08 29.27L50.24 17.45H58.5L58.11 19.47L55.61 19.6L54.32 28.5Q53.97 31 53.62 33.51Q53.42 34.95 53.23 36.4L55.83 36.53L55.48 38.55H45.46L45.81 36.53L48.25 36.4L50.37 21.66L49.28 24.16L41.54 38.55H38.75L36.24 21.37L34.73 28.53L32.96 36.34L35.73 36.53L35.37 38.55Z",
  bar: { x: 12, y: 43.6, width: 40, height: 4, rx: 2 },
};

export function MarkSvg({ size, tile = true }: { size: number; tile?: boolean; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {tile && <rect width="64" height="64" rx="14" fill={MARK.ink} />}
      <path d={MARK.am} fill={MARK.paper} />
      <rect {...MARK.bar} fill={MARK.accent} />
    </svg>
  );
}

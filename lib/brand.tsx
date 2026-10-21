// The mark as plain JSX for next/og image routes (icons, social cards),
// where CSS variables and classes aren't available.
export const BRAND = { volt: "#C8F53A", canvas: "#121218", ink: "#F7F7F2", faint: "#8B8C9C" };

export function MarkSvg({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="1" y="1" width="30" height="30" rx="9" fill={BRAND.volt} />
      <path d="M6 23.5 12.1 8.5h1.3l6.1 15" stroke={BRAND.canvas} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.9 18.4h7.6" stroke={BRAND.canvas} strokeWidth="3" strokeLinecap="round" />
      <rect x="21.2" y="21" width="6.4" height="2.8" rx="1.2" fill={BRAND.canvas} />
    </svg>
  );
}

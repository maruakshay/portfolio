import { ImageResponse } from "next/og";
import { BRAND, MarkSvg } from "@/lib/brand";

export const alt = "Akshay Maru, AI product engineer: most AI demos die in production. Mine ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STATS = [
  ["40K+", "users · founded & sold"],
  ["35%", "faster support with Juno"],
  ["49", "open-source releases"],
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: BRAND.canvas,
          backgroundImage: `radial-gradient(circle at 20% 0%, rgba(200,245,58,0.18), transparent 55%)`,
          color: BRAND.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <MarkSvg size={64} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>Akshay Maru</span>
            <span style={{ fontSize: 20, color: BRAND.faint, letterSpacing: 3 }}>AI PRODUCT ENGINEER</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Most AI demos die in</span>
          <span style={{ color: BRAND.volt }}>production.</span>
          <span style={{ color: BRAND.faint }}>Mine ship.</span>
        </div>

        <div style={{ display: "flex", gap: 56 }}>
          {STATS.map(([v, l]) => (
            <div key={v} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: BRAND.volt }}>{v}</span>
              <span style={{ fontSize: 22, color: BRAND.faint }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

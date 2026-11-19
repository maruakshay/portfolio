import { ImageResponse } from "next/og";
import { C, OG_SIZE, OgFrame, ogFonts } from "@/lib/og";

export const alt =
  "Akshay Maru, freelance AI engineer: I don't build demos. I build AI your customers rely on for years.";
export const size = OG_SIZE;
export const contentType = "image/png";

const PROOF = [
  { k: "40K+", v: "users on my AI SaaS" },
  { k: "Sold", v: "my AI SaaS, acquired" },
  { k: "~45%", v: "AI cost cut at JupiterOne" },
];

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame tag="OPEN FOR FREELANCE PROJECTS">
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -3.4 }}>
          <span>I don&apos;t build demos.</span>
          <span style={{ fontFamily: "Source Serif", fontStyle: "italic", fontWeight: 700, letterSpacing: -1.5, marginTop: 6 }}>
            I build AI your customers
          </span>
          <span style={{ fontFamily: "Source Serif", fontStyle: "italic", fontWeight: 700, letterSpacing: -1.5 }}>
            rely on for years.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${C.rule}`, paddingTop: 26 }}>
          <div style={{ display: "flex", gap: 56 }}>
            {PROOF.map((p) => (
              <div key={p.k} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 44, letterSpacing: -1.5, color: C.accent, lineHeight: 1 }}>{p.k}</span>
                <span style={{ fontSize: 20, color: C.muted }}>{p.v}</span>
              </div>
            ))}
          </div>
          <span style={{ fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 2, color: C.faint }}>FREELANCE AI ENGINEER</span>
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await ogFonts() },
  );
}

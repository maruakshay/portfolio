import { ImageResponse } from "next/og";
import { deepDives, getDeepDive } from "@/lib/content";
import { C, OG_SIZE, OgFrame, ogFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Project deep-dive by Akshay Maru, freelance AI engineer";

// The card fonts are Latin subsets: spell out symbols they don't cover.
const plain = (t: string) => t.replace(/≥\s*/g, ">= ").replace(/(\d+)★/g, "$1 stars");

export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}

export default async function WorkOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dive = getDeepDive(slug);
  const name = dive?.name ?? "Akshay Maru";
  const tagline = dive?.tagline ?? "Freelance AI engineer";
  const meta = dive?.meta.slice(0, 2) ?? [];

  return new ImageResponse(
    (
      <OgFrame tag="PROJECT DEEP-DIVE">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 112, lineHeight: 1, letterSpacing: -4.5 }}>{name}</span>
          <span
            style={{
              fontFamily: "Source Serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.15,
              letterSpacing: -0.8,
              maxWidth: 980,
            }}
          >
            {tagline}
          </span>
        </div>
        <div style={{ display: "flex", gap: 56, borderTop: `1px solid ${C.rule}`, paddingTop: 26 }}>
          {meta.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 480 }}>
              <span style={{ fontFamily: "Plex Mono", fontSize: 16, letterSpacing: 2.5, color: C.faint }}>
                {m.label.toUpperCase()}
              </span>
              <span style={{ fontSize: 24, color: C.muted }}>{plain(m.value)}</span>
            </div>
          ))}
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await ogFonts() },
  );
}

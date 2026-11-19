import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MARK, MarkSvg } from "@/lib/brand";

// Shared pieces for next/og share images (rendered at build time).
// Fonts are local woff files so builds never depend on a network fetch.

export const OG_SIZE = { width: 1200, height: 630 };

export const C = {
  bg: MARK.ink,
  ink: MARK.paper,
  muted: "rgba(242,236,226,0.68)",
  faint: "rgba(242,236,226,0.45)",
  rule: "rgba(242,236,226,0.14)",
  accent: MARK.accent,
};

export async function ogFonts() {
  const dir = join(process.cwd(), "lib/og-fonts");
  const [sans, serif, mono] = await Promise.all([
    readFile(join(dir, "inter-tight-latin-500-normal.woff")),
    readFile(join(dir, "source-serif-4-latin-700-italic.woff")),
    readFile(join(dir, "ibm-plex-mono-latin-500-normal.woff")),
  ]);
  return [
    { name: "Inter Tight", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "Source Serif", data: serif, weight: 700 as const, style: "italic" as const },
    { name: "Plex Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

/** Dark card frame: faint dot grid, header with mark + availability. */
export function OgFrame({ children, tag }: { children: React.ReactNode; tag: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px",
        backgroundColor: C.bg,
        backgroundImage: "radial-gradient(circle, rgba(242,236,226,0.10) 1.2px, transparent 1.4px)",
        backgroundSize: "28px 28px",
        color: C.ink,
        fontFamily: "Inter Tight",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <MarkSvg size={56} />
          <span style={{ fontFamily: "Plex Mono", fontSize: 22, letterSpacing: 3, color: C.muted }}>AKSHAY MARU</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Plex Mono", fontSize: 20, letterSpacing: 2.5, color: C.muted }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: C.accent }} />
          {tag}
        </div>
      </div>
      {children}
    </div>
  );
}

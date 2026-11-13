import { ImageResponse } from "next/og";
import { BRAND, MarkSvg } from "@/lib/brand";

export const alt = "Akshay Maru: freelance AI engineer and content creator. Open for freelance projects.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRAD = `linear-gradient(90deg, ${BRAND.amber}, ${BRAND.orange}, ${BRAND.coral}, ${BRAND.pink})`;

function Boxed({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", padding: 3, background: GRAD, alignSelf: "flex-start" }}>
      <div style={{ display: "flex", background: BRAND.paper, padding: "4px 22px 10px" }}>{text}</div>
    </div>
  );
}

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
          background: BRAND.paper,
          backgroundImage:
            "linear-gradient(90deg, transparent 203px, rgba(20,20,20,.09) 203px, rgba(20,20,20,.09) 204px, transparent 204px, transparent 995px, rgba(20,20,20,.09) 995px, rgba(20,20,20,.09) 996px, transparent 996px)",
          color: BRAND.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <MarkSvg size={56} />
            <span style={{ fontSize: 30, letterSpacing: 2 }}>AKSHAY MARU</span>
          </div>
          <span style={{ fontSize: 22, letterSpacing: 3, border: `2px solid ${BRAND.ink}`, padding: "8px 18px" }}>
            •• OPEN FOR FREELANCE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 104, lineHeight: 1, letterSpacing: -3 }}>
          <Boxed text="AI Engineer" />
          <Boxed text="& Creator" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: BRAND.dim, letterSpacing: 2 }}>
          <span>AI PRODUCTS · RAG & AGENTS · LLM SECURITY</span>
          <span>@AKSHAAY.AI · @AKSHAAY.LIFTS</span>
        </div>
      </div>
    ),
    size,
  );
}

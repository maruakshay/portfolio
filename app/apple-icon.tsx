import { ImageResponse } from "next/og";
import { BRAND, MarkSvg } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS adds its own rounded mask, so the mark sits on a full-bleed tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BRAND.volt }}>
        <MarkSvg size={180} />
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";
import { MARK, MarkSvg } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS applies its own rounded mask, so the mark sits on a full-bleed tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: MARK.ink }}>
        <MarkSvg size={180} tile={false} />
      </div>
    ),
    size,
  );
}

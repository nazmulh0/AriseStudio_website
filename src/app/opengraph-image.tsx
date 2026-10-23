import { ImageResponse } from "next/og";
export const alt = "AriseStudio — automation and custom software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f7f9f5",
          color: "#123d2a",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
          AriseStudio
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.15,
          }}
        >
          <span>Less manual work.</span>
          <span>More room to grow.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#526759" }}>
          Business automation · Custom software · Managed IT
        </div>
      </div>
    ),
    size,
  );
}
